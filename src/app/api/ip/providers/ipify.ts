import { NormalizedIpResponse } from './types';

export interface IpifyResponse {
    ip: string;
}

export const IPIFY_CONFIG = {
    buildUrl: (_ip: string) => 'https://api.ipify.org?format=json',
};

export function mapIpifyResponse(response: IpifyResponse, raw: any): NormalizedIpResponse {
    return {
        ip: response.ip || null,
        country: null, // ipify doesn't provide country information
        countryCode: null, // ipify doesn't provide country information
        isp: null, // ipify doesn't provide ISP information
        provider: 'ipify',
        raw,
    };
}
