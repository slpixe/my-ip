import { NormalizedIpResponse } from './types';

export interface IpinfoResponse {
    ip: string;
    hostname: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    postal: string;
    timezone: string;
    readme: string;
}

export const IPINFO_CONFIG = {
    buildUrl: (ip: string) => {
        const url = new URL(`https://ipinfo.io/${encodeURIComponent(ip)}/json`);
        const token = process.env.IPINFO_TOKEN;

        if (token) {
            url.searchParams.set('token', token);
        }

        return url.toString();
    },
};

export function mapIpinfoResponse(response: IpinfoResponse, raw: any): NormalizedIpResponse {
    return {
        ip: response.ip || null,
        country: null, // ipinfo.io only provides country code, not full name
        countryCode: response.country || null,
        isp: response.org || null,
        provider: 'ipinfo',
        raw,
    };
}
