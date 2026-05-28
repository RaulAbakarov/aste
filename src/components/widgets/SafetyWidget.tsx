"use client";
import { ShieldCheck, Phone, Hospital, Siren, MapPin } from "lucide-react";
import { useTripStore } from "@/lib/store";
import { useState } from "react";
import { Modal } from "../Modal";

export function SafetyWidget() {
  const { trip } = useTripStore();
  const [open, setOpen] = useState(false);
  if (!trip) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={18} className="text-brand-blue-500" />
          <h3 className="font-semibold">Safety Center</h3>
        </div>
        <p className="text-sm text-muted">Safety insights appear once a trip is generated.</p>
      </div>
    );
  }
  const s = trip.safety;
  const statusTone =
    s.status === "safe" ? "bg-brand-green-soft/70 border-brand-green-500/20" :
    s.status === "caution" ? "bg-amber-50 border-amber-200" :
    "bg-red-50 border-red-200";
  const statusText = s.status === "safe" ? "You're in a Safe Zone" : s.status === "caution" ? "Exercise Caution" : "Alert";

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={18} className="text-brand-blue-500" />
        <h3 className="font-semibold">Safety Center</h3>
      </div>

      <div className={`rounded-btn border p-3 flex items-center gap-2 mb-3 ${statusTone}`}>
        <div className="w-9 h-9 rounded-full bg-brand-green-500 text-white flex items-center justify-center">
          <ShieldCheck size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-green-600">{statusText}</p>
          <p className="text-xs text-muted">Based on local advisories & crime data</p>
        </div>
      </div>

      <ul className="space-y-2">
        <SafetyRow icon={<Phone size={16} />} label="Emergency" value={s.emergencyNumber} accent="blue" />
        <SafetyRow
          icon={<Hospital size={16} />}
          label="Nearest Hospital"
          value={`${s.nearestHospital.name} · ${s.nearestHospital.distanceKm} km`}
        />
        <SafetyRow
          icon={<Siren size={16} />}
          label="Nearest Police"
          value={`${s.nearestPolice.name} · ${s.nearestPolice.distanceKm} km`}
        />
      </ul>

      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-btn bg-brand-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2.5 transition"
      >
        <MapPin size={16} /> View Safety Map
      </button>

      <Modal open={open} title="Safety Map" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <div className="rounded-card border border-line bg-bg h-40 flex items-center justify-center text-sm text-muted">
            Map overlay with hospitals, police, embassies, and safe zones
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between rounded-btn border border-line px-3 py-2">
              <span>Nearest Hospital</span>
              <span className="font-semibold">{s.nearestHospital.distanceKm} km</span>
            </div>
            <div className="flex items-center justify-between rounded-btn border border-line px-3 py-2">
              <span>Nearest Police</span>
              <span className="font-semibold">{s.nearestPolice.distanceKm} km</span>
            </div>
            <div className="flex items-center justify-between rounded-btn border border-line px-3 py-2">
              <span>Embassy Hotline</span>
              <span className="font-semibold">+1 202 501 4444</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SafetyRow({
  icon,
  label,
  value,
  accent
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "blue";
}) {
  return (
    <li className="flex items-center gap-3 p-2 rounded-btn hover:bg-bg">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          accent === "blue" ? "bg-brand-blue-soft text-brand-blue-500" : "bg-bg text-muted"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-semibold text-brand-ink truncate">{value}</p>
      </div>
    </li>
  );
}
