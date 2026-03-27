import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import fixtureEventsMock from '../mocks/fixtureEvents.mock.json';
import type { FixtureEvent } from '@/shared/types/football';

export async function fetchFixtureEvents(fixtureId: number): Promise<FixtureEvent[]> {
  if (env.useMockData) {
    return fixtureEventsMock.response as unknown as FixtureEvent[];
  }
  const { data } = await footballApiClient.get('/fixtures/events', {
    params: { fixture: fixtureId },
  });
  return data.response as FixtureEvent[];
}
