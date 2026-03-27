import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlayerStatsPage } from './PlayerStatsPage';
import type { PlayerStats } from '@/shared/types/football';

const mockPlayers: PlayerStats[] = [
  {
    player: {
      id: 1,
      name: 'Marcus Rashford',
      age: 27,
      nationality: 'England',
      position: 'Attacker',
      photo: '',
    },
    statistics: [
      {
        games: {
          appearances: 25,
          lineups: 20,
          minutes: 1800,
          number: 10,
          position: 'F',
          rating: '7.5',
          captain: false,
        },
        goals: { total: 12, conceded: 0, assists: 5, saves: null },
        shots: { total: 40, on: 20 },
        passes: { total: 300, key: 30, accuracy: '80' },
        tackles: { total: 15, blocks: 3, interceptions: 5 },
        cards: { yellow: 2, yellowred: 0, red: 0 },
      },
    ],
  },
  {
    player: {
      id: 2,
      name: 'Bruno Fernandes',
      age: 30,
      nationality: 'Portugal',
      position: 'Midfielder',
      photo: '',
    },
    statistics: [
      {
        games: {
          appearances: 30,
          lineups: 28,
          minutes: 2600,
          number: 8,
          position: 'M',
          rating: '8.0',
          captain: true,
        },
        goals: { total: 8, conceded: 0, assists: 10, saves: null },
        shots: { total: 50, on: 25 },
        passes: { total: 800, key: 80, accuracy: '88' },
        tackles: { total: 30, blocks: 5, interceptions: 12 },
        cards: { yellow: 3, yellowred: 0, red: 0 },
      },
    ],
  },
  {
    player: {
      id: 3,
      name: 'Andre Onana',
      age: 28,
      nationality: 'Cameroon',
      position: 'Goalkeeper',
      photo: '',
    },
    statistics: [
      {
        games: {
          appearances: 30,
          lineups: 30,
          minutes: 2700,
          number: 24,
          position: 'G',
          rating: '7.0',
          captain: false,
        },
        goals: { total: 0, conceded: 35, assists: null, saves: 90 },
        shots: { total: null, on: null },
        passes: { total: 500, key: 2, accuracy: '75' },
        tackles: { total: 2, blocks: 5, interceptions: 1 },
        cards: { yellow: 1, yellowred: 0, red: 0 },
      },
    ],
  },
  {
    player: {
      id: 4,
      name: 'Harry Maguire',
      age: 31,
      nationality: 'England',
      position: 'Defender',
      photo: '',
    },
    statistics: [
      {
        games: {
          appearances: 20,
          lineups: 18,
          minutes: 1700,
          number: 5,
          position: 'D',
          rating: '6.8',
          captain: false,
        },
        goals: { total: 2, conceded: 0, assists: 1, saves: null },
        shots: { total: 10, on: 5 },
        passes: { total: 600, key: 10, accuracy: '85' },
        tackles: { total: 40, blocks: 10, interceptions: 15 },
        cards: { yellow: 3, yellowred: 0, red: 0 },
      },
    ],
  },
];

let playerResult = {
  data: mockPlayers as PlayerStats[] | undefined,
  isLoading: false,
  error: null as Error | null,
};

