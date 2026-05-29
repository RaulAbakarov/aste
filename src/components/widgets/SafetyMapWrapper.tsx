"use client";
import dynamic from "next/dynamic";
import type { Trip } from "@/lib/types";

const SafetyMap = dynamic(() => import("./SafetyMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-card border border-line h-[260px] flex items-center justify-center text-muted">
      Loading map…
    </div>
  )
});

export function SafetyMapWrapper({ trip }: { trip: Trip }) {
  return <SafetyMap trip={trip} />;
}
