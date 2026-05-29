"use client";
import { useState } from "react";
import { z } from "zod";
import {
  ArrowLeftRight,
  Calendar,
  Users,
  Wallet,
  MapPin,
  Sparkles,
  Minus,
  Plus,
  CheckCircle2
} from "lucide-react";
import { useTripStore } from "@/lib/store";
import type { TripStyle, TripFormInput, TripMemory } from "@/lib/types";
import { parsePrompt } from "@/lib/prompt";

const STYLES: TripStyle[] = [
  "Culture & Food",
  "Adventure",
  "Relax & Wellness",
  "Nightlife",
  "Family",
  "Luxury",
  "Backpacker",
  "Eco"
];

const CURRENCIES = ["USD", "EUR", "GBP", "TRY", "JPY", "INR"];

const Schema = z.object({
  from: z.string().min(2, "Enter departure city"),
  to: z.string().min(2, "Enter destination"),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  budget: z.number().min(50)
});

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function maxDateISO(months = 24) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function readMemory(): TripMemory | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem("aste.memory");
    return raw ? (JSON.parse(raw) as TripMemory) : undefined;
  } catch {
    return undefined;
  }
}

export function PlannerForm() {
  const { setTrip, setLoading, loading } = useTripStore();
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [from, setFrom] = useState("Baku, Azerbaijan");
  const [to, setTo] = useState("Istanbul, Turkey");
  const [startDate, setStart] = useState(todayISO(14));
  const [endDate, setEnd] = useState(todayISO(19));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [budget, setBudget] = useState(1200);
  const [currency, setCurrency] = useState("USD");
  const [styles, setStyles] = useState<TripStyle[]>(["Culture & Food", "Eco"]);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const parsedPrompt = prompt ? parsePrompt(prompt) : null;

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function toggleStyle(s: TripStyle) {
    setStyles((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  function applyPrompt() {
    if (!parsedPrompt) return;
    if (parsedPrompt.destination) setTo(parsedPrompt.destination);
    if (parsedPrompt.budget) setBudget(parsedPrompt.budget);
    if (parsedPrompt.currency) setCurrency(parsedPrompt.currency);
    if (parsedPrompt.days) {
      setEnd(addDays(startDate, Math.max(1, parsedPrompt.days) - 1));
    }
    if (parsedPrompt.styles.length > 0) {
      setStyles(parsedPrompt.styles);
    }
  }

  async function submit() {
    setError(null);
    const parsed = Schema.safeParse({ from, to, startDate, endDate, budget });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    const payload: TripFormInput = {
      tripType,
      from,
      to,
      startDate,
      endDate,
      travelers: { adults, children, infants },
      budget,
      currency,
      styles,
      prompt: prompt || undefined,
      memory: readMemory()
    };
    setLoading(true);
    setTrip(null);
    try {
      const res = await fetch("/api/trips/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Generation failed");
      setTrip(data.trip);
      if (typeof window !== "undefined") {
        const memory: TripMemory = {
          lastDestination: data.trip?.destination,
          lastBudget: data.trip?.budgetUSD,
          lastStyles: styles,
          lastPrompt: prompt || undefined
        };
        try {
          localStorage.setItem("aste.memory", JSON.stringify(memory));
        } catch {
          // ignore storage errors
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5 lg:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-brand-green-soft text-brand-green-600 flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold leading-tight">AI Travel Planner</h2>
          <p className="text-muted text-sm">Plan your perfect trip with AI</p>
        </div>
      </div>

      {/* Trip type toggle */}
      <div className="inline-flex p-1 rounded-pill bg-bg border border-line mb-5">
        {(["round", "oneway"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTripType(t)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-pill transition ${
              tripType === t ? "bg-brand-green-soft text-brand-green-600" : "text-muted"
            }`}
          >
            {t === "round" ? "Round Trip" : "One Way"}
          </button>
        ))}
      </div>

      {/* Prompt */}
      <div className="mb-5">
        <label className="label">Describe your trip</label>
        <textarea
          className="input min-h-[92px] py-2.5"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Plan a 4 day trip to Paris, eco-friendly, $300 budget, hidden places"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-muted">
            The prompt can override destination, budget, and styles.
          </p>
          <button type="button" onClick={applyPrompt} className="btn-outline text-xs px-3 py-1.5">
            Apply prompt
          </button>
        </div>
        {parsedPrompt && (parsedPrompt.destination || parsedPrompt.days || parsedPrompt.budget) && (
          <div className="mt-2 text-xs text-brand-ink">
            Detected: {parsedPrompt.destination ?? ""}
            {parsedPrompt.days ? ` · ${parsedPrompt.days} days` : ""}
            {parsedPrompt.budget ? ` · ${parsedPrompt.budget} ${parsedPrompt.currency ?? currency}` : ""}
          </div>
        )}
      </div>

      {/* From / To with swap */}
      <div className="grid grid-cols-1 gap-3 relative">
        <div>
          <label className="label">From</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input className="input pl-9" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="City or airport" />
          </div>
        </div>
        <button
          onClick={swap}
          aria-label="Swap"
          className="absolute right-3 top-[42px] w-9 h-9 rounded-full bg-white border border-line text-muted hover:text-brand-green-600 hover:border-brand-green-500 flex items-center justify-center z-10"
        >
          <ArrowLeftRight size={16} />
        </button>
        <div>
          <label className="label">To</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-green-500" />
            <input className="input pl-9" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination" />
          </div>
          <p className="text-xs text-faint mt-1">Try: Istanbul, Paris, Tokyo, Barcelona, Bali, New York</p>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <label className="label">Start date</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              type="date"
              className="input pl-9"
              value={startDate}
              min={todayISO()}
              max={maxDateISO()}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label">End date</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              type="date"
              className="input pl-9"
              value={endDate}
              min={startDate}
              max={maxDateISO()}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Travelers */}
      <div className="mt-4">
        <label className="label flex items-center gap-1"><Users size={12} /> Travelers</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            ["Adults", adults, setAdults, 1, 9],
            ["Children", children, setChildren, 0, 6],
            ["Infants", infants, setInfants, 0, 4]
          ] as const).map(([lbl, val, setter, min, max]) => (
            <div key={lbl} className="flex items-center justify-between border border-line rounded-btn px-3 py-2">
              <div>
                <p className="text-xs text-muted">{lbl}</p>
                <p className="font-semibold">{val}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setter(Math.max(min, val - 1))}
                  className="w-7 h-7 rounded-full border border-line hover:border-brand-green-500 hover:text-brand-green-600 flex items-center justify-center"
                  aria-label={`Decrease ${lbl}`}
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => setter(Math.min(max, val + 1))}
                  className="w-7 h-7 rounded-full border border-line hover:border-brand-green-500 hover:text-brand-green-600 flex items-center justify-center"
                  aria-label={`Increase ${lbl}`}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="mt-4">
        <label className="label flex items-center gap-1"><Wallet size={12} /> Budget</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={50}
            className="input flex-1"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input w-24"
          >
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Styles */}
      <div className="mt-4">
        <label className="label">Travel style</label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => {
            const active = styles.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleStyle(s)}
                className={`chip text-sm ${active ? "chip-active" : ""}`}
              >
                {active && <CheckCircle2 size={14} />} {s}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-btn px-3 py-2">
          {error}
        </div>
      )}

      <button
        onClick={submit}
        disabled={loading}
        className="btn-primary w-full mt-5 text-md py-3"
      >
        <Sparkles size={18} />
        {loading ? "Crafting your trip…" : "Generate My Trip Plan"}
      </button>

      {/* Why ASTE */}
      <div className="mt-6 rounded-card bg-brand-green-soft/60 border border-brand-green-500/20 p-4">
        <p className="font-semibold text-brand-ink mb-2 flex items-center gap-2">
          <Sparkles size={14} className="text-brand-green-600" /> Why ASTE?
        </p>
        <ul className="grid grid-cols-1 gap-1.5 text-sm">
          {[
            "Personalized day-by-day plans",
            "Live eco impact & carbon score",
            "Real-time safety insights",
            "Budget-aware recommendations"
          ].map((t) => (
            <li key={t} className="flex items-center gap-2 text-brand-ink/85">
              <CheckCircle2 size={14} className="text-brand-green-600 shrink-0" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
