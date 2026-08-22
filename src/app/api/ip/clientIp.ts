import { isIP } from 'node:net';

export type ClientIpSource =
    | 'cloudflare'
    | 'vercel'
    | 'development-proxy'
    | 'unavailable';

export interface ClientIpResult {
    ip: string | null;
    source: ClientIpSource;
}

function firstForwardedAddress(value: string | null): string | null {
    return value?.split(',')[0]?.trim() || null;
}

export function validateIpAddress(value: string | null): string | null {
    if (!value) return null;
    return isIP(value) === 0 ? null : value;
}

export function getTrustedClientIp(request: Request): ClientIpResult {
    const headers = request.headers;
    const cloudflareRequest = request as Request & { cf?: unknown };
    // Only the deployment environment may select the Vercel trust path.
    // Client-supplied Vercel-looking headers are not an authentication signal.
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

    if (isVercel) {
        const ip = validateIpAddress(
            firstForwardedAddress(headers.get('x-vercel-forwarded-for')) ||
            firstForwardedAddress(headers.get('x-forwarded-for')) ||
            headers.get('x-real-ip')
        );

        return { ip, source: ip ? 'vercel' : 'unavailable' };
    }

    // OpenNext receives Cloudflare's request metadata on request.cf. Do not
    // use a client-provided CF-Ray header as a proxy-authentication signal.
    if (cloudflareRequest.cf !== undefined) {
        const ip = validateIpAddress(headers.get('cf-connecting-ip'));
        return { ip, source: ip ? 'cloudflare' : 'unavailable' };
    }

    // This fallback is intentionally restricted to development. Production
    // deployments must identify and trust their actual reverse proxy.
    if (process.env.NODE_ENV === 'development') {
        const ip = validateIpAddress(
            firstForwardedAddress(headers.get('x-forwarded-for')) ||
            headers.get('x-real-ip')
        );
        return { ip, source: ip ? 'development-proxy' : 'unavailable' };
    }

    return { ip: null, source: 'unavailable' };
}
