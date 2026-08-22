// Shared types for IP provider responses

// Normalized IP response structure
export interface NormalizedIpResponse {
    ip: string | null;
    country: string | null;        // Full country name
    countryCode: string | null;    // 2-letter country code (ISO 3166-1 alpha-2)
    isp: string | null;            // ISP/Organization information
    provider: string;
    raw: any;
}