/**
 * Mock Maps Service
 * Simulates Geocoding and Routing API calls for local development without exposing actual API keys.
 */

// Simulates Geocoding: Generates consistent "fake" coordinates based on an address string hash
export async function getMockCoordinates(address: string, city: string, state: string) {
  const fullAddress = `${address}, ${city}, ${state}`.trim();
  
  let hash = 0;
  for (let i = 0; i < fullAddress.length; i++) {
    hash = fullAddress.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Base coordinates roughly within North America bounds
  // Lat: ~25 to ~50
  // Lng: ~-125 to ~-70
  const lat = 25 + Math.abs((hash % 25000) / 1000);
  const lng = -125 + Math.abs((hash % 55000) / 1000);
  
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
  let totalKm = 0;
  
  const allStops = [...pickups, ...deliveries];
  
  for (let i = 0; i < allStops.length - 1; i++) {
    const current = allStops[i];
    const next = allStops[i+1];
    
    if (current.lat != null && current.lng != null && next.lat != null && next.lng != null) {
      // Multiply by 1.2 to simulate actual road driving distance vs crow-flies
      totalKm += (getDistanceFromLatLonInKm(current.lat, current.lng, next.lat, next.lng) * 1.2);
    } else {
      // Fallback minimum distance
      totalKm += 150;
    }
  }

  // Convert to Miles
  const totalDistanceMiles = Math.round(totalKm * 0.621371);
  
  // Assume commercial trucking average speed of 55 mph
  const estimatedDurationHours = Math.round((totalDistanceMiles / 55) * 10) / 10;
  
  // Simulate network latency (300ms)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    distance: totalDistanceMiles,
    duration: estimatedDurationHours
  };
}
