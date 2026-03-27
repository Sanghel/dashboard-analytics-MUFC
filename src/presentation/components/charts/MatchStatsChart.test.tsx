import { render, screen } from '@testing-library/react';
import { MatchStatsChart } from './MatchStatsChart';

const mockStats = [
  { label: 'Possession', home: 55, away: 45 },
  { label: 'Shots', home: 12, away: 8 },
  { label: 'Passes', home: 500, away: 400 },
];

describe('MatchStatsChart', () => {
  it('renders without crashing', () => {
    render(<MatchStatsChart stats={mockStats} homeTeam="Man United" awayTeam="Liverpool" />);
    expect(screen.getByText('Man United')).toBeInTheDocument();
  });

  it('renders home team name', () => {
    render(<MatchStatsChart stats={mockStats} homeTeam="Man United" awayTeam="Liverpool" />);
    expect(screen.getByText('Man United')).toBeInTheDocument();
  });

  it('renders away team name', () => {
    render(<MatchStatsChart stats={mockStats} homeTeam="Man United" awayTeam="Liverpool" />);
    expect(screen.getByText('Liverpool')).toBeInTheDocument();
  });

  it('renders all stat labels', () => {
    render(<MatchStatsChart stats={mockStats} homeTeam="Man United" awayTeam="Liverpool" />);
    expect(screen.getByText('Possession')).toBeInTheDocument();
    expect(screen.getByText('Shots')).toBeInTheDocument();
    expect(screen.getByText('Passes')).toBeInTheDocument();
  });

  it('renders home stat values', () => {
    render(<MatchStatsChart stats={mockStats} homeTeam="Man United" awayTeam="Liverpool" />);
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders away stat values', () => {
    render(<MatchStatsChart stats={mockStats} homeTeam="Man United" awayTeam="Liverpool" />);
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('handles zero values (total = 0 → uses 1 to avoid division by zero)', () => {
    const zeroStats = [{ label: 'Fouls', home: 0, away: 0 }];
    render(<MatchStatsChart stats={zeroStats} homeTeam="Man United" awayTeam="Liverpool" />);
    expect(screen.getByText('Fouls')).toBeInTheDocument();
  });

  it('renders with empty stats array', () => {
    const { container } = render(
      <MatchStatsChart stats={[]} homeTeam="Man United" awayTeam="Liverpool" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
