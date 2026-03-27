import { describe, it, expectTypeOf } from 'vitest';
import type { FixtureEvent, FixtureStat, FixtureStatTeam } from './football';

describe('FixtureEvent type', () => {
  it('accepts a valid goal event without assist', () => {
    const event: FixtureEvent = {
      time: { elapsed: 45, extra: null },
      team: { id: 33, name: 'Man Utd', logo: '' },
      player: { id: 19185, name: 'M. Rashford' },
      type: 'Goal',
      detail: 'Normal Goal',
      comments: null,
    };
    expectTypeOf(event).toMatchTypeOf<FixtureEvent>();
  });

  it('accepts unknown event types (API extensibility)', () => {
    const event: FixtureEvent = {
      time: { elapsed: 10, extra: null },
      team: { id: 33, name: 'Man Utd', logo: '' },
      player: { id: null, name: null },
      type: 'UnknownFutureType',
      detail: 'Some detail',
      comments: null,
    };
    expectTypeOf(event).toMatchTypeOf<FixtureEvent>();
  });
});

describe('FixtureStat type', () => {
  it('accepts null value', () => {
    const stat: FixtureStat = { type: 'Fouls', value: null };
    expectTypeOf(stat.value).toMatchTypeOf<number | string | boolean | null>();
  });

  it('accepts boolean value (API returns false for zero-occurrence stats)', () => {
    const stat: FixtureStat = { type: 'Penalties Scored', value: false };
    expectTypeOf(stat.value).toMatchTypeOf<number | string | boolean | null>();
  });
});

describe('FixtureStatTeam type', () => {
  it('has team and statistics array', () => {
    expectTypeOf<FixtureStatTeam>().toHaveProperty('team');
    expectTypeOf<FixtureStatTeam>().toHaveProperty('statistics');
  });
});
