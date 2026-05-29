import type { Trip } from "./types";

export type SafetyPoint = {
  id: string;
  label: string;
  type: "hospital" | "police" | "park";
  coords: [number, number];
  distanceKm: number;
};

function getCenter(trip: Trip): [number, number] {
  const all = trip.days.flatMap((d) => d.activities.map((a) => a.coords));
  if (!all.length) return [41.0082, 28.9784];
  const lat = all.reduce((s, c) => s + c[0], 0) / all.length;
  const lng = all.reduce((s, c) => s + c[1], 0) / all.length;
  return [lat, lng];
}

function approxKm(latOffset: number, lngOffset: number) {
  const km = Math.sqrt(latOffset * latOffset + lngOffset * lngOffset) * 111;
  return Math.max(0.3, Math.round(km * 10) / 10);
}

export function getSafetyPoints(trip: Trip): SafetyPoint[] {
  const [lat, lng] = getCenter(trip);
  const offsets = {
    hospital: [
      { lat: 0.012, lng: -0.006, name: "City Central Hospital" },
      { lat: -0.009, lng: 0.011, name: "Riverside Medical" }
    ],
    police: [
      { lat: 0.006, lng: 0.014, name: "Downtown Police HQ" },
      { lat: -0.013, lng: -0.004, name: "Old Town Precinct" }
    ],
    park: [
      { lat: 0.015, lng: 0.002, name: "Liberty Park" },
      { lat: -0.004, lng: 0.016, name: "Harbor Green" }
    ]
  };

  const points: SafetyPoint[] = [];
  for (const item of offsets.hospital) {
    points.push({
      id: `hospital-${item.name}`,
      label: item.name,
      type: "hospital",
      coords: [lat + item.lat, lng + item.lng],
      distanceKm: approxKm(item.lat, item.lng)
    });
  }
  for (const item of offsets.police) {
    points.push({
      id: `police-${item.name}`,
      label: item.name,
      type: "police",
      coords: [lat + item.lat, lng + item.lng],
      distanceKm: approxKm(item.lat, item.lng)
    });
  }
  for (const item of offsets.park) {
    points.push({
      id: `park-${item.name}`,
      label: item.name,
      type: "park",
      coords: [lat + item.lat, lng + item.lng],
      distanceKm: approxKm(item.lat, item.lng)
    });
  }
  return points;
}
