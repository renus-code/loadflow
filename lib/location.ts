/**
 * ======================================================================================
 * UTILITY: Location Services (External API Bridge)
 * ======================================================================================
 * Orchestrates real-time geographic data retrieval from global providers.
 * 
 * Features:
 * 1. Dynamic City Discovery: Integrates with CountriesNow API for state-specific city lists.
 * 2. Intelligent Mapping: Synchronizes regional codes with external country/state schemas.
 * 3. Error Tolerance: Implements resilient fetch patterns with graceful fallback to empty sets.
 * 4. Contextual Resolution: Parses combined state-code strings for high-accuracy API calls.
 * ======================================================================================
 */
// US States and Canadian Provinces data for shared use
export const US_STATES: [string, string, string][] = [
  ["AL", "Alabama", "🇺🇸"],
  ["AK", "Alaska", "🇺🇸"],
  ["AZ", "Arizona", "🇺🇸"],
  ["AR", "Arkansas", "🇺🇸"],
  ["CA", "California", "🇺🇸"],
  ["CO", "Colorado", "🇺🇸"],
  ["CT", "Connecticut", "🇺🇸"],
  ["DE", "Delaware", "🇺🇸"],
  ["FL", "Florida", "🇺🇸"],
  ["GA", "Georgia", "🇺🇸"],
  ["HI", "Hawaii", "🇺🇸"],
  ["ID", "Idaho", "🇺🇸"],
  ["IL", "Illinois", "🇺🇸"],
  ["IN", "Indiana", "🇺🇸"],
  ["IA", "Iowa", "🇺🇸"],
  ["KS", "Kansas", "🇺🇸"],
  ["KY", "Kentucky", "🇺🇸"],
  ["LA", "Louisiana", "🇺🇸"],
  ["ME", "Maine", "🇺🇸"],
  ["MD", "Maryland", "🇺🇸"],
  ["MA", "Massachusetts", "🇺🇸"],
  ["MI", "Michigan", "🇺🇸"],
  ["MN", "Minnesota", "🇺🇸"],
  ["MS", "Mississippi", "🇺🇸"],
  ["MO", "Missouri", "🇺🇸"],
  ["MT", "Montana", "🇺🇸"],
  ["NE", "Nebraska", "🇺🇸"],
  ["NV", "Nevada", "🇺🇸"],
  ["NH", "New Hampshire", "🇺🇸"],
  ["NJ", "New Jersey", "🇺🇸"],
  ["NM", "New Mexico", "🇺🇸"],
  ["NY", "New York", "🇺🇸"],
  ["NC", "North Carolina", "🇺🇸"],
  ["ND", "North Dakota", "🇺🇸"],
  ["OH", "Ohio", "🇺🇸"],
  ["OK", "Oklahoma", "🇺🇸"],
  ["OR", "Oregon", "🇺🇸"],
  ["PA", "Pennsylvania", "🇺🇸"],
  ["RI", "Rhode Island", "🇺🇸"],
  ["SC", "South Carolina", "🇺🇸"],
  ["SD", "South Dakota", "🇺🇸"],
  ["TN", "Tennessee", "🇺🇸"],
  ["TX", "Texas", "🇺🇸"],
  ["UT", "Utah", "🇺🇸"],
  ["VT", "Vermont", "🇺🇸"],
  ["VA", "Virginia", "🇺🇸"],
  ["WA", "Washington", "🇺🇸"],
  ["WV", "West Virginia", "🇺🇸"],
  ["WI", "Wisconsin", "🇺🇸"],
  ["WY", "Wyoming", "🇺🇸"],
  ["DC", "District of Columbia", "🇺🇸"],
];

export const CA_PROVINCES: [string, string, string][] = [
  ["AB", "Alberta", "🇨🇦"],
  ["BC", "British Columbia", "🇨🇦"],
  ["MB", "Manitoba", "🇨🇦"],
  ["NB", "New Brunswick", "🇨🇦"],
  ["NL", "Newfoundland and Labrador", "🇨🇦"],
  ["NS", "Nova Scotia", "🇨🇦"],
  ["ON", "Ontario", "🇨🇦"],
  ["PE", "Prince Edward Island", "🇨🇦"],
  ["QC", "Quebec", "🇨🇦"],
  ["SK", "Saskatchewan", "🇨🇦"],
  ["NT", "Northwest Territories", "🇨🇦"],
  ["NU", "Nunavut", "🇨🇦"],
  ["YT", "Yukon", "🇨🇦"],
];

export const ALL_REGIONS = [...US_STATES, ...CA_PROVINCES];

const STATE_MAP = new Map<string, { name: string; country: string }>();

US_STATES.forEach(([code, name]) => {
  STATE_MAP.set(code.toUpperCase(), { name, country: "United States" });
  STATE_MAP.set(name.toLowerCase(), { name, country: "United States" });
});

CA_PROVINCES.forEach(([code, name]) => {
  STATE_MAP.set(code.toUpperCase(), { name, country: "Canada" });
  STATE_MAP.set(name.toLowerCase(), { name, country: "Canada" });
});

export function resolveState(input: string) {
  if (!input) return undefined;
  return (
    STATE_MAP.get(input.toUpperCase()) ?? STATE_MAP.get(input.toLowerCase())
  );
}

export async function fetchCitiesForState(stateInput: string) {
  const code = stateInput.includes(" — ") ? stateInput.split(" — ")[0].trim() : stateInput;
  const info = resolveState(code);
  if (!info) return [];

  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: info.country, state: info.name }),
      },
    );
    const json = await res.json();
    return json?.data ?? [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}
