import { NormalizedIpResponse } from './types';

export interface IpApiResponse {
    status: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
    org: string;
    as: string;
    query: string;
}

export const IP_API_CONFIG = {
    buildUrl: (ip: string) => `http://ip-api.com/json/${encodeURIComponent(ip)}`,
};

export function mapIpApiResponse(response: IpApiResponse, raw: any): NormalizedIpResponse {
    return {
        ip: response.query || null,
        country: response.country || null,
        countryCode: response.countryCode || null,
        isp: response.isp || response.org || null,
        provider: 'ip-api',
        raw,
    };
}
