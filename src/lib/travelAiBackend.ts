import type {
  Activity,
  Day,
  EcoTip,
  Experience,
  HiddenGem,
  MarketplaceOffer,
  OptimizationTip,
  Prediction,
  ProfileSignal,
  SafetyAlert,
  SafetyInfo,
  Trip,
  TripFormInput,
  TripStyle,
  UserProfile
} from "./types";

const DEFAULT_BACKEND_BASE_URL = "http://localhost:8000";

export const BACKEND_USER_ID_COOKIE = "aste_user_id";
export const BACKEND_TRIP_PLAN_PATH = "/api/v1/api/trip/plan";

type BackendPlanData = {
  target_destination?: string;
  total_estimated_cost?: number;
  safety_summary?: unknown;
  eco_score?: number;
  chosen_accommodation?: unknown;
  daily_itinerary?: unknown;
  currency?: string;
  total_days?: number;
  user_preferences?: unknown;
  created_date?: string;
  version?: string;
  [key: string]: unknown;
};

export type BackendTripPlanResponse = {
  status?: string;
  trip_id?: string;
  destination?: string;
  budget?: number;
  data?: BackendPlanData;
  message?: string;
  [key: string]: unknown;
};

type DestinationMeta = {
  country: string;
  coverImage: string;
  center: [number, number];
  emergencyNumber: string;
};

const DEFAULT_META: DestinationMeta = {
  country: "Unknown",
  coverImage:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
  center: [20, 0],
  emergencyNumber: "112"
};

const DESTINATIONS: Record<string, DestinationMeta> = {
  istanbul: {
    country: "Turkey",
    coverImage:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80",
    center: [41.0082, 28.9784],
    emergencyNumber: "112"
  },
  paris: {
    country: "France",
    coverImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    center: [48.8566, 2.3522],
    emergencyNumber: "112"
  },
  tokyo: {
    country: "Japan",
    coverImage:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=80",
    center: [35.6762, 139.6503],
    emergencyNumber: "110"
  },
  barcelona: {
    country: "Spain",
    coverImage:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1600&q=80",
    center: [41.3851, 2.1734],
    emergencyNumber: "112"
  },
  bali: {
    country: "Indonesia",
    coverImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
    center: [-8.3405, 115.092],
    emergencyNumber: "112"
  },
  newyork: {
    country: "USA",
    coverImage:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80",
    center: [40.7128, -74.006],
    emergencyNumber: "911"
  }
};

