import { render, screen } from '@testing-library/react';
import { MatchCard } from './MatchCard';
import type { Fixture } from '@/shared/types/football';

const mockFinishedFixture: Fixture = {
  id: 1,
  date: '2025-03-22T15:00:00+00:00',
  timestamp: 1742655600,
  status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
  homeTeam: { id: 33, name: 'Manchester United', logo: '', shortName: 'MUN' },
  awayTeam: { id: 48, name: 'West Ham', logo: '', shortName: 'WHU' },
  homeGoals: 3,
  awayGoals: 1,
  league: { id: 39, name: 'Premier League', logo: '', round: 'Regular Season - 30' },
  venue: { name: 'Old Trafford', city: 'Manchester' },
};

const mockUpcomingFixture: Fixture = {
  id: 2,
  date: '2099-05-01T15:00:00+00:00',
  timestamp: 4082572800,
  status: { long: 'Not Started', short: 'NS', elapsed: null },
  homeTeam: { id: 33, name: 'Manchester United', logo: '', shortName: 'MUN' },
  awayTeam: { id: 40, name: 'Liverpool', logo: '', shortName: 'LIV' },
  homeGoals: null,
  awayGoals: null,
  league: { id: 39, name: 'Premier League', logo: '', round: 'Regular Season - 35' },
  venue: { name: 'Old Trafford', city: 'Manchester' },
};

const mockLiveFixture: Fixture = {
  id: 3,
  date: '2025-03-22T15:00:00+00:00',
  timestamp: 1742655600,
  status: { long: 'First Half', short: '1H', elapsed: 35 },
  homeTeam: { id: 33, name: 'Manchester United', logo: '', shortName: 'MUN' },
  awayTeam: { id: 49, name: 'Chelsea', logo: '', shortName: 'CHE' },
  homeGoals: 1,
  awayGoals: 0,
  league: { id: 39, name: 'Premier League', logo: '', round: 'Regular Season - 30' },
  venue: { name: 'Old Trafford', city: 'Manchester' },
};

const mockDrawFixture: Fixture = {
  ...mockFinishedFixture,
  id: 4,
  homeGoals: 2,
  awayGoals: 2,
  homeTeam: { id: 48, name: 'West Ham', logo: '', shortName: 'WHU' },
  awayTeam: { id: 33, name: 'Manchester United', logo: '', shortName: 'MUN' },
};

const mockLossFixture: Fixture = {
  ...mockFinishedFixture,
  id: 5,
  homeGoals: 3,
  awayGoals: 0,
  homeTeam: { id: 48, name: 'West Ham', logo: '', shortName: 'WHU' },
  awayTeam: { id: 33, name: 'Manchester United', logo: '', shortName: 'MUN' },
};

describe('MatchCard', () => {
  it('renders home and away team names', () => {
    render(<MatchCard fixture={mockFinishedFixture} />);
    expect(screen.getByText('Manchester United')).toBeInTheDocument();
    expect(screen.getByText('West Ham')).toBeInTheDocument();
  });

  it('renders score when match is finished (status FT)', () => {
    render(<MatchCard fixture={mockFinishedFixture} />);
    expect(screen.getByText('3 - 1')).toBeInTheDocument();
  });

  it('renders clock icon area (no score) when match not started (status NS)', () => {
    render(<MatchCard fixture={mockUpcomingFixture} />);
    // Score should not show for upcoming
    expect(screen.queryByText(/\d+ - \d+/)).not.toBeInTheDocument();
  });

  it('renders LIVE badge when status is 1H', () => {
    render(<MatchCard fixture={mockLiveFixture} />);
    expect(screen.getByText(/LIVE/)).toBeInTheDocument();
  });

  it('shows W badge when MU wins as home team', () => {
    render(<MatchCard fixture={mockFinishedFixture} muTeamId={33} />);
    expect(screen.getByText('W')).toBeInTheDocument();
  });

  it('shows D badge when result is draw (MU as away team)', () => {
    render(<MatchCard fixture={mockDrawFixture} muTeamId={33} />);
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('shows L badge when MU loses as away team', () => {
    render(<MatchCard fixture={mockLossFixture} muTeamId={33} />);
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('renders league name', () => {
    render(<MatchCard fixture={mockFinishedFixture} />);
    expect(screen.getByText('Premier League')).toBeInTheDocument();
  });

  it('renders round info', () => {
    render(<MatchCard fixture={mockFinishedFixture} />);
    expect(screen.getByText('Regular Season - 30')).toBeInTheDocument();
  });

  it('renders score for live match', () => {
    render(<MatchCard fixture={mockLiveFixture} />);
    expect(screen.getByText('1 - 0')).toBeInTheDocument();
  });

  it('renders AET status as finished', () => {
    const aetFixture: Fixture = {
      ...mockFinishedFixture,
      status: { long: 'After Extra Time', short: 'AET', elapsed: 120 },
    };
    render(<MatchCard fixture={aetFixture} />);
    expect(screen.getByText('3 - 1')).toBeInTheDocument();
  });
});
