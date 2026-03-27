import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFixtures, useUpcomingFixtures, useRecentFixtures } from './useFixtures';
import type { Fixture } from '@/shared/types/football';

vi.mock('@/infrastructure/api/endpoints/fixtures.api', () => ({
  fetchFixtures: vi.fn().mockResolvedValue([
    {
      id: 1,
      date: '2025-03-10T15:00:00+00:00',
      timestamp: 1741618800,
      status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
      homeTeam: { id: 33, name: 'Manchester United', logo: '', shortName: 'MUN' },
      awayTeam: { id: 48, name: 'West Ham', logo: '', shortName: 'WHU' },
      homeGoals: 2,
      awayGoals: 1,
      league: { id: 39, name: 'Premier League', logo: '', round: 'Regular Season - 28' },
      venue: { name: 'Old Trafford', city: 'Manchester' },
    },
    {
      id: 2,
      date: '2099-05-01T15:00:00+00:00',
      timestamp: 4082572800,
      status: { long: 'Not Started', short: 'NS', elapsed: null },
      homeTeam: { id: 33, name: 'Manchester United', logo: '', shortName: 'MUN' },
      awayTeam: { id: 40, name: 'Liverpool', logo: '', shortName: 'LIV' },
      homeGoals: null,
      awayGoals: null,
      league: { id: 39, name: 'Premier League', logo: '', round: 'Regular Season - 35' },
      venue: { name: 'Old Trafford', city: 'Manchester' },
    },
  ]),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useFixtures', () => {
  it('returns fixture data after loading', async () => {
    const { result } = renderHook(() => useFixtures(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('starts in loading state', () => {
    const { result } = renderHook(() => useFixtures(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });

  it('returns data with correct fixture ids', async () => {
    const { result } = renderHook(() => useFixtures(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const ids = result.current.data?.map((f: Fixture) => f.id);
    expect(ids).toContain(1);
    expect(ids).toContain(2);
  });
});

describe('useUpcomingFixtures', () => {
  it('returns only fixtures with timestamp > nowSeconds', async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const { result } = renderHook(() => useUpcomingFixtures(nowSeconds), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].id).toBe(2);
  });

  it('returns empty array when all fixtures are in the past', async () => {
    const futureSeconds = 9999999999;
    const { result } = renderHook(() => useUpcomingFixtures(futureSeconds), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(0);
  });
});

describe('useRecentFixtures', () => {
  it('returns only fixtures with timestamp <= nowSeconds', async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const { result } = renderHook(() => useRecentFixtures(nowSeconds), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].id).toBe(1);
  });

  it('returns all fixtures when nowSeconds is in the far future', async () => {
    const futureSeconds = 9999999999;
    const { result } = renderHook(() => useRecentFixtures(futureSeconds), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });
});
