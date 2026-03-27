import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import fixturesMock from '../mocks/fixtures.mock.json';
import type { Fixture } from '@/shared/types/football';

function mapFixture(item: Record<string, unknown>): Fixture {
  const f = item.fixture as Record<string, unknown>;
  const teams = item.teams as Record<string, unknown>;
  const goals = item.goals as Record<string, unknown>;
  const league = item.league as Record<string, unknown>;
  const venue = item.venue as Record<string, unknown>;
  return {
    id: f.id as number,
    date: f.date as string,
    timestamp: f.timestamp as number,
    status: f.status as Fixture['status'],
    homeTeam: teams.home as unknown as Fixture['homeTeam'],
    awayTeam: teams.away as unknown as Fixture['awayTeam'],
    homeGoals: goals.home as number | null,
    awayGoals: goals.away as number | null,
    league: league as Fixture['league'],
    venue: venue as Fixture['venue'],
  };
}

export async function fetchFixtures(teamId = env.teamId): Promise<Fixture[]> {
  if (env.useMockData) {
    return fixturesMock.response.map(mapFixture);
  }
  const { data } = await footballApiClient.get('/fixtures', {
    params: { team: teamId, season: 2024 },
  });
  return (data.response as Record<string, unknown>[]).map(mapFixture);
}
