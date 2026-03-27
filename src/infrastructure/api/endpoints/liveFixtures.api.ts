import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import liveFixturesMock from '../mocks/liveFixtures.mock.json';
import type { Fixture } from '@/shared/types/football';

export async function fetchLiveFixtures(teamId = env.teamId): Promise<Fixture[]> {
  if (env.useMockData) return liveFixturesMock.response as unknown as Fixture[];
  const { data } = await footballApiClient.get('/fixtures', {
    params: { live: 'all', team: teamId },
  });
  return data.response as Fixture[];
}
