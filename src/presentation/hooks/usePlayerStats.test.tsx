import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePlayerStats } from './usePlayerStats';

vi.mock('@/infrastructure/api/endpoints/players.api', () => ({
  fetchPlayers: vi.fn().mockResolvedValue([
    {
      player: {
        id: 276,
        name: 'Marcus Rashford',
        age: 27,
        nationality: 'England',
        position: 'Attacker',
        photo: '',
      },
      statistics: [
        {
          games: {
            appearances: 30,
            lineups: 28,
            minutes: 2400,
            number: 10,
            position: 'Attacker',
            rating: '7.5',
            captain: false,
          },
          goals: { total: 12, conceded: 0, assists: 5, saves: null },
          shots: { total: 55, on: 28 },
          passes: { total: 600, key: 40, accuracy: '78' },
          tackles: { total: 20, blocks: 3, interceptions: 10 },
          cards: { yellow: 2, yellowred: 0, red: 0 },
        },
      ],
    },
  ]),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('usePlayerStats', () => {
  it('returns player data after loading', async () => {
    const { result } = renderHook(() => usePlayerStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].player.name).toBe('Marcus Rashford');
  });

  it('starts in loading state', () => {
    const { result } = renderHook(() => usePlayerStats(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });

  it('returns correct goal count', async () => {
    const { result } = renderHook(() => usePlayerStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].statistics[0].goals.total).toBe(12);
  });
});
