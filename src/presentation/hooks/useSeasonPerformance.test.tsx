import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSeasonPerformance } from './useSeasonPerformance';

// Mock the JSON import via the module that uses it
vi.mock('@/infrastructure/api/mocks/seasonPerformance.mock.json', () => ({
  default: {
    data: [
      { matchday: 'GW1', goals: 2, goalsAgainst: 1, points: 3 },
      { matchday: 'GW2', goals: 0, goalsAgainst: 0, points: 1 },
      { matchday: 'GW3', goals: 3, goalsAgainst: 2, points: 3 },
    ],
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useSeasonPerformance', () => {
  it('returns season performance data after loading', async () => {
    const { result } = renderHook(() => useSeasonPerformance(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(3);
  });

  it('starts in loading state', () => {
    const { result } = renderHook(() => useSeasonPerformance(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });

  it('returns correct matchday data', async () => {
    const { result } = renderHook(() => useSeasonPerformance(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].matchday).toBe('GW1');
    expect(result.current.data?.[0].goals).toBe(2);
    expect(result.current.data?.[0].goalsAgainst).toBe(1);
    expect(result.current.data?.[0].points).toBe(3);
  });
});
