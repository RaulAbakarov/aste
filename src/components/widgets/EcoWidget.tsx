"use client";
import { useTripStore } from "@/lib/store";
import { Leaf, Bike, Bus, Utensils, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ICONS = { leaf: Leaf, bike: Bike, bus: Bus, utensils: Utensils };

export function EcoWidget() {
  const { trip } = useTripStore();
  if (!trip) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={18} className="text-brand-green-500" />
          <h3 className="font-semibold">Eco Impact</h3>
        </div>
        <p className="text-sm text-muted">Generate a trip to see your eco score.</p>
      </div>
    );
  }

  const r = 45;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (trip.ecoScore / 100) * circumference;
  const status = trip.ecoScore >= 75 ? "Good Choice!" : trip.ecoScore >= 50 ? "Decent" : "Could be Better";

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Leaf size={18} className="text-brand-green-500" />
        <h3 className="font-semibold">Eco Impact</h3>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={r} stroke="#E2E8F0" strokeWidth="10" fill="none" />
            <motion.circle
              cx="60"
              cy="60"
              r={r}
              stroke="#22C55E"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-brand-ink">{trip.ecoScore}</span>
            <span className="text-xs text-muted">/ 100</span>
          </div>
        </div>
        <p className="mt-2 pill bg-brand-green-soft text-brand-green-600">
          <Sparkles size={12} /> {status}
        </p>
      </div>

      <div className="mt-4 rounded-btn bg-bg p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Carbon Footprint</p>
          <p className="font-bold text-brand-ink">{trip.carbonKg} kg CO₂</p>
        </div>
        <span className="pill bg-brand-green-soft text-brand-green-600">Low Impact</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-btn border border-line px-3 py-2">
          <p className="text-muted">Green Transport</p>
          <p className="font-semibold text-brand-ink">{trip.eco.greenTransportScore}/100</p>
        </div>
        <div className="rounded-btn border border-line px-3 py-2">
          <p className="text-muted">Local Business</p>
          <p className="font-semibold text-brand-ink">{trip.eco.localBusinessScore}/100</p>
        </div>
        <div className="rounded-btn border border-line px-3 py-2">
          <p className="text-muted">Certified Stays</p>
          <p className="font-semibold text-brand-ink">{trip.eco.certifiedStays}</p>
        </div>
        <div className="rounded-btn border border-line px-3 py-2">
          <p className="text-muted">Offset Estimate</p>
          <p className="font-semibold text-brand-ink">${trip.eco.offsetUSD}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Eco Tips for You</p>
        <ul className="space-y-2">
          {trip.ecoTips.map((t, i) => {
            const Icon = ICONS[t.icon] ?? Leaf;
            return (
              <li key={i} className="flex gap-2 p-2 rounded-btn hover:bg-bg transition">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-brand-green-soft text-brand-green-600 flex items-center justify-center">
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-brand-ink">{t.tip}</p>
                  <p className="text-xs text-brand-green-600 font-semibold">Save {t.savingKg} kg CO₂</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <button className="btn-outline w-full mt-4">
        <Leaf size={14} /> Offset this trip
      </button>
    </div>
  );
}
