import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LiveMatchPage } from './LiveMatchPage';
import type { Fixture } from '@/shared/types/football';

const mockFixture: Fixture = {
  id: 1,
  date: '2025-03-22T15:00:00+00:00',
  timestamp: 1742655600,
  status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
  homeTeam: { id: 33, name: 'Manchester United', shortName: 'MUN', logo: '' },
  awayTeam: { id: 40, name: 'Liverpool', shortName: 'LIV', logo: '' },
  homeGoals: 2,
  awayGoals: 1,
  league: { id: 39, name: 'Premier League', logo: '', round: 'Regular Season - 30' },
  venue: { name: 'Old Trafford', city: 'Manchester' },
};

let recentResult = {
  data: [mockFixture] as Fixture[] | undefined,
  isLoading: false,
};

vi.mock('@/presentation/hooks/useFixtures', () => ({
  useRecentFixtures: () => ({ ...recentResult }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('LiveMatchPage', () => {
  beforeEach(() => {
    recentResult = { data: [mockFixture], isLoading: false };
  });

  it('renders Live Match heading', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText('Live Match')).toBeInTheDocument();
  });

  it('renders home team name', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getAllByText('Manchester United').length).toBeGreaterThan(0);
  });

  it('renders away team name', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getAllByText('Liverpool').length).toBeGreaterThan(0);
  });

  it('renders match score', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText('2 - 1')).toBeInTheDocument();
  });

  it('renders Match Statistics section', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText('Match Statistics')).toBeInTheDocument();
  });

  it('renders Match Events section', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText('Match Events')).toBeInTheDocument();
  });

  it('renders match events with player names', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText('Rashford')).toBeInTheDocument();
    expect(screen.getByText('Fernandes')).toBeInTheDocument();
  });

  it('renders match statistics labels', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText('Possession')).toBeInTheDocument();
    expect(screen.getByText('Shots')).toBeInTheDocument();
  });

  it('renders league info', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText(/Premier League/)).toBeInTheDocument();
  });

  it('renders match status badge', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText('Match Finished')).toBeInTheDocument();
  });

  it('shows LoadingPage when loading', () => {
    recentResult = { data: undefined, isLoading: true };
    renderWithProviders(<LiveMatchPage />);
    expect(screen.queryByText('Live Match')).not.toBeInTheDocument();
  });

  it('shows EmptyState when no match data', () => {
    recentResult = { data: [], isLoading: false };
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText('No match data available')).toBeInTheDocument();
  });

  it('renders Home and Away labels', () => {
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Away')).toBeInTheDocument();
  });

  it('renders null goals as dashes', () => {
    recentResult = {
      data: [
        {
          ...mockFixture,
          homeGoals: null,
          awayGoals: null,
          status: { long: 'Not Started', short: 'NS', elapsed: null },
        },
      ],
      isLoading: false,
    };
    renderWithProviders(<LiveMatchPage />);
    expect(screen.getByText('- - -')).toBeInTheDocument();
  });
});
