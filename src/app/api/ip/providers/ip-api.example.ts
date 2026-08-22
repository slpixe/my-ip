import { IpApiResponse } from './ip-api';

// Example payload from ip-api.com API
// This represents a typical response structure with anonymized data
export const ipApiExamplePayload: IpApiResponse = {
    status: "success",
    country: "United States",
    countryCode: "US",
    region: "CA",
    regionName: "California",
    city: "San Francisco",
    zip: "94105",
    lat: 37.7749,
    lon: -122.4194,
    timezone: "America/Los_Angeles",
    isp: "Example ISP",
    org: "Example Organization",
    as: "AS12345 Example Networks",
    query: "192.168.1.100"
};