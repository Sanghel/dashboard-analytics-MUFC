import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StandingsPage } from './StandingsPage';
import type { Standing } from '@/shared/types/football';

const mockStanding: Standing = {
  rank: 1,
  team: { id: 40, name: 'Liverpool', shortName: 'LIV', logo: '' },
  points: 70,
  goalsDiff: 35,
  group: '',
  form: 'WWWWW',
  status: '',
  description: '',
  all: { played: 33, win: 22, draw: 4, lose: 7, goals: { for: 70, against: 35 } },
  home: { played: 17, win: 12, draw: 2, lose: 3, goals: { for: 38, against: 18 } },
  away: { played: 16, win: 10, draw: 2, lose: 4, goals: { for: 32, against: 17 } },
  update: '2025-01-01',
};

const mockMUStanding: Standing = {
  ...mockStanding,
  rank: 3,
  team: { id: 33, name: 'Manchester United', shortName: 'MUN', logo: '' },
  points: 52,
};

const mockSetSelectedLeagueId = vi.fn();

let standingsResult = {
  data: [mockStanding, mockMUStanding] as Standing[] | undefined,
  isLoading: false,
  error: null as Error | null,
};

let selectedLeagueId = 39;

vi.mock('@/presentation/hooks/useStandings', () => ({
  useStandings: () => ({ ...standingsResult, refetch: vi.fn() }),
}));

vi.mock('@/presentation/store/appStore', () => ({
  useAppStore: () => ({
    selectedLeagueId,
    selectedSeason: 2024,
    sidebarOpen: true,
    setSelectedLeagueId: mockSetSelectedLeagueId,
    setSidebarOpen: vi.fn(),
    setSelectedSeason: vi.fn(),
  }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('StandingsPage', () => {
  beforeEach(() => {
    mockSetSelectedLeagueId.mockClear();
    standingsResult = { data: [mockStanding, mockMUStanding], isLoading: false, error: null };
    selectedLeagueId = 39;
  });

  it('renders Standings heading', () => {
    renderWithProviders(<StandingsPage />);
    expect(screen.getByText('Standings')).toBeInTheDocument();
  });

  it('renders Premier League button', () => {
    renderWithProviders(<StandingsPage />);
    expect(screen.getByText('Premier League')).toBeInTheDocument();
  });

  it('renders UEFA Champions League button', () => {
    renderWithProviders(<StandingsPage />);
    expect(screen.getByText('UEFA Champions League')).toBeInTheDocument();
  });

  it('renders UEFA Europa League button', () => {
    renderWithProviders(<StandingsPage />);
    expect(screen.getByText('UEFA Europa League')).toBeInTheDocument();
  });

  it('renders standings table when data is available', () => {
    renderWithProviders(<StandingsPage />);
    expect(screen.getByText('Liverpool')).toBeInTheDocument();
    expect(screen.getByText('Manchester United')).toBeInTheDocument();
  });

  it('calls setSelectedLeagueId when Champions League button is clicked', () => {
    renderWithProviders(<StandingsPage />);
    fireEvent.click(screen.getByText('UEFA Champions League'));
    expect(mockSetSelectedLeagueId).toHaveBeenCalledWith(2);
  });

  it('calls setSelectedLeagueId with 3 for UEFA Europa League', () => {
    renderWithProviders(<StandingsPage />);
    fireEvent.click(screen.getByText('UEFA Europa League'));
    expect(mockSetSelectedLeagueId).toHaveBeenCalledWith(3);
  });

  it('calls setSelectedLeagueId with 39 for Premier League', () => {
    renderWithProviders(<StandingsPage />);
    fireEvent.click(screen.getByText('Premier League'));
    expect(mockSetSelectedLeagueId).toHaveBeenCalledWith(39);
  });

  it('shows current league table subtitle', () => {
    renderWithProviders(<StandingsPage />);
    expect(screen.getByText('Current league table')).toBeInTheDocument();
  });

  it('shows LoadingPage when isLoading is true', () => {
    standingsResult = { data: undefined, isLoading: true, error: null };
    renderWithProviders(<StandingsPage />);
    expect(screen.queryByText('Liverpool')).not.toBeInTheDocument();
  });

  it('shows ErrorMessage when error is present', () => {
    standingsResult = { data: undefined, isLoading: false, error: new Error('network error') };
    renderWithProviders(<StandingsPage />);
    expect(screen.getByText('Failed to load standings')).toBeInTheDocument();
  });

  it('shows EmptyState when standings is empty array', () => {
    standingsResult = { data: [], isLoading: false, error: null };
    renderWithProviders(<StandingsPage />);
    expect(screen.getByText('No standings available')).toBeInTheDocument();
  });
});
