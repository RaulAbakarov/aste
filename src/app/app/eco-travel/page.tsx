import { PageHeader } from "@/components/PageHeader";
import { Leaf, Bike, Bus, Train, Hotel, Utensils } from "lucide-react";

const tips = [
  { icon: Train, t: "Take the train", d: "Up to 90% less CO₂ than short flights." },
  { icon: Bike, t: "Rent a bike", d: "Zero emissions, twice the city views." },
  { icon: Bus, t: "Use public transit", d: "Average city bus = 0.1 kg CO₂/km/passenger." },
  { icon: Hotel, t: "Stay at certified hotels", d: "Look for Green Key & EarthCheck labels." },
  { icon: Utensils, t: "Eat local & plant-forward", d: "Cuts food carbon by ~40%." },
  { icon: Leaf, t: "Offset what's left", d: "Verified carbon credits via Cloverly/Patch." }
];

export default function EcoPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Eco Travel Hub" subtitle="Tips, certified stays, and low-carbon routes for conscious travelers." />
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
