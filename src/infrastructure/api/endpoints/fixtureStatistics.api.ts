import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import fixtureStatsMock from '../mocks/fixtureStatistics.mock.json';
import type { FixtureStatTeam } from '@/shared/types/football';

export async function fetchFixtureStatistics(fixtureId: number): Promise<FixtureStatTeam[]> {
  if (env.useMockData) {
    return fixtureStatsMock.response as unknown as FixtureStatTeam[];
  }
  const { data } = await footballApiClient.get('/fixtures/statistics', {
    params: { fixture: fixtureId },
  });
  return data.response as FixtureStatTeam[];
}
