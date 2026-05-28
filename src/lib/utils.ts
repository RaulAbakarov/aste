import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function daysBetween(a: Date, b: Date) {
  const ms = 1000 * 60 * 60 * 24;
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / ms) + 1);
}
