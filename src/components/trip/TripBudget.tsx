"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import type { Trip } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"];

export function TripBudget({ trip }: { trip: Trip }) {
  const totals = {
    Transport: Math.round(trip.totalCostUSD * 0.28),
    Lodging: Math.round(trip.totalCostUSD * 0.34),
    Food: Math.round(trip.totalCostUSD * 0.18),
    Activities: Math.round(trip.totalCostUSD * 0.16),
    Misc: Math.round(trip.totalCostUSD * 0.04)
  };
  const pieData = Object.entries(totals).map(([name, value]) => ({ name, value }));
  const barData = trip.days.map((d) => ({ name: `Day ${d.day}`, Cost: d.estimatedCostUSD }));

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card p-5">
        <h3 className="font-semibold mb-3">Spend by Category</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v, trip.currency)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {pieData.map((d, i) => (
            <li key={d.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-muted">{d.name}</span>
              <span className="ml-auto font-semibold">{formatCurrency(d.value, trip.currency)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card p-5">
        <h3 className="font-semibold mb-3">Daily Costs</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip formatter={(v: number) => formatCurrency(v, trip.currency)} />
              <Bar dataKey="Cost" fill="#22C55E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <Stat label="Total" value={formatCurrency(trip.totalCostUSD, trip.currency)} />
          <Stat label="Budget" value={formatCurrency(trip.budgetUSD, trip.currency)} />
          <Stat
            label="You Save"
            value={formatCurrency(Math.max(0, trip.budgetUSD - trip.totalCostUSD), trip.currency)}
            highlight
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-btn border p-3 ${
        highlight ? "bg-brand-green-soft border-brand-green-500/30 text-brand-green-600" : "border-line"
      }`}
    >
      <p className="text-xs text-muted">{label}</p>
      <p className="font-bold mt-0.5">{value}</p>
    </div>
  );
}
