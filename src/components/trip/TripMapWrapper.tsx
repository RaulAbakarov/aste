"use client";
import dynamic from "next/dynamic";
import type { Trip } from "@/lib/types";

const TripMap = dynamic(() => import("./TripMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-card border border-line h-[480px] flex items-center justify-center text-muted">
      Loading map…
    </div>
  )
});

export function TripMapWrapper({ trip }: { trip: Trip }) {
  return <TripMap trip={trip} />;
}
