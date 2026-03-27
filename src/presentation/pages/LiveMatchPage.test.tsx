import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { LiveMatchPage } from './LiveMatchPage';
import type { Fixture, FixtureEvent, FixtureStatTeam } from '@/shared/types/football';

const { mockUseRecentFixtures, mockUseFixtureDetail } = vi.hoisted(() => ({
  mockUseRecentFixtures: vi.fn(),
  mockUseFixtureDetail: vi.fn(),
}));

vi.mock('@/presentation/hooks/useFixtures', () => ({
  useRecentFixtures: mockUseRecentFixtures,
}));

vi.mock('@/presentation/hooks/useFixtureDetail', () => ({
  useFixtureDetail: mockUseFixtureDetail,
}));

const mockFixture: Fixture = {
  id: 215662,
  date: '2024-12-01T15:00:00+00:00',
  timestamp: 1733065200,
  status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
  homeTeam: { id: 33, name: 'Manchester United', shortName: 'MU', logo: '' },
  awayTeam: { id: 40, name: 'Liverpool', shortName: 'LIV', logo: '' },
  homeGoals: 2,
  awayGoals: 1,
  league: { id: 39, name: 'Premier League', logo: '', round: 'Round 14' },
  venue: { name: 'Old Trafford', city: 'Manchester' },
};

const mockEvents: FixtureEvent[] = [
  {
    time: { elapsed: 12, extra: null },
    team: { id: 33, name: 'Manchester United', logo: '' },
    player: { id: 1, name: 'M. Rashford' },
    type: 'Goal',
    detail: 'Normal Goal',
    comments: null,
  },
];

const mockStats: FixtureStatTeam[] = [
  {
    team: { id: 33, name: 'Manchester United', logo: '' },
    statistics: [
      { type: 'Ball Possession', value: '54%' },
      { type: 'Total Shots', value: 14 },
      { type: 'Shots on Goal', value: 6 },
      { type: 'Corner Kicks', value: 7 },
      { type: 'Fouls', value: 8 },
      { type: 'Yellow Cards', value: 1 },
    ],
  },
  {
    team: { id: 40, name: 'Liverpool', logo: '' },
    statistics: [
      { type: 'Ball Possession', value: '46%' },
      { type: 'Total Shots', value: 9 },
      { type: 'Shots on Goal', value: 3 },
      { type: 'Corner Kicks', value: 4 },
      { type: 'Fouls', value: 12 },
      { type: 'Yellow Cards', value: 2 },
    ],
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('LiveMatchPage', () => {
  beforeEach(() => {
    mockUseRecentFixtures.mockReset();
    mockUseFixtureDetail.mockReset();
  });

  it('shows loading state', () => {
    mockUseRecentFixtures.mockReturnValue({ data: undefined, isLoading: true });
    mockUseFixtureDetail.mockReturnValue({
      events: undefined,
      statistics: undefined,
      isLoading: false,
      isError: false,
    });

    render(createElement(LiveMatchPage), { wrapper: createWrapper() });
    expect(screen.queryByText('Live Match')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows empty state when no recent fixtures', () => {
    mockUseRecentFixtures.mockReturnValue({ data: [], isLoading: false });
    mockUseFixtureDetail.mockReturnValue({
      events: undefined,
      statistics: undefined,
      isLoading: false,
      isError: false,
    });

    render(createElement(LiveMatchPage), { wrapper: createWrapper() });
    expect(screen.getByText('No match data available')).toBeInTheDocument();
  });

  it('shows real match events when available', async () => {
    mockUseRecentFixtures.mockReturnValue({ data: [mockFixture], isLoading: false });
    mockUseFixtureDetail.mockReturnValue({
      events: mockEvents,
      statistics: mockStats,
      isLoading: false,
      isError: false,
    });

    render(createElement(LiveMatchPage), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('M. Rashford')).toBeInTheDocument();
    });
    expect(screen.getByText(/Goal · Normal Goal/)).toBeInTheDocument();
  });

  it('shows loading state for detail while fixture is set', async () => {
    mockUseRecentFixtures.mockReturnValue({ data: [mockFixture], isLoading: false });
    mockUseFixtureDetail.mockReturnValue({
      events: undefined,
      statistics: undefined,
      isLoading: true,
      isError: false,
    });

    render(createElement(LiveMatchPage), { wrapper: createWrapper() });
    expect(screen.getByText('Loading statistics...')).toBeInTheDocument();
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
  });

  it('shows error state when detail query fails', async () => {
    mockUseRecentFixtures.mockReturnValue({ data: [mockFixture], isLoading: false });
    mockUseFixtureDetail.mockReturnValue({
      events: undefined,
      statistics: undefined,
      isLoading: false,
      isError: true,
    });

    render(createElement(LiveMatchPage), { wrapper: createWrapper() });
    expect(screen.getByText('Failed to load statistics')).toBeInTheDocument();
    expect(screen.getByText('Failed to load events')).toBeInTheDocument();
  });

  it('shows empty fallback when no events available', async () => {
    mockUseRecentFixtures.mockReturnValue({ data: [mockFixture], isLoading: false });
    mockUseFixtureDetail.mockReturnValue({
      events: [],
      statistics: [],
      isLoading: false,
      isError: false,
    });

    render(createElement(LiveMatchPage), { wrapper: createWrapper() });
    expect(screen.getByText('No events available')).toBeInTheDocument();
    expect(screen.getByText('No statistics available')).toBeInTheDocument();
  });
});
