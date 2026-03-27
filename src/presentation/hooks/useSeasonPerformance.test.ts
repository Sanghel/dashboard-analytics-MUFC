import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { computePerformance, useSeasonPerformance } from './useSeasonPerformance';
import * as fixturesHook from './useFixtures';
import type { Fixture } from '@/shared/types/football';

vi.mock('./useFixtures');

function makeFixture(
  id: number,
  homeId: number,
  awayId: number,
  homeGoals: number,
  awayGoals: number,
  timestamp: number,
  statusShort = 'FT'
): Fixture {
  return {
    id,
    date: new Date(timestamp * 1000).toISOString(),
    timestamp,
    status: { long: 'Match Finished', short: statusShort, elapsed: 90 },
    homeTeam: {
      id: homeId,
      name: homeId === 33 ? 'Manchester United' : 'Opponent',
      shortName: '',
      logo: '',
    },
    awayTeam: {
      id: awayId,
      name: awayId === 33 ? 'Manchester United' : 'Opponent',
      shortName: '',
      logo: '',
    },
    homeGoals,
    awayGoals,
    league: { id: 39, name: 'Premier League', logo: '', round: 'Round 1' },
    venue: { name: '', city: '' },
  };
}

describe('computePerformance', () => {
  it('returns empty array for empty input', () => {
    expect(computePerformance([])).toEqual([]);
  });

  it('computes 3 points for a MU home win', () => {
    const result = computePerformance([makeFixture(1, 33, 40, 2, 0, 1000)]);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ matchday: 'GW1', goals: 2, goalsAgainst: 0, points: 3 });
  });

  it('computes 1 point for a draw (MU away)', () => {
    const result = computePerformance([makeFixture(2, 40, 33, 1, 1, 1000)]);
    expect(result[0]).toEqual({ matchday: 'GW1', goals: 1, goalsAgainst: 1, points: 1 });
  });

  it('computes 0 points for an away loss', () => {
    const result = computePerformance([makeFixture(3, 40, 33, 3, 1, 1000)]);
    expect(result[0]).toEqual({ matchday: 'GW1', goals: 1, goalsAgainst: 3, points: 0 });
  });

  it('excludes non-finished matches', () => {
    const fixtures = [
      makeFixture(1, 33, 40, 2, 0, 1000), // FT - include
      makeFixture(2, 33, 50, 0, 0, 2000, 'NS'), // Not Started - exclude
      makeFixture(3, 33, 60, 1, 1, 3000, '1H'), // In Progress - exclude
    ];
    expect(computePerformance(fixtures)).toHaveLength(1);
  });

  it('excludes fixtures not involving MU (team 33)', () => {
    const fixtures = [
      makeFixture(1, 33, 40, 2, 0, 1000), // MU vs opponent - include
      makeFixture(2, 50, 60, 1, 0, 2000), // other match - exclude
    ];
    expect(computePerformance(fixtures)).toHaveLength(1);
  });

  it('sorts by timestamp ascending and labels GW1, GW2, GW3', () => {
    const fixtures = [
      makeFixture(3, 33, 60, 1, 0, 3000), // latest
      makeFixture(1, 33, 40, 2, 0, 1000), // earliest
      makeFixture(2, 33, 50, 0, 1, 2000), // middle
    ];
    const result = computePerformance(fixtures);
    expect(result[0].matchday).toBe('GW1');
    expect(result[1].matchday).toBe('GW2');
    expect(result[2].matchday).toBe('GW3');
    expect(result[0].goals).toBe(2); // earliest match first
  });
});

describe('useSeasonPerformance', () => {
  it('returns empty array while fixtures are loading', () => {
    vi.mocked(fixturesHook.useFixtures).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof fixturesHook.useFixtures>);

    const { result } = renderHook(() => useSeasonPerformance());
    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('returns computed performance when fixtures are loaded', () => {
    vi.mocked(fixturesHook.useFixtures).mockReturnValue({
      data: [makeFixture(1, 33, 40, 3, 0, 1000)],
      isLoading: false,
    } as ReturnType<typeof fixturesHook.useFixtures>);

    const { result } = renderHook(() => useSeasonPerformance());
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].points).toBe(3);
    expect(result.current.isLoading).toBe(false);
  });
});
