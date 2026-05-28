"use client";
import { useTripStore } from "@/lib/store";
import { Star, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "../Modal";

const DEFAULT_EXP = [
  {
    id: "e-fallback-1",
    title: "Old Town Walking Tour",
    priceUSD: 35,
    photo:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    durationMin: 120
  },
  {
    id: "e-fallback-2",
    title: "Local Food Crawl",
    priceUSD: 49,
    photo:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    durationMin: 180
  },
  {
    id: "e-fallback-3",
    title: "Sunset Boat Cruise",
    priceUSD: 65,
    photo:
      "https://images.unsplash.com/photo-1605116959581-aabd7da4377a?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    durationMin: 150
  }
];

export function ExperiencesWidget() {
  const { trip } = useTripStore();
  const list = trip?.experiences && trip.experiences.length > 0 ? trip.experiences : DEFAULT_EXP;
  const [selected, setSelected] = useState<typeof list[0] | null>(null);
  const currency = trip?.currency ?? "USD";

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Experiences for You</h3>
        <Link
          href={`/app/experiences${trip ? `?destination=${encodeURIComponent(trip.destination)}` : ""}`}
          className="text-sm font-semibold text-brand-green-600 hover:text-brand-green-500 inline-flex items-center gap-0.5"
        >
          See all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {list.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelected(e)}
            className="shrink-0 w-44 rounded-card border border-line bg-white overflow-hidden hover:shadow-card transition text-left"
          >
            <img src={e.photo} alt={e.title} className="w-full h-24 object-cover" />
            <div className="p-3">
              <p className="text-sm font-semibold line-clamp-2 leading-snug">{e.title}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                {e.rating.toFixed(1)} · {Math.round(e.durationMin / 60)}h
              </div>
              <p className="mt-1 font-bold text-brand-ink">{formatCurrency(e.priceUSD, currency)}</p>
            </div>
          </button>
        ))}
      </div>

      <Modal
        open={!!selected}
        title={selected?.title ?? "Experience"}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="space-y-3">
            <img src={selected.photo} alt={selected.title} className="w-full h-40 object-cover rounded-xl" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">{Math.round(selected.durationMin / 60)}h · {selected.rating.toFixed(1)}★</span>
              <span className="font-semibold">{formatCurrency(selected.priceUSD, currency)}</span>
            </div>
            <button className="btn-primary w-full">Book experience</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
