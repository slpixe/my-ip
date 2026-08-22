import { IpapiResponse } from './ipapi';

// Example payload from ipapi.co API
// This represents a typical response structure with anonymized data
export const ipapiExamplePayload: IpapiResponse = {
    ip: "192.168.1.100",
    network: "192.168.1.0/24",
    version: "IPv4",
    city: "San Francisco",
    region: "California",
    region_code: "CA",
    country: "US",
    country_name: "United States",
    country_code: "US",
    country_code_iso3: "USA",
    country_capital: "Washington D.C.",
    country_tld: ".us",
    continent_code: "NA",
    in_eu: false,
    postal: "94105",
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: "America/Los_Angeles",
    utc_offset: "-0800",
    country_calling_code: "+1",
    currency: "USD",
    currency_name: "US Dollar",
    languages: "en-US,es-US",
    country_area: 9833517,
    country_population: 331900000,
    asn: "AS12345",
    org: "Example Networks Inc"
};