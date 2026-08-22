interface RateLimitBinding {
    limit(options: { key: string }): Promise<{ success: boolean }>;
}

const RATE_LIMIT_MS = 2000;
const MAX_REQUESTS_PER_WINDOW = 2;
const lastRequestTimes = new Map<string, number[]>();

function checkInMemoryRateLimit(clientId: string): boolean {
    const now = Date.now();
    const requests = lastRequestTimes.get(clientId) || [];
    const recentRequests = requests.filter(time => now - time < RATE_LIMIT_MS);

    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    recentRequests.push(now);
    lastRequestTimes.set(clientId, recentRequests);

    if (lastRequestTimes.size > 1000) {
        const entries = Array.from(lastRequestTimes.entries()).sort((a, b) => {
            const aLatest = Math.max(...a[1]);
            const bLatest = Math.max(...b[1]);
            return bLatest - aLatest;
        });
        lastRequestTimes.clear();
        entries.slice(0, 500).forEach(([key, times]) => lastRequestTimes.set(key, times));
    }

    return true;
}

async function getCloudflareRateLimiter(): Promise<RateLimitBinding | null> {
    try {
        const { getCloudflareContext } = await import('@opennextjs/cloudflare');
        // In a deployed OpenNext Worker the request context is already present.
        // Sync mode also fails immediately on other hosts instead of attempting
        // to construct a Wrangler development environment for every request.
        const { env } = getCloudflareContext();
        return (env as CloudflareEnv & { WAN_IP_RATE_LIMITER?: RateLimitBinding })
            .WAN_IP_RATE_LIMITER || null;
    } catch {
        return null;
    }
}

export async function checkRateLimit(clientId: string): Promise<boolean> {
    const cloudflareRateLimiter = await getCloudflareRateLimiter();

    if (cloudflareRateLimiter) {
        const result = await cloudflareRateLimiter.limit({ key: clientId });
        return result.success;
    }

    // Local development and non-Cloudflare deployments retain a best-effort
    // fallback. Production Cloudflare deployments use the distributed binding.
    return checkInMemoryRateLimit(clientId);
}

export const FALLBACK_RATE_LIMIT = {
    limit: MAX_REQUESTS_PER_WINDOW,
    windowSeconds: RATE_LIMIT_MS / 1000,
};
