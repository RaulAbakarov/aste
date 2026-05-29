"use client";
import { PageHeader } from "@/components/PageHeader";
import { Leaf, Bike, Bus, Train, Hotel, Utensils } from "lucide-react";
import { useTripStore } from "@/lib/store";

const tips = [
  { icon: Train, t: "Take the train", d: "Up to 90% less CO₂ than short flights." },
  { icon: Bike, t: "Rent a bike", d: "Zero emissions, twice the city views." },
  { icon: Bus, t: "Use public transit", d: "Average city bus = 0.1 kg CO₂/km/passenger." },
  { icon: Hotel, t: "Stay at certified hotels", d: "Look for Green Key & EarthCheck labels." },
  { icon: Utensils, t: "Eat local & plant-forward", d: "Cuts food carbon by ~40%." },
  { icon: Leaf, t: "Offset what's left", d: "Verified carbon credits via Cloverly/Patch." }
];

export default function EcoPage() {
  const { trip } = useTripStore();
  const score = trip?.ecoScore ?? 68;
  const tier = getEcoTier(score);
  const goal = getEcoGoal(score);
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Eco Travel Hub" subtitle="Tips, certified stays, and low-carbon routes for conscious travelers." />
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="card p-5">
          <p className="text-xs text-muted">Current Trip</p>
          <p className="font-semibold text-lg">{trip ? `${trip.destination}, ${trip.country}` : "No active trip"}</p>
          <p className="text-sm text-muted mt-1">
            {trip ? `${trip.ecoScore}/100 eco score · ${trip.carbonKg} kg CO2` : "Generate a trip to see eco stats."}
          </p>
          <div className="mt-3 rounded-btn border border-line p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">Community Ranking</p>
              <span className="pill bg-brand-green-soft text-brand-green-600">{tier.rankLabel}</span>
            </div>
            <p className="text-sm font-semibold text-brand-ink mt-1">{tier.title}</p>
            <p className="text-xs text-muted">{tier.description}</p>
          </div>
        </div>
        <div className="card p-5">
          <p className="text-xs text-muted">Eco Goals</p>
          <p className="font-semibold text-lg">Annual Carbon Goal</p>
          <div className="h-3 rounded-pill bg-bg overflow-hidden mt-2">
            <div className="h-full bg-brand-green-500 rounded-pill" style={{ width: `${goal.progress}%` }} />
          </div>
          <p className="text-xs text-muted mt-2">{goal.detail}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="pill bg-brand-green-soft text-brand-green-600">{goal.label}</span>
            <span className="text-xs text-muted">Ranking updates after each trip.</span>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {tips.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <div key={i} className="card p-5 flex gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-green-soft text-brand-green-600 flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <p className="font-semibold">{tip.t}</p>
                <p className="text-muted text-sm">{tip.d}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getEcoTier(score: number) {
  if (score >= 80) {
    return {
      title: "Top 8% Eco Travelers",
      rankLabel: "#1,284",
      description: "You are outperforming most travelers on carbon impact."
    };
  }
  if (score >= 60) {
    return {
      title: "Top 25% Eco Travelers",
      rankLabel: "#6,912",
      description: "Strong eco habits with room to climb higher."
    };
  }
  if (score >= 40) {
    return {
      title: "Top 48% Eco Travelers",
      rankLabel: "#14,402",
      description: "Mid-pack performance. Small swaps can boost your rank."
    };
  }
  return {
    title: "Top 72% Eco Travelers",
    rankLabel: "#22,894",
    description: "High impact trips, but easy wins will move you up fast."
  };
}

function getEcoGoal(score: number) {
  if (score >= 80) {
    return {
      label: "On track",
      progress: 38,
      detail: "280 / 740 kg CO2 used this year. Goal: stay under 740 kg."
    };
  }
  if (score >= 60) {
    return {
      label: "Slightly above",
      progress: 58,
      detail: "420 / 780 kg CO2 used. Goal: keep below 780 kg."
    };
  }
  if (score >= 40) {
    return {
      label: "Needs improvement",
      progress: 72,
      detail: "560 / 820 kg CO2 used. Goal: bring it under 820 kg."
    };
  }
  return {
    label: "High impact",
    progress: 86,
    detail: "720 / 900 kg CO2 used. Goal: lower to 900 kg or less."
  };
}
