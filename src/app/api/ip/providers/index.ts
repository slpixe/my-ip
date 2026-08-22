import { NormalizedIpResponse } from './types';
import { IPIFY_CONFIG, mapIpifyResponse } from './ipify';
import { IP_API_CONFIG, mapIpApiResponse } from './ip-api';
import { IPINFO_CONFIG, mapIpinfoResponse } from './ipinfo';
import { IPAPI_CONFIG, mapIpapiResponse } from './ipapi';

export interface Provider {
    buildUrl: (ip: string) => string;
    mapper: (response: any, raw: any) => NormalizedIpResponse;
    timeoutMs?: number;
}

export const PROVIDERS: Record<string, Provider> = {
    cloudflare: {
        buildUrl: () => '', // Not used - data comes from trusted platform metadata
        mapper: (response: any, raw: any) => ({
            ip: raw?.['CF-Connecting-IP'] || null,
            provider: 'cloudflare',
            country: raw?.['CF-IPCountry'] || null,
            countryCode: raw?.['CF-IPCountry'] || null,
            isp: null,
            raw
        }),
    },
    ipify: {
        buildUrl: IPIFY_CONFIG.buildUrl,
        mapper: mapIpifyResponse,
    },
    'ip-api': {
        buildUrl: IP_API_CONFIG.buildUrl,
        mapper: mapIpApiResponse,
    },
    ipinfo: {
        buildUrl: IPINFO_CONFIG.buildUrl,
        mapper: mapIpinfoResponse,
    },
    ipapi: {
        buildUrl: IPAPI_CONFIG.buildUrl,
        mapper: mapIpapiResponse,
        timeoutMs: 12000,
    },
};

export type { NormalizedIpResponse } from './types';
