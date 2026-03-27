import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTeamStats } from './useTeamStats';

vi.mock('@/infrastructure/api/endpoints/teams.api', () => ({
  fetchTeamStatistics: vi.fn().mockResolvedValue({
    team: { id: 33, name: 'Manchester United', shortName: 'MUN', logo: '' },
    league: { id: 39, name: 'Premier League', season: 2024 },
    form: 'WDLWW',
    fixtures: {
      played: { home: 16, away: 16, total: 32 },
      wins: { home: 7, away: 3, total: 10 },
      draws: { home: 4, away: 4, total: 8 },
      loses: { home: 5, away: 9, total: 14 },
    },
    goals: {
      for: {
        total: { home: 22, away: 16, total: 38 },
        average: { home: '1.4', away: '1.0', total: '1.2' },
      },
      against: {
        total: { home: 20, away: 23, total: 43 },
        average: { home: '1.3', away: '1.4', total: '1.3' },
      },
    },
    cleanSheets: { home: 5, away: 3, total: 8 },
    failedToScore: { home: 3, away: 5, total: 8 },
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useTeamStats', () => {
  it('returns team statistics after loading', async () => {
    const { result } = renderHook(() => useTeamStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.team.name).toBe('Manchester United');
  });

  it('starts in loading state', () => {
    const { result } = renderHook(() => useTeamStats(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });

  it('returns correct goals for total', async () => {
    const { result } = renderHook(() => useTeamStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.goals.for.total.total).toBe(38);
  });

  it('returns correct form string', async () => {
    const { result } = renderHook(() => useTeamStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.form).toBe('WDLWW');
  });
});
