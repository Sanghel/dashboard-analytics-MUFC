import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import standingsMock from '../mocks/standings.mock.json';
import type { Standing } from '@/shared/types/football';

export async function fetchStandings(leagueId = 39, season = 2024): Promise<Standing[]> {
  if (env.useMockData) {
    return standingsMock.response[0].league.standings[0] as unknown as Standing[];
  }
  const { data } = await footballApiClient.get('/standings', {
    params: { league: leagueId, season },
  });
  return data.response[0].league.standings[0] as Standing[];
}
