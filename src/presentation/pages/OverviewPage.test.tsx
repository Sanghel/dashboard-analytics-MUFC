import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OverviewPage } from './OverviewPage';
import type { TeamStatistics, Fixture, Standing } from '@/shared/types/football';

const mockTeamStats: TeamStatistics = {
  team: { id: 33, name: 'Manchester United', shortName: 'MUN', logo: '' },
  league: { id: 39, name: 'Premier League', season: 2024 },
  form: 'WWDWL',
  fixtures: {
    played: { home: 17, away: 16, total: 33 },
    wins: { home: 10, away: 7, total: 17 },
    draws: { home: 3, away: 3, total: 6 },
    loses: { home: 4, away: 6, total: 10 },
  },
  goals: {
    for: {
      total: { home: 38, away: 29, total: 67 },
      average: { home: '2.2', away: '1.8', total: '2.0' },
    },
    against: {
      total: { home: 21, away: 22, total: 43 },
      average: { home: '1.2', away: '1.4', total: '1.3' },
    },
  },
  cleanSheets: { home: 7, away: 4, total: 11 },
  failedToScore: { home: 2, away: 3, total: 5 },
};

const mockFixture: Fixture = {
  id: 1,
  date: '2025-05-01T15:00:00+00:00',
  timestamp: 4082572800,
  status: { long: 'Not Started', short: 'NS', elapsed: null },
  homeTeam: { id: 33, name: 'Manchester United', shortName: 'MUN', logo: '' },
  awayTeam: { id: 40, name: 'Liverpool', shortName: 'LIV', logo: '' },
  homeGoals: null,
  awayGoals: null,
  league: { id: 39, name: 'Premier League', logo: '', round: 'Regular Season - 35' },
  venue: { name: 'Old Trafford', city: 'Manchester' },
};

const mockRecentFixture: Fixture = {
  ...mockFixture,
  id: 2,
  timestamp: 1000,
  status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
  homeGoals: 2,
  awayGoals: 1,
};

const mockStanding: Standing = {
  rank: 3,
  team: { id: 33, name: 'Manchester United', shortName: 'MUN', logo: '' },
  points: 52,
  goalsDiff: 24,
  group: '',
  form: 'WWDWL',
  status: '',
  description: '',
  all: { played: 33, win: 17, draw: 6, lose: 10, goals: { for: 67, against: 43 } },
  home: { played: 17, win: 10, draw: 3, lose: 4, goals: { for: 38, against: 21 } },
  away: { played: 16, win: 7, draw: 3, lose: 6, goals: { for: 29, against: 22 } },
  update: '2025-01-01',
};

const mockStandingFirst: Standing = { ...mockStanding, rank: 1 };

const mockPerformance = [
  { matchday: 'GW1', goals: 2, goalsAgainst: 1, points: 3 },
  { matchday: 'GW2', goals: 1, goalsAgainst: 1, points: 1 },
];

// Mutable state to control what each mock returns
let teamStatsResult = {
  data: mockTeamStats as TeamStatistics | undefined,
  isLoading: false,
  error: null as Error | null,
};
let upcomingResult = { data: [mockFixture] as Fixture[] | undefined, isLoading: false };
let recentResult = { data: [mockRecentFixture] as Fixture[] | undefined, isLoading: false };
let perfResult = { data: mockPerformance as typeof mockPerformance | undefined, isLoading: false };
let standingsResult = {
  data: [mockStanding] as Standing[] | undefined,
  isLoading: false,
  error: null,
};

vi.mock('@/presentation/hooks/useTeamStats', () => ({
  useTeamStats: () => ({ ...teamStatsResult, refetch: vi.fn() }),
}));

vi.mock('@/presentation/hooks/useFixtures', () => ({
  useUpcomingFixtures: () => ({ ...upcomingResult }),
  useRecentFixtures: () => ({ ...recentResult }),
}));

vi.mock('@/presentation/hooks/useSeasonPerformance', () => ({
  useSeasonPerformance: () => ({ ...perfResult }),
}));

