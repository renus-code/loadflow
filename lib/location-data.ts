/**
 * ======================================================================================
 * UTILITY: Geographic Intelligence (Location Data)
 * ======================================================================================
 * Provides standardized regional datasets for North American logistics.
 * 
 * Features:
 * 1. Multilingual Support: Map definitions for US States and Canadian Provinces.
 * 2. Normalization Engine: Robust 'resolveState' utility to handle case-insensitive lookups.
 * 3. Visual Identity: Injects regional flags (🇺🇸, 🇨🇦) for high-fidelity UI selectors.
 * 4. Performant Access: Utilizes pre-cached Maps for O(1) resolution speed.
 * ======================================================================================
 */
export const US_STATES: [string, string][] = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
  ["DC", "District of Columbia"],
];

export const CA_PROVINCES: [string, string][] = [
  ["AB", "Alberta"],
  ["BC", "British Columbia"],
  ["MB", "Manitoba"],
  ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"],
  ["NS", "Nova Scotia"],
  ["ON", "Ontario"],
  ["PE", "Prince Edward Island"],
  ["QC", "Quebec"],
  ["SK", "Saskatchewan"],
  ["NT", "Northwest Territories"],
  ["NU", "Nunavut"],
  ["YT", "Yukon"],
];

export const STATE_MAP = new Map<string, { name: string; country: string }>();
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

export const ALL_REGIONS: [string, string, string][] = [
  ...US_STATES.map(([c, n]): [string, string, string] => [c, n, "🇺🇸"]),
  ...CA_PROVINCES.map(([c, n]): [string, string, string] => [c, n, "🇨🇦"]),
];
