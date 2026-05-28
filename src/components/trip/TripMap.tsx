"use client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import type { Trip } from "@/lib/types";
import { useMemo } from "react";

const DAY_COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#EF4444"];

function makeIcon(color: string, label: string) {
  return L.divIcon({
    html: `<div style="background:${color};color:white;width:28px;height:28px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25)">${label}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

export default function TripMap({ trip }: { trip: Trip }) {
  const all = trip.days.flatMap((d, di) =>
    d.activities.map((a, ai) => ({ ...a, dayIndex: di, idx: ai + 1, day: d.day }))
  );

  const center = useMemo<[number, number]>(() => {
    if (all.length === 0) return [41.0082, 28.9784];
    const lat = all.reduce((s, a) => s + a.coords[0], 0) / all.length;
    const lng = all.reduce((s, a) => s + a.coords[1], 0) / all.length;
    return [lat, lng];
  }, [all]);

  return (
    <div className="rounded-card overflow-hidden border border-line h-[480px]">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trip.days.map((d, di) => {
          const color = DAY_COLORS[di % DAY_COLORS.length];
          const positions = d.activities.map((a) => a.coords as [number, number]);
          return (
            <Polyline
              key={`route-${d.day}`}
              positions={positions}
              pathOptions={{ color, weight: 4, opacity: 0.7, dashArray: "6,8" }}
            />
          );
        })}
        {all.map((a, i) => (
          <Marker
            key={`m-${i}`}
            position={a.coords as [number, number]}
            icon={makeIcon(DAY_COLORS[a.dayIndex % DAY_COLORS.length], String(a.day))}
          >
            <Popup>
              <div className="min-w-[180px]">
                <img src={a.photo} alt={a.name} className="w-full h-20 object-cover rounded mb-2" />
                <p className="font-semibold text-sm">{a.name}</p>
                <p className="text-xs text-gray-500">{a.type} · Day {a.day}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
