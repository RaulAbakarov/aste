"use client";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Image as ImageIcon } from "lucide-react";
import type { Day } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Modal } from "../Modal";

export function DayCard({ day, index, currency }: { day: Day; index: number; currency: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(day.activities[0]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="card p-5"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="pill bg-brand-green-500 text-white shadow-cta/30">
            Day {day.day}
          </span>
          <h3 className="font-semibold text-lg text-brand-ink">{day.title}</h3>
        </div>
        <span className="text-sm text-muted hidden sm:inline-flex items-center gap-1">
          <Clock size={14} />
          {day.activities.reduce((s, a) => s + a.durationMin, 0)} min
        </span>
      </div>

      <ul className="space-y-2 mb-4">
        {day.activities.map((a) => (
          <li key={a.id} className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green-500 shrink-0" />
            <div>
              <button
                className="text-brand-ink font-medium hover:text-brand-green-600 text-left"
                onClick={() => {
                  setSelected(a);
                  setOpen(true);
                }}
              >
                {a.name}
              </button>
              <p className="text-xs text-muted">
                {a.type} · {a.durationMin} min · {formatCurrency(a.estimatedCostUSD, currency)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {day.photos.slice(0, 3).map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setSelected(day.activities[i] ?? day.activities[0]);
              setOpen(true);
            }}
            className="w-full"
            aria-label={`Open photo ${i + 1}`}
          >
            <img
              src={p}
              loading="lazy"
              alt={`Day ${day.day} photo ${i + 1}`}
              className="w-full h-20 object-cover rounded-lg"
            />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-line">
        <p className="text-sm">
          <span className="text-muted">Estimated Cost:</span>{" "}
          <span className="font-semibold text-brand-ink">
            {formatCurrency(day.estimatedCostUSD, currency)}
          </span>
        </p>
        <button
          onClick={() => setOpen(true)}
          className="text-sm font-semibold text-brand-green-600 hover:text-brand-green-500 inline-flex items-center gap-0.5"
        >
          Details <ChevronRight size={14} />
        </button>
      </div>

      <Modal
        open={open}
        title={selected?.name ?? "Activity"}
        onClose={() => setOpen(false)}
      >
        {selected && (
          <div className="space-y-3">
            <img src={selected.photo} alt={selected.name} className="w-full h-44 object-cover rounded-xl" />
            <div className="flex items-center gap-2 text-xs text-muted">
              <ImageIcon size={14} /> {selected.type} · {selected.durationMin} min
            </div>
            <p className="text-sm text-brand-ink">{selected.description}</p>
            <div className="rounded-btn bg-bg p-3 flex items-center justify-between">
              <span className="text-xs text-muted">Estimated cost</span>
              <span className="font-semibold">{formatCurrency(selected.estimatedCostUSD, currency)}</span>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
