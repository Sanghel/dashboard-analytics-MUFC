import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import teamsMock from '../mocks/teams.mock.json';
import teamStatsMock from '../mocks/teamStats.mock.json';
import type { Team, TeamStatistics } from '@/shared/types/football';

export async function fetchTeamInfo(teamId = env.teamId): Promise<Team> {
  if (env.useMockData) {
    return teamsMock.response[0].team as unknown as Team;
  }
  const { data } = await footballApiClient.get('/teams', { params: { id: teamId } });
  return data.response[0].team as Team;
}

export async function fetchTeamStatistics(
  teamId = env.teamId,
  leagueId = 39,
  season = 2024
): Promise<TeamStatistics> {
  if (env.useMockData) {
    return teamStatsMock.response as TeamStatistics;
  }
  const { data } = await footballApiClient.get('/teams/statistics', {
    params: { team: teamId, league: leagueId, season },
  });
  return data.response as TeamStatistics;
}
