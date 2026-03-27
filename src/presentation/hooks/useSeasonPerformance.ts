import { useMemo } from 'react';
import { useFixtures } from '@/presentation/hooks/useFixtures';
import type { Fixture } from '@/shared/types/football';

const MU_TEAM_ID = 33;

export interface PerformanceDataPoint {
  matchday: string;
  goals: number;
  goalsAgainst: number;
  points: number;
}

export function computePerformance(fixtures: Fixture[]): PerformanceDataPoint[] {
  return fixtures
    .filter(
      (f) =>
        f.status.short === 'FT' && (f.homeTeam.id === MU_TEAM_ID || f.awayTeam.id === MU_TEAM_ID)
    )
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((f, index) => {
      const isHome = f.homeTeam.id === MU_TEAM_ID;
      const goals = isHome ? (f.homeGoals ?? 0) : (f.awayGoals ?? 0);
      const goalsAgainst = isHome ? (f.awayGoals ?? 0) : (f.homeGoals ?? 0);
      let points = 0;
      if (goals > goalsAgainst) points = 3;
      else if (goals === goalsAgainst) points = 1;

      return {
        matchday: `GW${index + 1}`,
        goals,
        goalsAgainst,
        points,
      };
    });
}

export function useSeasonPerformance() {
  const { data: fixtures, isLoading } = useFixtures();

  const data = useMemo(() => {
    if (!fixtures) return [];
    return computePerformance(fixtures);
  }, [fixtures]);

  return { data, isLoading };
}
