import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStandings } from './useStandings';

vi.mock('@/infrastructure/api/endpoints/standings.api', () => ({
  fetchStandings: vi.fn().mockResolvedValue([
    {
      rank: 1,
      team: { id: 50, name: 'Manchester City', shortName: 'MCI', logo: '' },
      points: 72,
      goalsDiff: 40,
      group: 'Premier League',
      form: 'WWWDW',
      status: 'same',
      description: '',
      all: { played: 32, win: 22, draw: 6, lose: 4, goals: { for: 70, against: 30 } },
      home: { played: 16, win: 12, draw: 2, lose: 2, goals: { for: 38, against: 15 } },
      away: { played: 16, win: 10, draw: 4, lose: 2, goals: { for: 32, against: 15 } },
      update: '2025-03-22T00:00:00+00:00',
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

describe('useStandings', () => {
  it('returns standings data after loading', async () => {
    const { result } = renderHook(() => useStandings(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].team.name).toBe('Manchester City');
  });

  it('starts in loading state', () => {
    const { result } = renderHook(() => useStandings(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });

  it('returns correct points', async () => {
    const { result } = renderHook(() => useStandings(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].points).toBe(72);
  });
});
