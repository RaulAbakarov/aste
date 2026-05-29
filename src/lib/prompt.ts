import type { TripStyle } from "./types";

export type PromptFlags = {
  eco?: boolean;
  luxury?: boolean;
  backpacker?: boolean;
  hidden?: boolean;
  family?: boolean;
  adventure?: boolean;
  nightlife?: boolean;
  relax?: boolean;
  culture?: boolean;
  food?: boolean;
};

export type PromptParseResult = {
  destination?: string;
  days?: number;
  budget?: number;
  currency?: string;
  styles: TripStyle[];
  flags: PromptFlags;
  notes: string[];
};

const DEST_ALIASES: Record<string, string[]> = {
  "Istanbul": ["istanbul", "ist", "turkey", "turkiye"],
  "Paris": ["paris", "france"],
  "Tokyo": ["tokyo", "japan"],
  "Barcelona": ["barcelona", "spain"],
  "Bali": ["bali", "indonesia"],
  "New York": ["new york", "nyc", "newyork", "usa", "united states"]
};

const STYLE_KEYWORDS: Array<{ style: TripStyle; keys: string[] }> = [
  { style: "Eco", keys: ["eco", "eco-friendly", "green", "sustainable"] },
  { style: "Luxury", keys: ["luxury", "premium", "vip", "five-star"] },
  { style: "Backpacker", keys: ["backpack", "backpacker", "budget travel"] },
  { style: "Family", keys: ["family", "kids", "children"] },
  { style: "Nightlife", keys: ["nightlife", "party", "club"] },
  { style: "Adventure", keys: ["adventure", "hike", "trek", "extreme"] },
  { style: "Relax & Wellness", keys: ["relax", "wellness", "spa", "slow"] },
  { style: "Culture & Food", keys: ["food", "cuisine", "culture", "museum"] }
];

function normalizePrompt(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function uniqueStyles(styles: TripStyle[]) {
  return Array.from(new Set(styles));
}

export function parsePrompt(prompt: string): PromptParseResult {
  const raw = (prompt || "").trim();
  if (!raw) {
    return { styles: [], flags: {}, notes: [] };
  }

  const q = normalizePrompt(raw);
  const notes: string[] = [];

  let destination: string | undefined;
  for (const [name, aliases] of Object.entries(DEST_ALIASES)) {
    if (aliases.some((a) => q.includes(a))) {
      destination = name;
      break;
    }
  }

  let days: number | undefined;
  const dayMatch = q.match(/(\d{1,2})\s*(day|days|gun|gunluk)/);
  if (dayMatch) {
    days = Number(dayMatch[1]);
  }

  let budget: number | undefined;
  let currency: string | undefined;

  const moneyAfterSymbol = q.match(/\$(\d{2,6})/);
  if (moneyAfterSymbol) {
    budget = Number(moneyAfterSymbol[1]);
    currency = "USD";
  }

  const money = q.match(/(\d{2,6})\s*(usd|eur|gbp|try|jpy|inr)/);
  if (money) {
    budget = Number(money[1]);
    currency = money[2].toUpperCase();
  }

  const styles: TripStyle[] = [];
  const flags: PromptFlags = {};

  for (const entry of STYLE_KEYWORDS) {
    if (entry.keys.some((k) => q.includes(k))) {
      styles.push(entry.style);
      if (entry.style === "Eco") flags.eco = true;
      if (entry.style === "Luxury") flags.luxury = true;
      if (entry.style === "Backpacker") flags.backpacker = true;
      if (entry.style === "Family") flags.family = true;
      if (entry.style === "Nightlife") flags.nightlife = true;
      if (entry.style === "Adventure") flags.adventure = true;
      if (entry.style === "Relax & Wellness") flags.relax = true;
      if (entry.style === "Culture & Food") {
        flags.culture = true;
        flags.food = true;
      }
    }
  }

  if (q.includes("hidden") || q.includes("secret") || q.includes("underrated") || q.includes("local-only")) {
    flags.hidden = true;
    notes.push("Hidden gems requested");
  }

  return {
    destination,
    days,
    budget,
    currency,
    styles: uniqueStyles(styles),
    flags,
    notes
  };
}
