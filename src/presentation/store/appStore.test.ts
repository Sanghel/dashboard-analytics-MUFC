import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './appStore';

describe('appStore', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useAppStore.setState({
      sidebarOpen: true,
      selectedLeagueId: 39,
      selectedSeason: 2024,
    });
  });

  it('initial state has selectedLeagueId 39 (Premier League)', () => {
    const state = useAppStore.getState();
    expect(state.selectedLeagueId).toBe(39);
  });

  it('initial state has selectedSeason 2024', () => {
    const state = useAppStore.getState();
    expect(state.selectedSeason).toBe(2024);
  });

  it('initial state has sidebarOpen true', () => {
    const state = useAppStore.getState();
    expect(state.sidebarOpen).toBe(true);
  });

  it('setSelectedLeagueId updates selectedLeagueId', () => {
    const { setSelectedLeagueId } = useAppStore.getState();
    setSelectedLeagueId(140); // La Liga
    expect(useAppStore.getState().selectedLeagueId).toBe(140);
  });

  it('setSelectedSeason updates selectedSeason', () => {
    const { setSelectedSeason } = useAppStore.getState();
    setSelectedSeason(2023);
    expect(useAppStore.getState().selectedSeason).toBe(2023);
  });

  it('setSidebarOpen updates sidebarOpen', () => {
    const { setSidebarOpen } = useAppStore.getState();
    setSidebarOpen(false);
    expect(useAppStore.getState().sidebarOpen).toBe(false);
  });

  it('setSidebarOpen can toggle back to true', () => {
    const { setSidebarOpen } = useAppStore.getState();
    setSidebarOpen(false);
    setSidebarOpen(true);
    expect(useAppStore.getState().sidebarOpen).toBe(true);
  });
});
