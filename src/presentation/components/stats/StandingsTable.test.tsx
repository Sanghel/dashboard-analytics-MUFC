import { render, screen } from '@testing-library/react';
import { StandingsTable } from './StandingsTable';
import type { Standing } from '@/shared/types/football';

const mockStandings: Standing[] = [
  {
    rank: 1,
    team: { id: 50, name: 'Manchester City', shortName: 'MCI', logo: '' },
    points: 72,
    goalsDiff: 40,
    group: 'Premier League',
    form: 'WWWDW',
    status: 'same',
    description: 'Promotion - Champions League (Group Stage: )',
    all: { played: 32, win: 22, draw: 6, lose: 4, goals: { for: 70, against: 30 } },
    home: { played: 16, win: 12, draw: 2, lose: 2, goals: { for: 38, against: 15 } },
    away: { played: 16, win: 10, draw: 4, lose: 2, goals: { for: 32, against: 15 } },
    update: '2025-03-22T00:00:00+00:00',
  },
  {
    rank: 14,
    team: { id: 33, name: 'Manchester United', shortName: 'MUN', logo: '' },
    points: 38,
    goalsDiff: -5,
    group: 'Premier League',
    form: 'LWDWL',
    status: 'same',
    description: '',
    all: { played: 32, win: 10, draw: 8, lose: 14, goals: { for: 38, against: 43 } },
    home: { played: 16, win: 7, draw: 4, lose: 5, goals: { for: 22, against: 20 } },
    away: { played: 16, win: 3, draw: 4, lose: 9, goals: { for: 16, against: 23 } },
    update: '2025-03-22T00:00:00+00:00',
  },
  {
    rank: 15,
    team: { id: 45, name: 'Everton', shortName: 'EVE', logo: '' },
    points: 35,
    goalsDiff: -10,
    group: 'Premier League',
    form: 'LLDLW',
    status: 'same',
    description: '',
    all: { played: 32, win: 9, draw: 8, lose: 15, goals: { for: 30, against: 40 } },
    home: { played: 16, win: 5, draw: 5, lose: 6, goals: { for: 18, against: 22 } },
    away: { played: 16, win: 4, draw: 3, lose: 9, goals: { for: 12, against: 18 } },
    update: '2025-03-22T00:00:00+00:00',
  },
];

describe('StandingsTable', () => {
  it('renders all team names', () => {
    render(<StandingsTable standings={mockStandings} />);
    expect(screen.getByText('Manchester City')).toBeInTheDocument();
    expect(screen.getByText('Manchester United')).toBeInTheDocument();
    expect(screen.getByText('Everton')).toBeInTheDocument();
  });

  it('highlights MU row with mufc-red class', () => {
    const { container } = render(<StandingsTable standings={mockStandings} highlightTeamId={33} />);
    const muRow = container.querySelector('tr.bg-mufc-red\\/10');
    expect(muRow).toBeInTheDocument();
  });

  it('shows correct points for each team', () => {
    render(<StandingsTable standings={mockStandings} />);
    expect(screen.getAllByText('72').length).toBeGreaterThan(0);
    expect(screen.getAllByText('35').length).toBeGreaterThan(0);
  });

  it('renders W/D/L counts for a team', () => {
    render(<StandingsTable standings={mockStandings} />);
    // MU: win=10, draw=8, lose=14 - use getAllByText since numbers may appear multiple times
    expect(screen.getAllByText('10').length).toBeGreaterThan(0);
    expect(screen.getAllByText('14').length).toBeGreaterThan(0);
  });

  it('renders rank numbers', () => {
    render(<StandingsTable standings={mockStandings} />);
    // ranks 1, 14, 15 appear in rank column
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('15').length).toBeGreaterThan(0);
  });

  it('renders GF/GA columns when not compact', () => {
    render(<StandingsTable standings={mockStandings} />);
    expect(screen.getByText('GF')).toBeInTheDocument();
    expect(screen.getByText('GA')).toBeInTheDocument();
  });

  it('does not render GF/GA when compact=true', () => {
    render(<StandingsTable standings={mockStandings} compact={true} />);
    expect(screen.queryByText('GF')).not.toBeInTheDocument();
    expect(screen.queryByText('GA')).not.toBeInTheDocument();
  });

  it('renders positive goal difference with + prefix', () => {
    render(<StandingsTable standings={mockStandings} />);
    expect(screen.getByText('+40')).toBeInTheDocument();
  });

  it('renders negative goal difference without + prefix', () => {
    render(<StandingsTable standings={mockStandings} />);
    expect(screen.getByText('-5')).toBeInTheDocument();
  });

  it('renders form badges when not compact', () => {
    render(<StandingsTable standings={mockStandings} />);
    // Form for MU last 5: L,W,D,W,L → badges
    const wBadges = screen.getAllByText('W');
    expect(wBadges.length).toBeGreaterThan(0);
  });

  it('does not render form column when compact=true', () => {
    render(<StandingsTable standings={mockStandings} compact={true} />);
    expect(screen.queryByText('Form')).not.toBeInTheDocument();
  });
});
