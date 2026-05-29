import type {
  Trip,
  TripFormInput,
  Day,
  Activity,
  Experience,
  EcoTip,
  SafetyInfo,
  PricingSignal,
  OptimizationTip,
  HiddenGem,
  Prediction,
  CopilotEvent,
  MarketplaceOffer,
  UserProfile,
  TripStyle
} from "./types";
import { parsePrompt } from "./prompt";

// Curated destinations with real coordinates and Unsplash photos
const DESTINATIONS: Record<
  string,
  {
    country: string;
    coverImage: string;
    center: [number, number];
    emergencyNumber: string;
    pois: Array<{
      name: string;
      type: string;
      coords: [number, number];
      photo: string;
      description: string;
      cost: number;
      duration: number;
    }>;
  }
> = {
  istanbul: {
    country: "Turkey",
    coverImage:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80",
    center: [41.0082, 28.9784],
    emergencyNumber: "112",
    pois: [
      { name: "Hagia Sophia", type: "Landmark", coords: [41.0086, 28.98], photo: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80", description: "Iconic Byzantine masterpiece turned mosque.", cost: 25, duration: 120 },
      { name: "Blue Mosque", type: "Landmark", coords: [41.0054, 28.9768], photo: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80", description: "Stunning Ottoman mosque with six minarets.", cost: 0, duration: 90 },
      { name: "Grand Bazaar", type: "Shopping", coords: [41.0106, 28.9681], photo: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=800&q=80", description: "Historic covered market with 4,000 shops.", cost: 30, duration: 180 },
      { name: "Topkapi Palace", type: "Museum", coords: [41.0115, 28.9833], photo: "https://images.unsplash.com/photo-1597207218867-bc6e7e2f96fa?auto=format&fit=crop&w=800&q=80", description: "Royal Ottoman residence with treasury exhibits.", cost: 30, duration: 150 },
      { name: "Bosphorus Ferry", type: "Experience", coords: [41.0392, 29.0061], photo: "https://images.unsplash.com/photo-1605116959581-aabd7da4377a?auto=format&fit=crop&w=800&q=80", description: "Sunset cruise between two continents.", cost: 20, duration: 120 },
      { name: "Galata Tower", type: "Viewpoint", coords: [41.0256, 28.9744], photo: "https://images.unsplash.com/photo-1591019479261-1a103585c559?auto=format&fit=crop&w=800&q=80", description: "Medieval tower with 360° city views.", cost: 15, duration: 60 },
      { name: "Karaköy Street Food", type: "Food", coords: [41.024, 28.978], photo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80", description: "Walking food tour: simit, balık ekmek, baklava.", cost: 35, duration: 150 },
      { name: "Süleymaniye Mosque", type: "Landmark", coords: [41.016, 28.964], photo: "https://images.unsplash.com/photo-1602080858428-57174f9431cf?auto=format&fit=crop&w=800&q=80", description: "Sinan's masterpiece overlooking the Golden Horn.", cost: 0, duration: 60 },
      { name: "Basilica Cistern", type: "Museum", coords: [41.0084, 28.9779], photo: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=800&q=80", description: "Subterranean Roman cistern with Medusa columns.", cost: 20, duration: 60 }
    ]
  },
  paris: {
    country: "France",
    coverImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    center: [48.8566, 2.3522],
    emergencyNumber: "112",
    pois: [
      { name: "Eiffel Tower", type: "Landmark", coords: [48.8584, 2.2945], photo: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=800&q=80", description: "Iron icon of Paris, best at golden hour.", cost: 30, duration: 150 },
      { name: "Louvre Museum", type: "Museum", coords: [48.8606, 2.3376], photo: "https://images.unsplash.com/photo-1565060169861-2d4dd1c0d0e8?auto=format&fit=crop&w=800&q=80", description: "World's largest art museum, home of the Mona Lisa.", cost: 22, duration: 180 },
      { name: "Notre-Dame", type: "Landmark", coords: [48.853, 2.3499], photo: "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&w=800&q=80", description: "Gothic cathedral on Île de la Cité.", cost: 0, duration: 90 },
      { name: "Montmartre & Sacré-Cœur", type: "Neighborhood", coords: [48.8867, 2.3431], photo: "https://images.unsplash.com/photo-1551634979-2b11f8c946fe?auto=format&fit=crop&w=800&q=80", description: "Artsy hilltop village with basilica views.", cost: 10, duration: 180 },
      { name: "Seine River Cruise", type: "Experience", coords: [48.8606, 2.3076], photo: "https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=800&q=80", description: "Glide past Paris monuments by boat.", cost: 18, duration: 75 },
      { name: "Le Marais Walk", type: "Neighborhood", coords: [48.857, 2.3622], photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", description: "Trendy district with boutiques and cafés.", cost: 25, duration: 150 },
      { name: "Musée d'Orsay", type: "Museum", coords: [48.8599, 2.3266], photo: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80", description: "Impressionist masterpieces in a former station.", cost: 16, duration: 120 },
      { name: "Latin Quarter Bistro", type: "Food", coords: [48.8489, 2.347], photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80", description: "Classic French dinner: steak frites & wine.", cost: 45, duration: 120 },
      { name: "Versailles Day Trip", type: "Day Trip", coords: [48.8049, 2.1204], photo: "https://images.unsplash.com/photo-1551041777-ed7fa3fa1bf2?auto=format&fit=crop&w=800&q=80", description: "Royal palace and sprawling gardens.", cost: 35, duration: 360 }
    ]
  },
  tokyo: {
    country: "Japan",
    coverImage:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=80",
    center: [35.6762, 139.6503],
    emergencyNumber: "110",
    pois: [
      { name: "Senso-ji Temple", type: "Landmark", coords: [35.7148, 139.7967], photo: "https://images.unsplash.com/photo-1583400847194-1782d44d2b04?auto=format&fit=crop&w=800&q=80", description: "Tokyo's oldest Buddhist temple in Asakusa.", cost: 0, duration: 90 },
      { name: "Shibuya Crossing", type: "Landmark", coords: [35.6595, 139.7004], photo: "https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=800&q=80", description: "World's busiest pedestrian scramble.", cost: 0, duration: 45 },
      { name: "TeamLab Borderless", type: "Museum", coords: [35.6266, 139.7833], photo: "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&w=800&q=80", description: "Immersive digital art experience.", cost: 32, duration: 180 },
      { name: "Tsukiji Outer Market", type: "Food", coords: [35.6655, 139.7707], photo: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80", description: "Fresh sushi breakfast and street snacks.", cost: 28, duration: 120 },
      { name: "Meiji Shrine", type: "Landmark", coords: [35.6764, 139.6993], photo: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80", description: "Forested Shinto sanctuary in Shibuya.", cost: 0, duration: 75 },
      { name: "Akihabara Anime District", type: "Neighborhood", coords: [35.7022, 139.7745], photo: "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=80", description: "Electric town for anime, games, and gadgets.", cost: 30, duration: 150 },
      { name: "Mount Fuji Day Trip", type: "Day Trip", coords: [35.3606, 138.7274], photo: "https://images.unsplash.com/photo-1570459027562-4a916cc26b54?auto=format&fit=crop&w=800&q=80", description: "Day trip to Japan's iconic volcano.", cost: 85, duration: 480 },
      { name: "Shinjuku Izakaya Night", type: "Food", coords: [35.6938, 139.7036], photo: "https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=800&q=80", description: "Yakitori and sake in tiny back-alley bars.", cost: 40, duration: 150 },
      { name: "Ueno Park & Museums", type: "Park", coords: [35.7156, 139.7732], photo: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80", description: "Cherry-blossom park with national museums.", cost: 12, duration: 180 }
    ]
  },
  barcelona: {
    country: "Spain",
    coverImage:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1600&q=80",
    center: [41.3851, 2.1734],
    emergencyNumber: "112",
    pois: [
      { name: "Sagrada Família", type: "Landmark", coords: [41.4036, 2.1744], photo: "https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80", description: "Gaudí's unfinished basilica masterpiece.", cost: 26, duration: 120 },
      { name: "Park Güell", type: "Park", coords: [41.4145, 2.1527], photo: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80", description: "Mosaic wonderland with city views.", cost: 10, duration: 120 },
      { name: "La Rambla Walk", type: "Neighborhood", coords: [41.3818, 2.1729], photo: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80", description: "Lively boulevard with street performers.", cost: 15, duration: 90 },
      { name: "Gothic Quarter", type: "Neighborhood", coords: [41.3833, 2.1769], photo: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?auto=format&fit=crop&w=800&q=80", description: "Medieval alleys and hidden plazas.", cost: 20, duration: 150 },
      { name: "Tapas Tour El Born", type: "Food", coords: [41.3851, 2.1832], photo: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=800&q=80", description: "Five-stop tapas and cava crawl.", cost: 50, duration: 180 },
      { name: "Casa Batlló", type: "Landmark", coords: [41.3917, 2.1649], photo: "https://images.unsplash.com/photo-1580428180164-fa6a44d5c0c7?auto=format&fit=crop&w=800&q=80", description: "Gaudí's surreal modernist townhouse.", cost: 35, duration: 90 },
      { name: "Barceloneta Beach", type: "Beach", coords: [41.3784, 2.1925], photo: "https://images.unsplash.com/photo-1591267990532-e5bdb1b0ceb8?auto=format&fit=crop&w=800&q=80", description: "Mediterranean beach and seafood paella.", cost: 25, duration: 180 },
      { name: "Montjuïc Cable Car", type: "Viewpoint", coords: [41.3636, 2.1664], photo: "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?auto=format&fit=crop&w=800&q=80", description: "Sky views over the harbor and city.", cost: 14, duration: 90 }
    ]
  },
  bali: {
    country: "Indonesia",
    coverImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
    center: [-8.3405, 115.092],
    emergencyNumber: "112",
    pois: [
      { name: "Ubud Monkey Forest", type: "Nature", coords: [-8.5188, 115.2588], photo: "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80", description: "Sacred sanctuary with hundreds of monkeys.", cost: 8, duration: 90 },
      { name: "Tegalalang Rice Terraces", type: "Nature", coords: [-8.4318, 115.2785], photo: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80", description: "Iconic stepped green rice paddies.", cost: 10, duration: 120 },
      { name: "Tanah Lot Temple", type: "Landmark", coords: [-8.6212, 115.0868], photo: "https://images.unsplash.com/photo-1604665890706-79a4b6b5b8c8?auto=format&fit=crop&w=800&q=80", description: "Sea temple on a rocky outcrop at sunset.", cost: 5, duration: 90 },
      { name: "Seminyak Sunset Bar", type: "Nightlife", coords: [-8.6905, 115.1729], photo: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80", description: "Beachfront cocktails as the sun dips.", cost: 25, duration: 120 },
      { name: "Mount Batur Sunrise Trek", type: "Adventure", coords: [-8.2422, 115.3753], photo: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=800&q=80", description: "Pre-dawn volcano hike with epic views.", cost: 55, duration: 360 },
      { name: "Balinese Cooking Class", type: "Food", coords: [-8.5069, 115.2625], photo: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80", description: "Market tour + traditional cooking workshop.", cost: 40, duration: 240 },
      { name: "Uluwatu Temple", type: "Landmark", coords: [-8.8291, 115.0849], photo: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80", description: "Clifftop temple with Kecak fire dance.", cost: 10, duration: 120 }
    ]
  },
  newyork: {
    country: "USA",
    coverImage:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80",
    center: [40.7128, -74.006],
    emergencyNumber: "911",
    pois: [
      { name: "Statue of Liberty", type: "Landmark", coords: [40.6892, -74.0445], photo: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80", description: "Ferry to Lady Liberty and Ellis Island.", cost: 25, duration: 240 },
      { name: "Central Park Walk", type: "Park", coords: [40.7829, -73.9654], photo: "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?auto=format&fit=crop&w=800&q=80", description: "843-acre green oasis in midtown.", cost: 0, duration: 180 },
      { name: "Times Square", type: "Landmark", coords: [40.758, -73.9855], photo: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=800&q=80", description: "Neon-lit crossroads of the world.", cost: 0, duration: 60 },
      { name: "MoMA", type: "Museum", coords: [40.7614, -73.9776], photo: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&w=800&q=80", description: "Modern art icons from Van Gogh to Warhol.", cost: 30, duration: 150 },
      { name: "Brooklyn Bridge Walk", type: "Landmark", coords: [40.7061, -73.9969], photo: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=80", description: "Iconic walk between Manhattan and Brooklyn.", cost: 0, duration: 90 },
      { name: "High Line Park", type: "Park", coords: [40.748, -74.0048], photo: "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=800&q=80", description: "Elevated park on a former rail line.", cost: 0, duration: 90 },
      { name: "Broadway Show", type: "Experience", coords: [40.7589, -73.9851], photo: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80", description: "World-class theater on the Great White Way.", cost: 120, duration: 180 },
      { name: "Greenwich Village Food Tour", type: "Food", coords: [40.7335, -74.0027], photo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80", description: "Pizza, bagels, and artisan bites.", cost: 55, duration: 180 }
    ]
  }
};

const STYLE_PHOTOS: Record<string, string> = {
  default:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
};

const ALIASES: Record<string, string[]> = {
  istanbul: ["istanbul", "ist", "turkiye", "turkey"],
  paris: ["paris", "france"],
  tokyo: ["tokyo", "japan"],
  barcelona: ["barcelona", "spain"],
  bali: ["bali", "indonesia"],
  newyork: ["new york", "nyc", "newyork", "usa", "united states"]
};

function matchDestination(query: string): { key: string; data: typeof DESTINATIONS[string]; matched: boolean } {
  const q = query.toLowerCase();
  for (const [key, aliases] of Object.entries(ALIASES)) {
    if (aliases.some((a) => q.includes(a))) {
      return { key, data: DESTINATIONS[key], matched: true };
    }
  }
  for (const key of Object.keys(DESTINATIONS)) {
    if (q.includes(key)) return { key, data: DESTINATIONS[key], matched: true };
  }
  // default fallback: Istanbul (matches the mockup screenshot)
  return { key: "istanbul", data: DESTINATIONS.istanbul, matched: false };
}

function pickN<T>(arr: T[], n: number, seed: number): T[] {
  const a = [...arr];
  // simple deterministic shuffle from seed
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

function mergeStyles(base: TripStyle[], extra: TripStyle[]) {
  return Array.from(new Set([...(base || []), ...(extra || [])]));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function budgetTier(budget: number) {
  if (budget < 400) return "Budget";
  if (budget < 1200) return "Smart";
  if (budget < 2500) return "Comfort";
  return "Premium";
}

function personaFrom(styles: TripStyle[], budget: number) {
  const tier = budgetTier(budget);
  if (styles.includes("Luxury")) return `${tier} Luxury Voyager`;
  if (styles.includes("Eco")) return `${tier} Eco Explorer`;
  if (styles.includes("Adventure")) return `${tier} Adventure Seeker`;
  if (styles.includes("Backpacker")) return `${tier} Backpacker`;
  return `${tier} City Traveler`;
}

export function generateMockTrip(input: TripFormInput): Trip {
  const prompt = input.prompt?.trim() ?? "";
  const parsed = parsePrompt(prompt);
  const resolvedTo = parsed.destination ?? input.to;
  const resolvedBudget = parsed.budget ?? input.budget;
  const resolvedCurrency = parsed.currency ?? input.currency;
  const resolvedStyles = mergeStyles(input.styles, parsed.styles);

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  const defaultDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const numDays = clamp(parsed.days ?? defaultDays, 1, 14);

  const { data, key, matched } = matchDestination(resolvedTo);
  const seed = (resolvedTo.length + resolvedBudget + numDays + resolvedStyles.length) * 13;

  const days: Day[] = [];
  for (let d = 1; d <= numDays; d++) {
    const dailyPois = pickN(data.pois, Math.min(4, data.pois.length), seed + d * 7);
    const activities: Activity[] = dailyPois.map((p, i) => ({
      id: `d${d}-a${i}`,
      name: p.name,
      type: p.type,
      durationMin: p.duration,
      estimatedCostUSD: p.cost,
      coords: p.coords,
      photo: p.photo,
      description: p.description
    }));
    const dailyCost = activities.reduce((sum, a) => sum + a.estimatedCostUSD, 0) + 80; // lodging
    days.push({
      day: d,
      title: `${dailyPois[0]?.type ?? "Explore"} & ${dailyPois[1]?.type ?? "Local"} ${
        d === 1 ? "Arrival" : d === numDays ? "Farewell" : "Day"
      }`,
      activities,
      estimatedCostUSD: dailyCost,
      photos: activities.slice(0, 3).map((a) => a.photo)
    });
  }

  const totalCost = days.reduce((s, d) => s + d.estimatedCostUSD, 0);

  // Eco score: higher for fewer days, low-budget, eco style
  const ecoBonus = resolvedStyles.includes("Eco") ? 12 : 0;
  const stylesPenalty = resolvedStyles.includes("Luxury") ? -10 : 0;
  const ecoScore = Math.min(98, Math.max(35, 78 + ecoBonus + stylesPenalty - (numDays - 3) * 2));
  const carbonKg = Math.round(80 + numDays * 18 + (resolvedStyles.includes("Luxury") ? 40 : 0));

  const ecoTips: EcoTip[] = [
    { tip: "Take the metro instead of taxis for short city hops.", savingKg: 14, icon: "bus" },
    { tip: "Choose plant-forward meals at least once a day.", savingKg: 9, icon: "utensils" },
    { tip: "Rent a bike for inner-city exploration.", savingKg: 6, icon: "bike" }
  ];

  const eco = {
    greenTransportScore: clamp(58 + ecoBonus + (resolvedStyles.includes("Luxury") ? -8 : 6), 35, 96),
    localBusinessScore: clamp(52 + (resolvedStyles.includes("Culture & Food") ? 16 : 6), 35, 92),
    certifiedStays: resolvedStyles.includes("Luxury") ? 2 : 1,
    offsetUSD: Math.round(carbonKg * 0.35)
  };

  const safetyStatus = resolvedStyles.includes("Nightlife") ? "caution" : "safe";
  const safety: SafetyInfo = {
    status: safetyStatus,
    emergencyNumber: data.emergencyNumber,
    nearestHospital: { name: "City Central Hospital", distanceKm: 1.2 },
    nearestPolice: { name: "Central Police Station", distanceKm: 0.8 },
    alerts: [
      {
        title: "Pickpocket risk",
        level: "medium",
        description: "Keep valuables secure in crowded squares and transit hubs."
      },
      {
        title: "Late-night transit",
        level: "low",
        description: "Use main stations after 22:00 for better lighting and staff."
      }
    ],
    nightRiskAreas: ["Old Town Alleys", "Market District Backstreets"],
    scamAlerts: ["Unofficial taxi meters", "Street bracelet vendors"]
  };

  const experiences: Experience[] = data.pois.slice(0, 6).map((p, i) => ({
    id: `exp-${key}-${i}`,
    title: p.name,
    priceUSD: Math.max(15, p.cost + 10),
    photo: p.photo,
    rating: 4.4 + ((i * 17) % 6) / 10,
    durationMin: p.duration
  }));

  const fallbackName = resolvedTo.split(",")[0]?.trim() || "Your destination";
  const destinationName = matched
    ? key === "newyork"
      ? "New York"
      : key[0].toUpperCase() + key.slice(1)
    : fallbackName;

  const persona = personaFrom(resolvedStyles, resolvedBudget);
  const budgetLabel = budgetTier(resolvedBudget);
  const socialActivity = resolvedStyles.includes("Nightlife")
    ? "high"
    : resolvedStyles.includes("Relax & Wellness")
      ? "low"
      : "medium";
  const memoryNote = input.memory?.lastDestination
    ? `Last time you visited ${input.memory.lastDestination}, you leaned toward ${
        input.memory.lastStyles?.join(", ") || "balanced"
      } trips.`
    : "We will remember your preferences for next time.";

  const profile: UserProfile = {
    persona,
    summary: `${budgetLabel} budget profile with a ${numDays}-day pace focused on ${
      resolvedStyles.slice(0, 2).join(" & ") || "iconic highlights"
    }.`,
    signals: [
      { label: "Budget", value: `${resolvedBudget} ${resolvedCurrency}`, score: Math.min(100, Math.round(resolvedBudget / 30)) },
      { label: "Travel Style", value: resolvedStyles.join(", ") || "Classic" },
      { label: "Eco Interest", value: resolvedStyles.includes("Eco") ? "High" : "Medium", score: resolvedStyles.includes("Eco") ? 86 : 58 },
      { label: "Luxury Preference", value: resolvedStyles.includes("Luxury") ? "High" : "Low", score: resolvedStyles.includes("Luxury") ? 84 : 38 },
      { label: "Adventure Level", value: resolvedStyles.includes("Adventure") ? "High" : "Medium", score: resolvedStyles.includes("Adventure") ? 78 : 52 },
      { label: "Food Focus", value: resolvedStyles.includes("Culture & Food") ? "High" : "Medium", score: resolvedStyles.includes("Culture & Food") ? 80 : 54 }
    ],
    memoryNote,
    history: input.memory?.lastDestination ? [`Last trip: ${input.memory.lastDestination}`] : [],
    socialActivity
  };

  const pricing: PricingSignal[] = [
    {
      type: "flight",
      trend: "down",
      impactUSD: Math.round(resolvedBudget * 0.18),
      confidence: 74,
      message: `Flight prices to ${destinationName} soften midweek. Book in 2 days to save.`
    },
    {
      type: "hotel",
      trend: resolvedStyles.includes("Luxury") ? "up" : "stable",
      impactUSD: Math.round(resolvedBudget * 0.12),
      confidence: 68,
      message: "Hotel rates look best if you check in on a Tuesday or Wednesday."
    },
    {
      type: "activity",
      trend: "down",
      impactUSD: 38,
      confidence: 62,
      message: "Popular tours have early-bird discounts before 10:00 AM."
    }
  ];

  const optimizations: OptimizationTip[] = [
    {
      category: "budget",
      message: "Swap one premium meal for a local market lunch to cut costs.",
      savingsUSD: Math.round(resolvedBudget * 0.08)
    },
    {
      category: "time",
      message: "Take the riverside route on Day 2 to avoid rush-hour traffic.",
      timeSavedMin: 45
    },
    {
      category: "safety",
      message: "Stick to main boulevards after 22:00; side streets are lower-lit.",
      riskLevel: "medium"
    },
    {
      category: "weather",
      message: "A light rain window is expected midday; swap outdoor plans to morning.",
      timeSavedMin: 30
    },
    {
      category: "eco",
      message: "Choose metro + walking for inner-city hops to reduce emissions.",
      savingsUSD: 24
    }
  ];

  const hiddenGems: HiddenGem[] = pickN(data.pois, 3, seed + 99).map((p, i) => ({
    name: p.name,
    type: `Hidden ${p.type}`,
    description: `Low-crowd spot with local vibes: ${p.description}`,
    coords: p.coords,
    photo: p.photo,
    popularityScore: 35 + (i * 7)
  }));

  const predictions: Prediction[] = [
    {
      type: "crowd",
      message: "Crowd levels peak on Day 2 afternoon around main landmarks.",
      confidence: 71
    },
    {
      type: "delay",
      message: "Morning transfers are smoother than late-evening airport runs.",
      confidence: 64
    },
    {
      type: "weather",
      message: "A quick drizzle window is likely on Day 3; pack a light jacket.",
      confidence: 58
    }
  ];

  const copilot: CopilotEvent[] = [
    {
      id: `cp-${key}-1`,
      time: "Today 09:20",
      type: "weather",
      message: "Rain expected at 16:00. Moving the sunset stop earlier.",
      action: "Route updated"
    },
    {
      id: `cp-${key}-2`,
      time: "Today 12:10",
      type: "transport",
      message: "Metro Line 2 is crowded; suggested alternate tram route.",
      action: "Alternate route"
    },
    {
      id: `cp-${key}-3`,
      time: "Today 18:40",
      type: "safety",
      message: "Crowd density elevated near the old town; stay on main streets.",
      action: "Safety alert"
    }
  ];

  const offline = {
    status: "ready" as const,
    lastSynced: new Date().toISOString().slice(0, 10),
    sizeMB: 128
  };

  const marketplace: MarketplaceOffer[] = [
    {
      id: `mk-${key}-guide`,
      title: `${destinationName} Local Guide (3h)`,
      category: "guide",
      priceUSD: 68,
      rating: 4.8,
      photo: data.pois[0]?.photo ?? data.coverImage,
      provider: "Local Pathfinders"
    },
    {
      id: `mk-${key}-driver`,
      title: "Private Airport Transfer",
      category: "driver",
      priceUSD: 42,
      rating: 4.7,
      photo: data.coverImage,
      provider: "CityRide Partners"
    },
    {
      id: `mk-${key}-photo`,
      title: "Sunset Photo Walk",
      category: "photographer",
      priceUSD: 55,
      rating: 4.9,
      photo: data.pois[1]?.photo ?? data.coverImage,
      provider: "Frame & Lens"
    },
    {
      id: `mk-${key}-hotel`,
      title: "Eco Boutique Stay",
      category: "hotel",
      priceUSD: 120,
      rating: 4.6,
      photo: data.coverImage,
      provider: "GreenKey Hotels"
    },
    {
      id: `mk-${key}-food`,
      title: "Chef-led Local Dinner",
      category: "restaurant",
      priceUSD: 34,
      rating: 4.7,
      photo: data.pois[2]?.photo ?? data.coverImage,
      provider: "Taste of the City"
    },
    {
      id: `mk-${key}-tour`,
      title: "Hidden Gems Walking Tour",
      category: "tour",
      priceUSD: 28,
      rating: 4.5,
      photo: data.pois[3]?.photo ?? data.coverImage,
      provider: "Secret Streets"
    }
  ];

  const focusTags: string[] = [];
  if (parsed.flags.eco) focusTags.push("eco-first");
  if (parsed.flags.luxury) focusTags.push("luxury");
  if (parsed.flags.hidden) focusTags.push("hidden gems");
  if (resolvedStyles.includes("Adventure")) focusTags.push("adventure");
  const focusNote = focusTags.length ? ` Focus: ${focusTags.join(", ")}.` : "";

  return {
    id: `trip-${Date.now()}`,
    destination: destinationName,
    country: data.country,
    coverImage: data.coverImage,
    summary: `A ${numDays}-day curated journey through ${destinationName} blending ${resolvedStyles
      .slice(0, 2)
      .join(" and ") || "iconic sights"}.${focusNote}`,
    currency: resolvedCurrency,
    prompt: prompt || undefined,
    profile,
    days,
    totalCostUSD: totalCost,
    budgetUSD: resolvedBudget,
    ecoScore,
    carbonKg,
    ecoTips,
    eco,
    safety,
    experiences,
    pricing,
    optimizations,
    hiddenGems,
    predictions,
    copilot,
    offline,
    marketplace
  };
}

export function destinationCenter(destName: string): [number, number] {
  const { data } = matchDestination(destName);
  return data.center;
}
