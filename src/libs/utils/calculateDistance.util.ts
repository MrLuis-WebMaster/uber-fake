export function calculateDistance(
  coord1: { latitude: string; longitude: string },
  coord2: { latitude: string; longitude: string },
): number {
  const R = 6371;
  const lat1 = parseFloat(coord1.latitude);
  const lon1 = parseFloat(coord1.longitude);
  const lat2 = parseFloat(coord2.latitude);
  const lon2 = parseFloat(coord2.longitude);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
