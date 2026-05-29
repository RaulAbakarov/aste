"use client";
import { useTripStore } from "@/lib/store";
import { TripHero } from "./TripHero";
import { TripTabs } from "./TripTabs";
import { DayCard } from "./DayCard";
import { TripBudget } from "./TripBudget";
import { TripMapWrapper } from "./TripMapWrapper";
import { TripInsights } from "./TripInsights";
import { Sparkles, Plane } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Modal } from "../Modal";

export function TripDisplay() {
  const { trip, loading, activeTab } = useTripStore();
  const [bookingOpen, setBookingOpen] = useState(false);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-[240px]" />
        <div className="skeleton h-10 w-80" />
        <div className="grid gap-3">
          <div className="skeleton h-[180px]" />
          <div className="skeleton h-[180px]" />
          <div className="skeleton h-[180px]" />
        </div>
        <p className="text-center text-muted text-sm flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-brand-green-500 animate-pulse" />
          ASTE AI is crafting your itinerary…
        </p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="card p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-green-soft text-brand-green-600 flex items-center justify-center mb-4">
          <Plane size={28} />
        </div>
        <h3 className="text-lg font-bold">Your trip plan will appear here</h3>
        <p className="text-muted mt-1 max-w-md mx-auto">
          Fill out the planner on the left and click <strong>Generate My Trip Plan</strong>. ASTE will
          design a multi-day, eco-aware itinerary tailored to you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TripHero />
      <TripTabs />
      {activeTab === "itinerary" && (
        <div className="grid gap-3">
          <TripInsights trip={trip} />
          {trip.days.map((d, i) => (
            <DayCard key={d.day} day={d} index={i} currency={trip.currency} />
          ))}
        </div>
      )}
      {activeTab === "map" && <TripMapWrapper trip={trip} />}
      {activeTab === "budget" && <TripBudget trip={trip} />}

      {/* Bottom summary strip */}
      <div className="card p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
          <Stat label="Total" value={formatCurrency(trip.totalCostUSD, trip.currency)} />
          <Stat label="Budget" value={formatCurrency(trip.budgetUSD, trip.currency)} />
          <Stat
            label="You Save 😊"
            value={formatCurrency(Math.max(0, trip.budgetUSD - trip.totalCostUSD), trip.currency)}
            highlight
          />
        </div>
        <button onClick={() => setBookingOpen(true)} className="btn-outline">
          <Plane size={16} /> Book This Trip
        </button>
      </div>

      <Modal open={bookingOpen} title="Book This Trip" onClose={() => setBookingOpen(false)}>
        <div className="space-y-3 text-sm">
          <div className="rounded-btn border border-line p-3">
            <p className="font-semibold">Flights · Hotels · Experiences</p>
            <p className="text-muted">We will search Duffel + partner inventory for your dates.</p>
          </div>
          <div className="rounded-btn bg-bg p-3 flex items-center justify-between">
            <span className="text-muted">Estimated total</span>
            <span className="font-semibold">
              {trip ? formatCurrency(trip.totalCostUSD, trip.currency) : ""}
            </span>
          </div>
          <button className="btn-primary w-full">Start booking</button>
        </div>
      </Modal>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`font-bold text-lg ${highlight ? "text-brand-green-600" : "text-brand-ink"}`}>
        {value}
      </p>
    </div>
  );
}
