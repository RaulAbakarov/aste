"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Trip } from "./types";

type Tab = "itinerary" | "map" | "budget";

type SavedTrip = {
  id: string;
  destination: string;
  country: string;
  days: number;
  coverImage: string;
  summary: string;
};

type State = {
  trip: Trip | null;
  loading: boolean;
  activeTab: Tab;
  favorited: boolean;
  favorites: string[];
  savedTrips: SavedTrip[];
  setTrip: (t: Trip | null) => void;
  setLoading: (b: boolean) => void;
  setTab: (t: Tab) => void;
  toggleFavorite: () => void;
};

function toSavedTrip(trip: Trip): SavedTrip {
  return {
    id: trip.id,
    destination: trip.destination,
    country: trip.country,
    days: trip.days.length,
    coverImage: trip.coverImage,
    summary: trip.summary
  };
}

export const useTripStore = create<State>()(
  persist(
    (set, get) => ({
      trip: null,
      loading: false,
      activeTab: "itinerary",
      favorited: false,
      favorites: [],
      savedTrips: [],
      setTrip: (t) => {
        const favorites = get().favorites;
        set({
          trip: t,
          favorited: t ? favorites.includes(t.id) : false
        });
      },
      setLoading: (b) => set({ loading: b }),
      setTab: (t) => set({ activeTab: t }),
      toggleFavorite: () => {
        const trip = get().trip;
        if (!trip) return;
        const favorites = new Set(get().favorites);
        let savedTrips = [...get().savedTrips];
        if (favorites.has(trip.id)) {
          favorites.delete(trip.id);
          savedTrips = savedTrips.filter((t) => t.id !== trip.id);
          set({ favorites: Array.from(favorites), savedTrips, favorited: false });
          return;
        }
        favorites.add(trip.id);
        if (!savedTrips.some((t) => t.id === trip.id)) {
          savedTrips = [toSavedTrip(trip), ...savedTrips];
        }
        set({ favorites: Array.from(favorites), savedTrips, favorited: true });
      }
    }),
    {
      name: "aste.store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        trip: state.trip,
        favorites: state.favorites,
        savedTrips: state.savedTrips
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const trip = state.trip;
        const favorites = state.favorites ?? [];
        state.favorited = trip ? favorites.includes(trip.id) : false;
      }
    }
  )
);
