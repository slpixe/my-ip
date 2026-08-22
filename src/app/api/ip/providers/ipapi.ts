import { NormalizedIpResponse } from './types';

export interface IpapiResponse {
    ip: string;
    network: string;
    version: string;
    city: string;
    region: string;
    region_code: string;
    country: string;
    country_name: string;
    country_code: string;
    country_code_iso3: string;
    country_capital: string;
    country_tld: string;
    continent_code: string;
    in_eu: boolean;
    postal: string;
    latitude: number;
    longitude: number;
    timezone: string;
    utc_offset: string;
    country_calling_code: string;
    currency: string;
    currency_name: string;
    languages: string;
    country_area: number;
    country_population: number;
    asn: string;
    org: string;
}

export const IPAPI_CONFIG = {
    buildUrl: (ip: string) => `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
};

export function mapIpapiResponse(response: IpapiResponse, raw: any): NormalizedIpResponse {
    return {
        ip: response.ip || null,
        country: response.country_name || null,
        countryCode: response.country_code || null,
        isp: response.org || null,
        provider: 'ipapi',
        raw,
    };
}
