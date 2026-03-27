import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  selectedLeagueId: number;
  selectedSeason: number;
  setSidebarOpen: (open: boolean) => void;
  setSelectedLeagueId: (id: number) => void;
  setSelectedSeason: (season: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      selectedLeagueId: 39, // Premier League
      selectedSeason: 2024,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSelectedLeagueId: (id) => set({ selectedLeagueId: id }),
      setSelectedSeason: (season) => set({ selectedSeason: season }),
    }),
    {
      name: 'mufc-app-store',
      partialize: (state) => ({
        selectedLeagueId: state.selectedLeagueId,
        selectedSeason: state.selectedSeason,
      }),
    }
  )
);
