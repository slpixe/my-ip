import { NextResponse } from 'next/server';
import { getTrustedClientIp, validateIpAddress } from './clientIp';
import { PROVIDERS } from './providers';
import { checkRateLimit } from './rateLimit';

const NO_STORE_HEADERS = {
    'Cache-Control': 'private, no-store, no-cache, max-age=0, must-revalidate',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
};

const PUBLIC_PROVIDERS = new Set(['cloudflare', 'ip-api', 'ipinfo', 'ipapi']);

function jsonResponse(body: unknown, init: ResponseInit = {}) {
    const headers = new Headers(init.headers);
    Object.entries(NO_STORE_HEADERS).forEach(([name, value]) => headers.set(name, value));
    return NextResponse.json(body, { ...init, headers });
}

function decodeHeaderValue(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function boundedText(value: unknown, maxLength = 256): string | null {
    return typeof value === 'string' && value.length > 0
        ? value.slice(0, maxLength)
        : null;
}

function publicIpResponse(
    normalized: {
        provider: string;
        country: string | null;
        countryCode: string | null;
        isp: string | null;
    },
    ip: string
) {
    return {
        ip,
        provider: boundedText(normalized.provider, 32) || 'unknown',
        country: boundedText(normalized.country),
        countryCode: boundedText(normalized.countryCode, 16),
        isp: boundedText(normalized.isp),
    };
}

async function fetchWithTimeout(url: string, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        return await fetch(url, {
            cache: 'no-store',
            headers: {
                Accept: 'application/json',
                'User-Agent': 'my-ip/1.0',
            },
            signal: controller.signal,
        });
    } finally {
        clearTimeout(id);
    }
}

async function parseResponseBody(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return response.json();
    }

    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        return { raw: text };
    }
}

async function detectDevelopmentIp(): Promise<string | null> {
    if (process.env.NODE_ENV !== 'development') return null;

    try {
        const response = await fetchWithTimeout(PROVIDERS.ipify.buildUrl(''));
        const body = await parseResponseBody(response);
        const normalized = PROVIDERS.ipify.mapper(body, body);
        return validateIpAddress(normalized.ip);
    } catch {
        return null;
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const provider = (url.searchParams.get('provider') || 'cloudflare').toLowerCase();

        if (!PUBLIC_PROVIDERS.has(provider)) {
            return jsonResponse(
                { error: 'Unsupported provider', provider },
                { status: 400 }
            );
        }

        const detectedClient = getTrustedClientIp(request);
        const clientIp = detectedClient.ip || await detectDevelopmentIp();

        if (!clientIp) {
            return jsonResponse(
                {
                    error: 'Unable to determine a valid client IP address',
                    message: 'No trusted Cloudflare or Vercel client IP header was available.',
                },
                { status: 503 }
            );
        }

        const userAgent = request.headers.get('user-agent') || '';
        const clientId = `${clientIp}-${userAgent.slice(0, 50)}`;

        if (!await checkRateLimit(clientId)) {
            return jsonResponse(
                {
                    error: 'Rate limit exceeded',
                    message: 'Please wait before requesting another lookup.',
                    retryAfter: 10,
                },
                {
                    status: 429,
                    headers: { 'Retry-After': '10' },
                }
            );
        }

        if (provider === 'cloudflare') {
            const cfCountry = request.headers.get('cf-ipcountry');
            const openNextCountry = request.headers.get('x-open-next-country');
            const openNextCity = request.headers.get('x-open-next-city');
            const vercelCountry = request.headers.get('x-vercel-ip-country');
            const vercelCity = request.headers.get('x-vercel-ip-city');
            const detectedCountry = cfCountry || openNextCountry || vercelCountry;
            const detectedCity = openNextCity || vercelCity;

            return jsonResponse({
                ip: clientIp,
                provider: 'cloudflare',
                country: boundedText(
                    detectedCity && detectedCountry
                        ? `${decodeHeaderValue(detectedCity)}, ${detectedCountry}`
                        : detectedCountry
                ),
                countryCode: boundedText(detectedCountry, 16),
                isp: null,
            });
        }

        const entry = PROVIDERS[provider];
        const response = await fetchWithTimeout(entry.buildUrl(clientIp), entry.timeoutMs);
        const body = await parseResponseBody(response);

        if (!response.ok || body?.error === true || body?.status === 'fail') {
            const isRateLimited = response.status === 429 || body?.reason === 'RateLimited';
            const retryAfter = response.headers.get('retry-after') ||
                (body?.wait ? String(Math.ceil(Number(body.wait))) : null);

            return jsonResponse(
                {
                    error: isRateLimited ? 'Provider rate limit exceeded' : 'IP provider request failed',
                    provider,
                    upstreamStatus: response.status,
                    details: boundedText(body?.message || body?.reason, 200),
                    retryAfter: retryAfter ? Number(retryAfter) : undefined,
                },
                {
                    status: isRateLimited ? 429 : 502,
                    headers: retryAfter ? { 'Retry-After': retryAfter } : undefined,
                }
            );
        }

        const normalized = entry.mapper(body, body);

        // The platform header is authoritative. External services enrich this
        // IP rather than detecting the Worker's own egress address. Do not
        // expose provider-specific raw payloads to clients.
        return jsonResponse(publicIpResponse(normalized, clientIp));
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            return jsonResponse({ error: 'Request timed out' }, { status: 504 });
        }

        return jsonResponse(
            { error: 'Failed to fetch WAN IP' },
            { status: 500 }
        );
    }
}
