"use client";
import { create } from "zustand";
import type { Trip } from "./types";

type Tab = "itinerary" | "map" | "budget";

type State = {
  trip: Trip | null;
  loading: boolean;
  activeTab: Tab;
  favorited: boolean;
  setTrip: (t: Trip | null) => void;
  setLoading: (b: boolean) => void;
  setTab: (t: Tab) => void;
  toggleFavorite: () => void;
};

export const useTripStore = create<State>((set) => ({
  trip: null,
  loading: false,
  activeTab: "itinerary",
  favorited: false,
  setTrip: (t) => set({ trip: t }),
  setLoading: (b) => set({ loading: b }),
  setTab: (t) => set({ activeTab: t }),
  toggleFavorite: () => set((s) => ({ favorited: !s.favorited }))
}));