const DEFAULT_ECO_TIPS: EcoTip[] = [
  { tip: "Take the metro instead of taxis for short city hops.", savingKg: 14, icon: "bus" },
  { tip: "Choose plant-forward meals at least once a day.", savingKg: 9, icon: "utensils" },
  { tip: "Rent a bike for inner-city exploration.", savingKg: 6, icon: "bike" }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function stringify(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (!value || typeof value !== "object") return "";
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function normalizeDestinationKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function splitDestination(value: string) {
  const [destinationPart, ...rest] = value.split(",");
  const destination = destinationPart?.trim() || value.trim() || "Your destination";
  const country = rest.join(",").trim();
  return { destination, country };
}

function resolveDestinationMeta(destination: string, fallbackCountry?: string) {
  const normalized = normalizeDestinationKey(destination);
  const known = DESTINATIONS[normalized];
  if (known) {
    return { ...known, country: fallbackCountry || known.country };
  }
  return { ...DEFAULT_META, country: fallbackCountry || DEFAULT_META.country };
}

function distanceLabel(center: [number, number], index: number) {
  const offset = 0.008 + (index % 3) * 0.003;
  return [center[0] + offset, center[1] + offset * (index % 2 === 0 ? 1 : -1)] as [number, number];
}

function numberFrom(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function textFrom(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function arrayFrom(value: unknown) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  if ("days" in value && Array.isArray((value as { days?: unknown }).days)) {
    return (value as { days: unknown[] }).days;
  }
  if ("daily_itinerary" in value && Array.isArray((value as { daily_itinerary?: unknown }).daily_itinerary)) {
    return (value as { daily_itinerary: unknown[] }).daily_itinerary;
  }
  return Object.values(value as Record<string, unknown>);
}

function durationFrom(value: unknown) {
  const duration = numberFrom(value, 90);
  if (duration <= 12) return Math.round(duration * 60);
  return Math.round(duration);
}

function costFrom(value: unknown, fallback: number) {
  const cost = numberFrom(value, fallback);
  return Math.max(0, Math.round(cost));
}

function coordsFrom(value: unknown, center: [number, number], offsetIndex: number): [number, number] {
  if (Array.isArray(value) && value.length >= 2) {
    const lat = numberFrom(value[0], center[0]);
    const lng = numberFrom(value[1], center[1]);
    return [lat, lng];
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const lat = numberFrom(record.lat ?? record.latitude, Number.NaN);
    const lng = numberFrom(record.lng ?? record.lon ?? record.longitude, Number.NaN);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];

    const nested = record.coordinates ?? record.location ?? record.coords;
    if (Array.isArray(nested) && nested.length >= 2) {
      return [numberFrom(nested[0], center[0]), numberFrom(nested[1], center[1])];
    }
  }

  return distanceLabel(center, offsetIndex);
}

function buildDayTitle(rawDay: Record<string, unknown>, index: number, destination: string) {
  return textFrom(rawDay.title, rawDay.day_title, rawDay.name) || `Day ${index + 1} in ${destination}`;
}

function buildActivityName(rawActivity: Record<string, unknown>, index: number, dayTitle: string) {
  return textFrom(rawActivity.name, rawActivity.title, rawActivity.label, rawActivity.place) || `${dayTitle} Stop ${index + 1}`;
}

function buildActivityType(rawActivity: Record<string, unknown>) {
  return textFrom(rawActivity.type, rawActivity.category, rawActivity.kind) || "Activity";
}

function normalizeActivity(
  rawActivity: unknown,
  dayIndex: number,
  activityIndex: number,
  center: [number, number],
  coverImage: string,
  dayTitle: string
): Activity {
  if (typeof rawActivity === "string") {
    return {
      id: `day-${dayIndex + 1}-activity-${activityIndex + 1}`,
      name: rawActivity,
      type: "Activity",
      durationMin: 90,
      estimatedCostUSD: 0,
      coords: distanceLabel(center, dayIndex + activityIndex + 1),
      photo: coverImage,
      description: rawActivity
    };
  }

  const record = (rawActivity ?? {}) as Record<string, unknown>;
  const name = buildActivityName(record, activityIndex, dayTitle);
  const type = buildActivityType(record);
  const description = textFrom(record.description, record.summary, record.note, record.details) || name;
  const coords = coordsFrom(record.coords ?? record.coordinates ?? record.location, center, dayIndex + activityIndex + 1);
  const photo = textFrom(record.photo, record.image, record.image_url, record.photo_url) || coverImage;
  const durationMin = durationFrom(
    record.durationMin ?? record.duration_min ?? record.duration ?? record.minutes ?? record.time
  );
  const estimatedCostUSD = costFrom(
    record.estimatedCostUSD ?? record.estimated_cost_usd ?? record.estimated_cost ?? record.cost ?? record.price,
    0
  );

  return {
    id: textFrom(record.id, record.key) || `day-${dayIndex + 1}-activity-${activityIndex + 1}`,
    name,
    type,
    durationMin,
    estimatedCostUSD,
    coords,
    photo,
    description
  };
}

function normalizeDays(
  rawDailyItinerary: unknown,
  destination: string,
  center: [number, number],
  coverImage: string,
  fallbackDays: number
) {
  const rawDays = arrayFrom(rawDailyItinerary);
  const days: Day[] = [];

  rawDays.forEach((rawDay, index) => {
    const dayRecord = (rawDay ?? {}) as Record<string, unknown>;
    const dayNumber = numberFrom(dayRecord.day ?? dayRecord.day_number ?? dayRecord.dayNo, index + 1);
    const dayTitle = buildDayTitle(dayRecord, index, destination);
    const rawActivities =
      dayRecord.activities ?? dayRecord.items ?? dayRecord.stops ?? dayRecord.events ?? dayRecord.plan ?? [];
    const normalizedActivities = arrayFrom(rawActivities).map((activity, activityIndex) =>
      normalizeActivity(activity, index, activityIndex, center, coverImage, dayTitle)
    );

    const safeActivities =
      normalizedActivities.length > 0
        ? normalizedActivities
        : [
            normalizeActivity(
              {
                name: `${destination} arrival walk`,
                type: "Arrival",
                description: `First impressions of ${destination}.`
              },
              index,
              0,
              center,
              coverImage,
              dayTitle
            ),
            normalizeActivity(
              {
                name: `${destination} local dinner`,
                type: "Food",
                description: `A relaxed local dining experience in ${destination}.`
              },
              index,
              1,
              center,
              coverImage,
              dayTitle
            )
          ];

    const estimatedCostUSD = Math.max(
      0,
      Math.round(
        numberFrom(
          dayRecord.estimatedCostUSD ?? dayRecord.estimated_cost_usd ?? dayRecord.daily_cost ?? dayRecord.cost,
          safeActivities.reduce((sum, activity) => sum + activity.estimatedCostUSD, 0) + 75
        )
      )
    );

    days.push({
      day: dayNumber || index + 1,
      title: dayTitle,
      activities: safeActivities,
      estimatedCostUSD,
      photos: safeActivities.slice(0, 3).map((activity) => activity.photo)
    });
  });

  if (days.length > 0) {
    return days;
  }

  const synthesized: Day[] = [];
  const totalDays = Math.max(1, fallbackDays);
  for (let index = 0; index < totalDays; index++) {
    const dayTitle = `Day ${index + 1} in ${destination}`;
    const activities = [
      normalizeActivity(
        { name: `${destination} highlights`, type: "Sightseeing", description: `Top sights in ${destination}.` },
        index,
        0,
        center,
        coverImage,
        dayTitle
      ),
      normalizeActivity(
        { name: `${destination} local dinner`, type: "Food", description: `A local meal to end the day.` },
        index,
        1,
        center,
        coverImage,
        dayTitle
      )
    ];
    synthesized.push({
      day: index + 1,
      title: dayTitle,
      activities,
      estimatedCostUSD: activities.reduce((sum, activity) => sum + activity.estimatedCostUSD, 0) + 75,
      photos: [coverImage]
    });
  }

  return synthesized;
}

function styleFromPreferences(inputStyles: TripStyle[], preferences: unknown) {
  const preferenceText = stringify(preferences).toLowerCase();
  const merged = [...inputStyles];

  if (preferenceText.includes("eco") && !merged.includes("Eco")) merged.push("Eco");
  if (preferenceText.includes("luxury") && !merged.includes("Luxury")) merged.push("Luxury");
  if (preferenceText.includes("adventure") && !merged.includes("Adventure")) merged.push("Adventure");
  if (preferenceText.includes("food") && !merged.includes("Culture & Food")) merged.push("Culture & Food");

  return unique(merged);
}

function buildProfile(
  input: TripFormInput,
  destination: string,
  budgetUSD: number,
  totalDays: number,
  styles: TripStyle[],
  preferences: unknown,
  memoryNote: string
): UserProfile {
  const preferenceText = stringify(preferences);
  const persona = styles.includes("Luxury")
    ? "Luxury AI Voyager"
    : styles.includes("Eco")
      ? "Eco-conscious AI Explorer"
      : styles.includes("Adventure")
        ? "Adventure AI Planner"
        : "Personalized AI Traveler";

  const signals: ProfileSignal[] = [
    { label: "Budget", value: `${budgetUSD} ${input.currency}` },
    { label: "Days", value: String(totalDays) },
    { label: "Travelers", value: String(input.travelers.adults + input.travelers.children + input.travelers.infants) },
    { label: "Styles", value: styles.join(", ") || "Balanced" },
    { label: "Destination", value: destination },
    { label: "Preference Fit", value: preferenceText ? preferenceText.slice(0, 48) : "AI planned" }
  ];

  return {
    persona,
    summary: `${totalDays}-day plan for ${destination} with ${styles.join(" and ") || "balanced"} priorities and a budget of ${budgetUSD} ${input.currency}.`,
    signals,
    memoryNote,
    history: input.memory?.lastDestination ? [`Last trip: ${input.memory.lastDestination}`] : [],
    socialActivity: styles.includes("Nightlife") ? "high" : styles.includes("Relax & Wellness") ? "low" : "medium"
  };
}

function buildSafetyInfo(destination: string, country: string, safetySummary: unknown, emergencyNumber: string): SafetyInfo {
  const summaryText = stringify(safetySummary).toLowerCase();
  const status: SafetyInfo["status"] = summaryText.includes("alert")
    ? "alert"
    : summaryText.includes("caution") || summaryText.includes("risk")
      ? "caution"
      : "safe";

  const alerts: SafetyAlert[] = summaryText
    ? [
        {
          title: status === "safe" ? "Travel guidance" : "Active travel advisory",
          level: status === "alert" ? "high" : status === "caution" ? "medium" : "low",
          description:
            stringify(safetySummary).slice(0, 180) || `Review current safety information before visiting ${destination}.`
        }
      ]
    : [
        {
          title: "General awareness",
          level: "low",
          description: `Use standard precautions while exploring ${destination}, ${country}.`
        }
      ];

  return {
    status,
    emergencyNumber,
    nearestHospital: { name: `${destination} Central Hospital`, distanceKm: 1.2 },
    nearestPolice: { name: `${destination} Police Station`, distanceKm: 0.8 },
    alerts,
    nightRiskAreas: ["Central transit hubs", "Late-night side streets"],
    scamAlerts: ["Unlicensed taxis", "Overpriced street vendors"]
  };
}

function buildExperiences(days: Day[], coverImage: string): Experience[] {
  const activities = days.flatMap((day) => day.activities).slice(0, 6);
  return activities.map((activity, index) => ({
    id: `exp-${index + 1}-${activity.id}`,
    title: activity.name,
    priceUSD: Math.max(15, activity.estimatedCostUSD + 10),
    photo: activity.photo || coverImage,
    rating: clamp(4.4 + (index % 4) * 0.1, 4.3, 4.9),
    durationMin: activity.durationMin
  }));
}

function buildPricingSignals(totalCostUSD: number, budgetUSD: number, destination: string, styles: TripStyle[]) {
  return [
    {
      type: "flight" as const,
      trend: totalCostUSD > budgetUSD ? "up" : "down",
      impactUSD: Math.round(budgetUSD * 0.18),
      confidence: 74,
      message: `Flight prices to ${destination} are better midweek; booking flexibility can save money.`
    },
    {
      type: "hotel" as const,
      trend: styles.includes("Luxury") ? "up" : "stable",
      impactUSD: Math.round(budgetUSD * 0.12),
      confidence: 68,
      message: "Hotel prices are usually strongest when you check in on a Tuesday or Wednesday."
    },
    {
      type: "activity" as const,
      trend: "down" as const,
      impactUSD: 38,
      confidence: 62,
      message: "Popular tours can be cheaper with early booking or local operator bundles."
    }
  ];
}

function buildOptimizations(budgetUSD: number, styles: TripStyle[]) {
  return [
    {
      category: "budget" as const,
      message: "Swap one premium meal for a local lunch to keep the trip leaner.",
      savingsUSD: Math.round(budgetUSD * 0.08)
    },
    {
      category: "time" as const,
      message: "Cluster sightseeing by neighborhood to avoid unnecessary transfers.",
      timeSavedMin: 45
    },
    {
      category: "safety" as const,
      message: "Keep late-evening movement on main roads and well-lit transit corridors.",
      riskLevel: styles.includes("Nightlife") ? "medium" : "low"
    },
    {
      category: "weather" as const,
      message: "Keep a short indoor backup for a midday weather swing.",
      timeSavedMin: 30
    },
    {
      category: "eco" as const,
      message: "Use metro or walking for inner-city hops to reduce emissions.",
      savingsUSD: 24
    }
  ] as OptimizationTip[];
}

function buildHiddenGems(days: Day[], destination: string, coverImage: string): HiddenGem[] {
  const candidates = days.flatMap((day) => day.activities).slice(1, 4);
  if (candidates.length > 0) {
    return candidates.map((activity, index) => ({
      name: activity.name,
      type: `Hidden ${activity.type}`,
      description: activity.description,
      coords: activity.coords,
      photo: activity.photo || coverImage,
      popularityScore: 35 + index * 8
    }));
  }

  return [
    {
      name: `${destination} side streets`,
      type: "Hidden Walk",
      description: `Quiet local streets with less tourist traffic in ${destination}.`,
      coords: [20, 0],
      photo: coverImage,
      popularityScore: 38
    }
  ];
}

function buildPredictions(destination: string, totalDays: number): Prediction[] {
  return [
    {
      type: "crowd",
      message: `Crowd levels in ${destination} are likely to peak around mid-afternoon on Day ${Math.min(2, totalDays)}.`,
      confidence: 71
    },
    {
      type: "delay",
      message: "Early transfers are usually smoother than late-evening airport runs.",
      confidence: 64
    },
    {
      type: "weather",
      message: "Keep a light jacket handy for a short weather swing during the itinerary.",
      confidence: 58
    }
  ];
}

function buildCopilot(destination: string) {
  return [
    {
      id: `cp-${normalizeDestinationKey(destination)}-1`,
      time: "Today 09:20",
      type: "weather" as const,
      message: "Weather conditions suggest moving outdoor sightseeing earlier in the day.",
      action: "Route updated"
    },
    {
      id: `cp-${normalizeDestinationKey(destination)}-2`,
      time: "Today 12:10",
      type: "transport" as const,
      message: "A congestion spike was detected near the main corridor; an alternate route is available.",
      action: "Alternate route"
    },
    {
      id: `cp-${normalizeDestinationKey(destination)}-3`,
      time: "Today 18:40",
      type: "safety" as const,
      message: "Crowd density is elevated near the core attractions; keep to the main streets.",
      action: "Safety alert"
    }
  ];
}

function buildMarketplace(destination: string, coverImage: string, experiences: Experience[], accommodation: unknown): MarketplaceOffer[] {
  const accommodationName = textFrom(
    (accommodation as Record<string, unknown> | null)?.name,
    (accommodation as Record<string, unknown> | null)?.title,
    (accommodation as Record<string, unknown> | null)?.property_name
  );

  const selectedAccommodation = accommodationName || `${destination} Eco Stay`;

  return [
    {
      id: `mk-${normalizeDestinationKey(destination)}-guide`,
      title: `${destination} Local Guide (3h)`,
      category: "guide",
      priceUSD: 68,
      rating: 4.8,
      photo: experiences[0]?.photo || coverImage,
      provider: "Local Pathfinders"
    },
    {
      id: `mk-${normalizeDestinationKey(destination)}-driver`,
      title: "Private Airport Transfer",
      category: "driver",
      priceUSD: 42,
      rating: 4.7,
      photo: coverImage,
      provider: "CityRide Partners"
    },
    {
      id: `mk-${normalizeDestinationKey(destination)}-photo`,
      title: "Sunset Photo Walk",
      category: "photographer",
      priceUSD: 55,
      rating: 4.9,
      photo: experiences[1]?.photo || coverImage,
      provider: "Frame & Lens"
    },
    {
      id: `mk-${normalizeDestinationKey(destination)}-hotel`,
      title: selectedAccommodation,
      category: "hotel",
      priceUSD: 120,
      rating: 4.6,
      photo: coverImage,
      provider: "GreenKey Hotels"
    },
    {
      id: `mk-${normalizeDestinationKey(destination)}-food`,
      title: "Chef-led Local Dinner",
      category: "restaurant",
      priceUSD: 34,
      rating: 4.7,
      photo: experiences[2]?.photo || coverImage,
      provider: "Taste of the City"
    },
    {
      id: `mk-${normalizeDestinationKey(destination)}-tour`,
      title: "Hidden Gems Walking Tour",
      category: "tour",
      priceUSD: 28,
      rating: 4.5,
      photo: experiences[3]?.photo || coverImage,
      provider: "Secret Streets"
    }
  ];
}

function memoryNoteFromInput(input: TripFormInput) {
  if (input.memory?.lastDestination) {
    return `Last trip: ${input.memory.lastDestination}.`;
  }
  return "We will remember your preferences for next time.";
}

export function getTravelAiBackendBaseUrl() {
  return (process.env.TRAVEL_AI_BACKEND_URL ?? DEFAULT_BACKEND_BASE_URL).replace(/\/+$/, "");
}

export function readOrCreateAnonymousUserId(existing?: string | null) {
  if (existing && existing.trim()) return existing.trim();
  return `aste-${globalThis.crypto.randomUUID()}`;
}

export function buildBackendTripPrompt(input: TripFormInput) {
  const durationDays = Math.max(
    1,
    Math.round((new Date(input.endDate).getTime() - new Date(input.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
  const travelerCount = input.travelers.adults + input.travelers.children + input.travelers.infants;
  const structuredPrompt = [
    `Plan a ${durationDays}-day ${input.tripType === "round" ? "round-trip" : "one-way"} trip from ${input.from} to ${input.to}.`,
    `Travelers: ${travelerCount} total (${input.travelers.adults} adults, ${input.travelers.children} children, ${input.travelers.infants} infants).`,
    `Budget: ${input.budget} ${input.currency}.`,
    input.styles.length ? `Styles: ${input.styles.join(", ")}.` : "",
    input.memory?.lastDestination ? `Previous trip memory: last destination ${input.memory.lastDestination}.` : "",
    input.prompt?.trim() ? `User request: ${input.prompt.trim()}` : ""
  ]
    .filter(Boolean)
    .join(" ");

  return structuredPrompt.trim();
}

export function buildBackendTripRequest(input: TripFormInput, userId: string, prompt: string) {
  return {
    user_id: userId,
    prompt,
    budget: input.budget,
    destination: input.to,
    start_date: input.startDate,
    end_date: input.endDate,
    travelers: input.travelers.adults + input.travelers.children + input.travelers.infants
  };
}

export function normalizeBackendTripPlan(
  input: TripFormInput,
  response: BackendTripPlanResponse,
  prompt: string,
  userId: string
): Trip {
  const data = response.data ?? {};
  const responseDestination = textFrom(response.destination, data.target_destination, input.to) || input.to;
  const { destination, country } = splitDestination(responseDestination);
  const meta = resolveDestinationMeta(destination, country || undefined);
  const currency = textFrom(data.currency, input.currency) || input.currency;
  const budgetUSD = numberFrom(response.budget ?? input.budget, input.budget);
  const totalDays = Math.max(1, numberFrom(data.total_days, 0));
  const styles = styleFromPreferences(input.styles, data.user_preferences);
  const memoryNote = memoryNoteFromInput(input);
  const days = normalizeDays(data.daily_itinerary, destination, meta.center, meta.coverImage, totalDays || 1);
  const totalCostUSD = Math.max(
    0,
    Math.round(numberFrom(data.total_estimated_cost, days.reduce((sum, day) => sum + day.estimatedCostUSD, 0)))
  );
  const ecoScore = clamp(numberFrom(data.eco_score, 70), 0, 100);
  const eco: Trip["eco"] = {
    greenTransportScore: clamp(Math.round(ecoScore + (styles.includes("Eco") ? 8 : 0) - (styles.includes("Luxury") ? 6 : 0)), 0, 100),
    localBusinessScore: clamp(Math.round(ecoScore - 8 + (styles.includes("Culture & Food") ? 8 : 0)), 0, 100),
    certifiedStays: Array.isArray(data.chosen_accommodation) ? Math.max(1, data.chosen_accommodation.length) : 1,
    offsetUSD: Math.max(0, Math.round(totalCostUSD * 0.06))
  };
  const safety = buildSafetyInfo(destination, meta.country, data.safety_summary, meta.emergencyNumber);
  const experiences = buildExperiences(days, meta.coverImage);
  const hiddenGems = buildHiddenGems(days, destination, meta.coverImage);
  const tripId = textFrom(response.trip_id) || `trip-${userId}-${Date.now()}`;
  const profile = buildProfile(input, destination, budgetUSD, days.length || totalDays, styles, data.user_preferences, memoryNote);
  const summary =
    textFrom(response.message) ||
    `${days.length || totalDays}-day plan for ${destination} built around ${styles.slice(0, 2).join(" and ") || "balanced priorities"}.`;

  return {
    id: tripId,
    destination,
    country,
    coverImage: meta.coverImage,
    summary,
    currency,
    prompt: input.prompt?.trim() || prompt,
    profile,
    days,
    totalCostUSD,
    budgetUSD,
    ecoScore,
    carbonKg: Math.max(45, Math.round(totalCostUSD * 0.22 + days.length * 18)),
    ecoTips: DEFAULT_ECO_TIPS,
    eco,
    safety,
    experiences,
    pricing: buildPricingSignals(totalCostUSD, budgetUSD, destination, styles),
    optimizations: buildOptimizations(budgetUSD, styles),
    hiddenGems,
    predictions: buildPredictions(destination, days.length || totalDays),
    copilot: buildCopilot(destination),
    offline: {
      status: "ready",
      lastSynced: new Date().toISOString().slice(0, 10),
      sizeMB: 96 + (days.length || totalDays) * 8
    },
    marketplace: buildMarketplace(destination, meta.coverImage, experiences, data.chosen_accommodation)
  };
}
