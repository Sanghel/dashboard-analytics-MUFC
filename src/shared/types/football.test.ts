import { describe, it, expectTypeOf } from 'vitest';
import type { FixtureEvent, FixtureStat, FixtureStatTeam } from './football';

describe('FixtureEvent type', () => {
  it('has required fields', () => {
    expectTypeOf<FixtureEvent>().toHaveProperty('time');
    expectTypeOf<FixtureEvent>().toHaveProperty('team');
    expectTypeOf<FixtureEvent>().toHaveProperty('player');
    expectTypeOf<FixtureEvent>().toHaveProperty('type');
    expectTypeOf<FixtureEvent>().toHaveProperty('detail');
  });
});

describe('FixtureStat type', () => {
  it('has type and value', () => {
    expectTypeOf<FixtureStat>().toHaveProperty('type');
    expectTypeOf<FixtureStat>().toHaveProperty('value');
  });
});

describe('FixtureStatTeam type', () => {
  it('has team and statistics', () => {
    expectTypeOf<FixtureStatTeam>().toHaveProperty('team');
    expectTypeOf<FixtureStatTeam>().toHaveProperty('statistics');
  });
});
