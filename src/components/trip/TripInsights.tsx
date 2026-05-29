"use client";
import type { Trip } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
  Compass,
  Clock,
  ShieldCheck,
  Zap,
  MapPin,
  Bell
} from "lucide-react";

export function TripInsights({ trip }: { trip: Trip }) {
  const trendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp size={14} className="text-rose-500" />;
    if (trend === "down") return <TrendingDown size={14} className="text-brand-green-600" />;
    return <Minus size={14} className="text-muted" />;
  };

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-green-500" />
              <h3 className="font-semibold">AI Profile</h3>
            </div>
            <span className="pill bg-brand-green-soft text-brand-green-600">{trip.profile.persona}</span>
          </div>
          <p className="text-sm text-muted">{trip.profile.summary}</p>
          {trip.profile.memoryNote && (
            <p className="text-xs text-brand-ink mt-2">{trip.profile.memoryNote}</p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {trip.profile.signals.map((s) => (
              <div key={s.label} className="rounded-btn border border-line px-2.5 py-2">
                <p className="text-muted">{s.label}</p>
                <p className="font-semibold text-brand-ink">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted">
            Offline pack: {trip.offline.status} · {trip.offline.sizeMB} MB
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Compass size={16} className="text-brand-blue-500" />
            <h3 className="font-semibold">Dynamic Pricing</h3>
          </div>
          <div className="space-y-2">
            {trip.pricing.map((p, i) => (
              <div key={i} className="rounded-btn border border-line px-3 py-2 flex items-start gap-2">
                <div className="mt-0.5">{trendIcon(p.trend)}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-brand-ink">{p.message}</p>
                  <p className="text-xs text-muted">
                    Impact: {formatCurrency(p.impactUSD, trip.currency)} · Confidence {p.confidence}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-amber-500" />
            <h3 className="font-semibold">Smart Optimizations</h3>
          </div>
          <div className="space-y-2">
            {trip.optimizations.map((o, i) => (
              <div key={i} className="rounded-btn border border-line px-3 py-2">
                <p className="text-sm font-semibold text-brand-ink">{o.message}</p>
                <p className="text-xs text-muted">
                  {o.savingsUSD ? `Save ${formatCurrency(o.savingsUSD, trip.currency)} · ` : ""}
                  {o.timeSavedMin ? `Save ${o.timeSavedMin} min · ` : ""}
                  {o.riskLevel ? `Risk: ${o.riskLevel}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-brand-green-600" />
            <h3 className="font-semibold">Predictive Alerts</h3>
          </div>
          <div className="space-y-2">
            {trip.predictions.map((p, i) => (
              <div key={i} className="rounded-btn border border-line px-3 py-2">
                <p className="text-sm font-semibold text-brand-ink">{p.message}</p>
                <p className="text-xs text-muted">Confidence {p.confidence}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-brand-green-600" />
          <h3 className="font-semibold">Hidden Gems</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {trip.hiddenGems.map((g, i) => (
            <div key={i} className="rounded-card border border-line overflow-hidden bg-white">
              <img src={g.photo} alt={g.name} className="w-full h-28 object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold text-brand-ink">{g.name}</p>
                <p className="text-xs text-muted">{g.type} · Score {g.popularityScore}</p>
                <p className="text-xs text-muted mt-1">{g.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={16} className="text-brand-blue-500" />
          <h3 className="font-semibold">Live AI Copilot</h3>
        </div>
        <div className="space-y-2">
          {trip.copilot.map((c) => (
            <div key={c.id} className="rounded-btn border border-line px-3 py-2 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-blue-soft text-brand-blue-500 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted">{c.time} · {c.type}</p>
                <p className="text-sm font-semibold text-brand-ink">{c.message}</p>
                {c.action && <p className="text-xs text-brand-blue-500 font-semibold">{c.action}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
