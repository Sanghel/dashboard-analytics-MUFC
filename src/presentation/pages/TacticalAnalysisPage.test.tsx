import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TacticalAnalysisPage } from './TacticalAnalysisPage';
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
        goals: { total: null, conceded: 35, assists: null, saves: 90 },
        shots: { total: null, on: null },
        passes: { total: 500, key: 2, accuracy: '75' },
        tackles: { total: null, blocks: 5, interceptions: null },
        cards: { yellow: 1, yellowred: 0, red: 0 },
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
  usePlayerStats: () => ({ ...playerResult }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('TacticalAnalysisPage', () => {
  beforeEach(() => {
    playerResult = { data: mockPlayers, isLoading: false, error: null };
  });

  it('renders Tactical Analysis heading', () => {
    renderWithProviders(<TacticalAnalysisPage />);
    expect(screen.getByText('Tactical Analysis')).toBeInTheDocument();
  });

  it('renders player list', () => {
    renderWithProviders(<TacticalAnalysisPage />);
    expect(screen.getAllByText('Marcus Rashford').length).toBeGreaterThan(0);
    expect(screen.getByText('Bruno Fernandes')).toBeInTheDocument();
  });

  it('renders Select Player section header', () => {
    renderWithProviders(<TacticalAnalysisPage />);
    expect(screen.getByText('Select Player')).toBeInTheDocument();
  });

  it('renders radar chart section with first player by default', () => {
    renderWithProviders(<TacticalAnalysisPage />);
    const rashfordElements = screen.getAllByText('Marcus Rashford');
    expect(rashfordElements.length).toBeGreaterThan(0);
  });

  it('renders player stats section', () => {
    renderWithProviders(<TacticalAnalysisPage />);
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Assists')).toBeInTheDocument();
    expect(screen.getByText('Apps')).toBeInTheDocument();
  });

  it('switches to selected player when clicked', () => {
    renderWithProviders(<TacticalAnalysisPage />);
    fireEvent.click(screen.getByText('Bruno Fernandes'));
    expect(screen.getByText(/Portugal/)).toBeInTheDocument();
  });

  it('renders subtitle text', () => {
    renderWithProviders(<TacticalAnalysisPage />);
    expect(screen.getByText('Player performance radar and statistics')).toBeInTheDocument();
  });

  it('shows LoadingPage when loading', () => {
    playerResult = { data: undefined, isLoading: true, error: null };
    renderWithProviders(<TacticalAnalysisPage />);
    expect(screen.queryByText('Tactical Analysis')).not.toBeInTheDocument();
  });

  it('shows fallback when no players are available', () => {
    playerResult = { data: [], isLoading: false, error: null };
    renderWithProviders(<TacticalAnalysisPage />);
    expect(screen.getByText('Select a player')).toBeInTheDocument();
  });

  it('renders player nationality when first player selected by default', () => {
    renderWithProviders(<TacticalAnalysisPage />);
    expect(screen.getByText(/England/)).toBeInTheDocument();
  });

  it('renders all player names in selector list', () => {
    renderWithProviders(<TacticalAnalysisPage />);
    expect(screen.getByText('Andre Onana')).toBeInTheDocument();
  });

  it('renders player with null stats gracefully', () => {
    renderWithProviders(<TacticalAnalysisPage />);
    fireEvent.click(screen.getByText('Andre Onana'));
    expect(screen.getByText(/Cameroon/)).toBeInTheDocument();
  });
});
