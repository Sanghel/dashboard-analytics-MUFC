export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
  home: Standing['all'];
  away: Standing['all'];
  update: string;
}

export interface Fixture {
  id: number;
  date: string;
  timestamp: number;
  status: {
    long: string;
    short: string;
    elapsed: number | null;
  };
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number | null;
  awayGoals: number | null;
  league: {
    id: number;
    name: string;
    logo: string;
    round: string;
  };
  venue: {
    name: string;
    city: string;
  };
}

export interface Player {
  id: number;
  name: string;
  age: number;
  nationality: string;
  position: string;
  photo: string;
}

export interface PlayerStats {
  player: Player;
  statistics: Array<{
    games: {
      appearances: number;
      lineups: number;
      minutes: number;
      number: number;
      position: string;
      rating: string;
      captain: boolean;
    };
    goals: {
      total: number | null;
      conceded: number;
      assists: number | null;
      saves: number | null;
    };
    shots: {
      total: number | null;
      on: number | null;
    };
    passes: {
      total: number | null;
      key: number | null;
      accuracy: string;
    };
    tackles: {
      total: number | null;
      blocks: number;
      interceptions: number | null;
    };
    cards: {
      yellow: number;
      yellowred: number;
      red: number;
    };
  }>;
}

export interface TeamStatistics {
  team: Team;
  league: {
    id: number;
    name: string;
    season: number;
  };
  form: string;
  fixtures: {
    played: { home: number; away: number; total: number };
    wins: { home: number; away: number; total: number };
    draws: { home: number; away: number; total: number };
    loses: { home: number; away: number; total: number };
  };
  goals: {
    for: {
      total: { home: number; away: number; total: number };
      average: { home: string; away: string; total: string };
    };
    against: {
      total: { home: number; away: number; total: number };
      average: { home: string; away: string; total: string };
    };
  };
  cleanSheets: { home: number; away: number; total: number };
  failedToScore: { home: number; away: number; total: number };
}

export interface FixtureEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number | null; name: string | null };
  assist?: { id: number | null; name: string | null };
  type: 'Goal' | 'Card' | 'subst' | 'Var' | string;
  detail: string;
  comments: string | null;
}

export interface FixtureStat {
  type: string;
  value: number | string | boolean | null;
}

export interface FixtureStatTeam {
  team: { id: number; name: string; logo: string };
  statistics: FixtureStat[];
}