vi.mock('@/presentation/hooks/useStandings', () => ({
  useStandings: () => ({ ...standingsResult }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('OverviewPage', () => {
  beforeEach(() => {
    // Reset to defaults
    teamStatsResult = { data: mockTeamStats, isLoading: false, error: null };
    upcomingResult = { data: [mockFixture], isLoading: false };
    recentResult = { data: [mockRecentFixture], isLoading: false };
    perfResult = { data: mockPerformance, isLoading: false };
    standingsResult = { data: [mockStanding], isLoading: false, error: null };
  });

  it('renders Season Overview heading', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Season Overview')).toBeInTheDocument();
  });

  it('renders League Position stat card', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('League Position')).toBeInTheDocument();
  });

  it('renders Wins stat card', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Wins')).toBeInTheDocument();
  });

  it('renders Goals Scored stat card', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Goals Scored')).toBeInTheDocument();
  });

  it('renders Goal Difference stat card', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Goal Difference')).toBeInTheDocument();
  });

  it('renders Clean Sheets stat card', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Clean Sheets')).toBeInTheDocument();
  });

  it('renders Season Performance section', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Season Performance')).toBeInTheDocument();
  });

  it('renders Upcoming Matches section', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Upcoming Matches')).toBeInTheDocument();
  });

  it('renders Recent Results section', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Recent Results')).toBeInTheDocument();
  });

  it('renders the goal difference value correctly (+24)', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('+24')).toBeInTheDocument();
  });

  it('renders wins count', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('17')).toBeInTheDocument();
  });

  it('renders clean sheets count', () => {
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('11')).toBeInTheDocument();
  });

  it('shows LoadingPage when statsLoading is true', () => {
    teamStatsResult = { data: undefined, isLoading: true, error: null };
    renderWithProviders(<OverviewPage />);
    expect(screen.queryByText('Season Overview')).not.toBeInTheDocument();
  });

  it('shows ErrorMessage when statsError is present', () => {
    teamStatsResult = { data: undefined, isLoading: false, error: new Error('fail') };
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Failed to load team statistics')).toBeInTheDocument();
  });

  it('shows EmptyState when no upcoming matches', () => {
    upcomingResult = { data: [], isLoading: false };
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('No upcoming matches')).toBeInTheDocument();
  });

  it('shows EmptyState when no recent results', () => {
    recentResult = { data: [], isLoading: false };
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('No recent results')).toBeInTheDocument();
  });

  it('shows loading section for upcoming when upcomingLoading is true', () => {
    upcomingResult = { data: undefined, isLoading: true };
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Upcoming Matches')).toBeInTheDocument();
  });

  it('shows loading section for recent when recentLoading is true', () => {
    recentResult = { data: undefined, isLoading: true };
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('Recent Results')).toBeInTheDocument();
  });

  it('shows 1st position ordinal correctly', () => {
    standingsResult = { data: [mockStandingFirst], isLoading: false, error: null };
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('1st')).toBeInTheDocument();
  });

  it('shows negative goal difference correctly', () => {
    teamStatsResult = {
      data: {
        ...mockTeamStats,
        goals: {
          for: {
            total: { home: 10, away: 5, total: 15 },
            average: { home: '1', away: '0.5', total: '0.75' },
          },
          against: {
            total: { home: 20, away: 10, total: 30 },
            average: { home: '1.5', away: '1', total: '1.25' },
          },
        },
      },
      isLoading: false,
      error: null,
    };
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('-15')).toBeInTheDocument();
  });

  it('renders dash for league position when MU not found in standings', () => {
    standingsResult = { data: [], isLoading: false, error: null };
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('hides season performance chart when loading', () => {
    perfResult = { data: undefined, isLoading: true };
    renderWithProviders(<OverviewPage />);
    expect(screen.queryByText('Season Performance')).not.toBeInTheDocument();
  });

  it('renders 3rd position ordinal correctly', () => {
    standingsResult = { data: [{ ...mockStanding, rank: 3 }], isLoading: false, error: null };
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('3rd')).toBeInTheDocument();
  });

  it('renders 2nd position ordinal correctly', () => {
    standingsResult = { data: [{ ...mockStanding, rank: 2 }], isLoading: false, error: null };
    renderWithProviders(<OverviewPage />);
    expect(screen.getByText('2nd')).toBeInTheDocument();
  });
});
