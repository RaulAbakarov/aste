"use client";
import { useTripStore } from "@/lib/store";
import { CalendarDays, Map, PieChart } from "lucide-react";

const TABS = [
  { id: "itinerary" as const, label: "Itinerary", icon: CalendarDays },
  { id: "map" as const, label: "Map View", icon: Map },
  { id: "budget" as const, label: "Budget Breakdown", icon: PieChart }
];

export function TripTabs() {
  const { activeTab, setTab } = useTripStore();
  return (
    <div className="flex gap-1 border-b border-line overflow-x-auto no-scrollbar">
      {TABS.map((t) => {
        const active = activeTab === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition ${
              active
                ? "border-brand-green-500 text-brand-green-600"
                : "border-transparent text-muted hover:text-brand-ink"
            }`}
          >
            <Icon size={16} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
