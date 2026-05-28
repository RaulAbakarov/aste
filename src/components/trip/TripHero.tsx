"use client";
import { Share2, Heart } from "lucide-react";
import { useTripStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function TripHero() {
  const { trip, favorited, toggleFavorite } = useTripStore();
  if (!trip) return null;

  return (
    <div className="relative rounded-card overflow-hidden shadow-card border border-line">
      <img src={trip.coverImage} alt={trip.destination} className="w-full h-[220px] md:h-[260px] object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/40 to-transparent" />
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => navigator.share?.({ title: `${trip.destination} trip`, url: location.href }).catch(() => {})}
          className="w-9 h-9 rounded-full bg-white/95 backdrop-blur hover:bg-white text-brand-ink flex items-center justify-center shadow-card"
          aria-label="Share"
        >
          <Share2 size={16} />
        </button>
        <button
          onClick={toggleFavorite}
          className="w-9 h-9 rounded-full bg-white/95 backdrop-blur hover:bg-white flex items-center justify-center shadow-card"
          aria-label="Favorite"
        >
          <Heart
            size={16}
            className={cn(favorited ? "fill-red-500 text-red-500" : "text-brand-ink")}
          />
        </button>
      </div>
      <div className="absolute bottom-4 left-5 right-5 text-white">
        <p className="text-xs uppercase tracking-widest opacity-80">Your AI-Generated Trip Plan</p>
        <h1 className="text-2xl md:text-3xl font-bold mt-1">
          {trip.days.length} Days in {trip.destination}, {trip.country}
        </h1>
        <p className="text-white/85 text-sm mt-1 max-w-2xl">{trip.summary}</p>
      </div>
    </div>
  );
}
