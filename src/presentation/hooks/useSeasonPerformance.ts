import { useQuery } from '@tanstack/react-query';
import seasonMock from '@/infrastructure/api/mocks/seasonPerformance.mock.json';

interface PerformanceDataPoint {
  matchday: string;
  goals: number;
  goalsAgainst: number;
  points: number;
}

async function fetchSeasonPerformance(): Promise<PerformanceDataPoint[]> {
  // Always use mock data for season performance chart (computed data)
  return seasonMock.data;
}

export function useSeasonPerformance() {
  return useQuery({
    queryKey: ['seasonPerformance'],
    queryFn: fetchSeasonPerformance,
    staleTime: Infinity,
  });
}