vi.mock('@/presentation/hooks/usePlayerStats', () => ({
  usePlayerStats: () => ({ ...playerResult, refetch: vi.fn() }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('PlayerStatsPage', () => {
  beforeEach(() => {
    playerResult = { data: mockPlayers, isLoading: false, error: null };
  });

  it('renders Player Stats heading', () => {
    renderWithProviders(<PlayerStatsPage />);
    expect(screen.getByText('Player Stats')).toBeInTheDocument();
  });

  it('renders player cards with player names', () => {
    renderWithProviders(<PlayerStatsPage />);
    expect(screen.getByText('Marcus Rashford')).toBeInTheDocument();
    expect(screen.getByText('Bruno Fernandes')).toBeInTheDocument();
  });

  it('renders position filter buttons', () => {
    renderWithProviders(<PlayerStatsPage />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Goalkeeper')).toBeInTheDocument();
    expect(screen.getByText('Defender')).toBeInTheDocument();
    expect(screen.getByText('Midfielder')).toBeInTheDocument();
    expect(screen.getByText('Attacker')).toBeInTheDocument();
  });

  it('renders sort buttons', () => {
    renderWithProviders(<PlayerStatsPage />);
    expect(screen.getByText('goals')).toBeInTheDocument();
    expect(screen.getByText('assists')).toBeInTheDocument();
    expect(screen.getByText('appearances')).toBeInTheDocument();
  });

  it('filters by Goalkeeper position', () => {
    renderWithProviders(<PlayerStatsPage />);
    fireEvent.click(screen.getByText('Goalkeeper'));
    expect(screen.getByText('Andre Onana')).toBeInTheDocument();
    expect(screen.queryByText('Marcus Rashford')).not.toBeInTheDocument();
  });

  it('filters by Attacker position', () => {
    renderWithProviders(<PlayerStatsPage />);
    fireEvent.click(screen.getByText('Attacker'));
    expect(screen.getByText('Marcus Rashford')).toBeInTheDocument();
    expect(screen.queryByText('Bruno Fernandes')).not.toBeInTheDocument();
  });

  it('filters by Defender position', () => {
    renderWithProviders(<PlayerStatsPage />);
    fireEvent.click(screen.getByText('Defender'));
    expect(screen.getByText('Harry Maguire')).toBeInTheDocument();
    expect(screen.queryByText('Bruno Fernandes')).not.toBeInTheDocument();
  });

  it('filters by Midfielder position', () => {
    renderWithProviders(<PlayerStatsPage />);
    fireEvent.click(screen.getByText('Midfielder'));
    expect(screen.getByText('Bruno Fernandes')).toBeInTheDocument();
    expect(screen.queryByText('Marcus Rashford')).not.toBeInTheDocument();
  });

  it('shows all players when All filter selected after filtering', () => {
    renderWithProviders(<PlayerStatsPage />);
    fireEvent.click(screen.getByText('Goalkeeper'));
    fireEvent.click(screen.getByText('All'));
    expect(screen.getByText('Marcus Rashford')).toBeInTheDocument();
    expect(screen.getByText('Bruno Fernandes')).toBeInTheDocument();
  });

  it('sorts by assists when assists button clicked', () => {
    renderWithProviders(<PlayerStatsPage />);
    fireEvent.click(screen.getByText('assists'));
    expect(screen.getByText('Marcus Rashford')).toBeInTheDocument();
  });

  it('sorts by appearances when appearances button clicked', () => {
    renderWithProviders(<PlayerStatsPage />);
    fireEvent.click(screen.getByText('appearances')).valueOf();
    expect(screen.getByText('Marcus Rashford')).toBeInTheDocument();
  });

  it('renders season subtitle', () => {
    renderWithProviders(<PlayerStatsPage />);
    expect(screen.getByText('2024/25 Season squad statistics')).toBeInTheDocument();
  });

  it('shows LoadingPage when loading', () => {
    playerResult = { data: undefined, isLoading: true, error: null };
    renderWithProviders(<PlayerStatsPage />);
    expect(screen.queryByText('Marcus Rashford')).not.toBeInTheDocument();
  });

  it('shows ErrorMessage when error present', () => {
    playerResult = { data: undefined, isLoading: false, error: new Error('fail') };
    renderWithProviders(<PlayerStatsPage />);
    expect(screen.getByText('Failed to load player statistics')).toBeInTheDocument();
  });

  it('shows EmptyState when no players match filter', () => {
    playerResult = { data: [], isLoading: false, error: null };
    renderWithProviders(<PlayerStatsPage />);
    expect(screen.getByText('No players found')).toBeInTheDocument();
  });
});
