import { IpinfoResponse } from './ipinfo';

// Example payload from ipinfo.io API
// This represents a typical response structure with anonymized data
export const ipinfoExamplePayload: IpinfoResponse = {
    ip: "192.168.1.100",
    hostname: "example-host.example.com",
    city: "San Francisco",
    region: "California",
    country: "US",
    loc: "37.7749,-122.4194",
    org: "AS12345 Example Networks",
    postal: "94105",
    timezone: "America/Los_Angeles",
    readme: "https://ipinfo.io/missingauth"
};