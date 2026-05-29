"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Trip } from "@/lib/types";
import { getSafetyPoints } from "@/lib/safetyMap";

const COLORS: Record<string, string> = {
  hospital: "#EF4444",
  police: "#3B82F6",
  park: "#22C55E"
};

function makeIcon(color: string, label: string) {
  return L.divIcon({
    html: `<div style="background:${color};color:white;width:30px;height:30px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25)">${label}</div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

export default function SafetyMap({ trip }: { trip: Trip }) {
  const points = getSafetyPoints(trip);
  const center = points[0]?.coords ?? [41.0082, 28.9784];

  return (
    <div className="rounded-card overflow-hidden border border-line h-[260px]">
      <MapContainer center={center} zoom={13} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {points.map((p) => (
          <Marker
            key={p.id}
            position={p.coords as [number, number]}
            icon={makeIcon(COLORS[p.type], p.type === "park" ? "PK" : p.type === "police" ? "PD" : "H")}
          >
            <Popup>
              <div className="min-w-[160px]">
                <p className="font-semibold text-sm">{p.label}</p>
                <p className="text-xs text-gray-500">{p.type} · {p.distanceKm} km</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
