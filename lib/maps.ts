/**
 * ======================================================================================
 * UTILITY: Map & Geolocation Intelligence (Mock Services)
 * ======================================================================================
 * Handles geographic calculations and address geocoding for logistics missions.
 * 
 * Features:
 * 1. Geocoding: Converts physical addresses into Lat/Lng coordinates.
 * 2. Route Statistics: Calculates mileage and estimated travel duration between stops.
 * 3. Mock Fallbacks: Provides realistic mock data without requiring external API keys.
 * ======================================================================================
 */

// Simulates Geocoding: Generates consistent "fake" coordinates based on an address string hash
export async function getMockCoordinates(address: string, city: string, state: string) {
  const fullAddress = `${address}, ${city}, ${state}`.trim();
  
  let hash = 0;
  for (let i = 0; i < fullAddress.length; i++) {
    hash = fullAddress.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Constrain coordinates to a much smaller range to avoid 1600 mile distances
  // Base around a fixed point (e.g., near Toronto/mid-US) and vary by only ~0.5 degrees
  const lat = 43.65 + (Math.abs(hash % 100) / 200); 
  const lng = -79.38 - (Math.abs(hash % 100) / 200);
  
  // Simulate network latency (200ms)
  await new Promise(resolve => setTimeout(resolve, 200));

  return { lat, lng };
}


// Standard Haversine formula to get crow-flies distance between coordinates
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
}

// Simulates Routing: Calculates total distance (miles) and duration (hours) across a sequence of stops
export async function calculateMockRouteStats(pickups: any[], deliveries: any[]) {
  const result = calculateMockRouteStatsSync(pickups, deliveries);
  
  // Simulate network latency (300ms)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return result;
}

// Synchronous version for UI components
export function calculateMockRouteStatsSync(pickups: any[], deliveries: any[]) {
  let totalKm = 0;
  const allStops = [...pickups, ...deliveries];
  
  const getHashCoordsLocal = (address: string, city: string, state: string) => {
    const fullAddress = `${address}, ${city}, ${state}`.trim();
    let hash = 0;
    for (let i = 0; i < fullAddress.length; i++) {
      hash = fullAddress.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Matching the constrained logic in getMockCoordinates
    return {
      lat: 43.65 + (Math.abs(hash % 100) / 200),
      lng: -79.38 - (Math.abs(hash % 100) / 200)
    };
  };

  for (let i = 0; i < allStops.length - 1; i++) {
    const c = allStops[i];
    const n = allStops[i+1];
    
    const lat1 = c.lat ?? getHashCoordsLocal(c.address, c.city, c.state).lat;
    const lon1 = c.lng ?? getHashCoordsLocal(c.address, c.city, c.state).lng;
    const lat2 = n.lat ?? getHashCoordsLocal(n.address, n.city, n.state).lat;
    const lon2 = n.lng ?? getHashCoordsLocal(n.address, n.city, n.state).lng;
    
    const dist = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    // If distance is effectively 0 (same city/address), add a small base for local logistics
    totalKm += (dist < 5 ? 40 : dist * 1.2);
  }

  const totalDistanceMiles = Math.round(totalKm * 0.621371);
  const estimatedDurationHours = Math.round((totalDistanceMiles / 55) * 10) / 10;
  
  return {
    distance: totalDistanceMiles || 25, // Minimum 25 miles
    duration: estimatedDurationHours || 0.5
  };
}


