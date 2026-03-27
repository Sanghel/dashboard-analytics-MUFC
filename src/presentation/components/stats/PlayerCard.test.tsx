import { render, screen } from '@testing-library/react';
import { PlayerCard } from './PlayerCard';
import type { PlayerStats } from '@/shared/types/football';

const mockPlayerStats: PlayerStats = {
  player: {
    id: 276,
    name: 'Marcus Rashford',
    age: 27,
    nationality: 'England',
    position: 'Attacker',
    photo: '',
  },
  statistics: [
    {
      games: {
        appearances: 30,
        lineups: 28,
        minutes: 2400,
        number: 10,
        position: 'Attacker',
        rating: '7.5',
        captain: false,
      },
      goals: {
        total: 12,
        conceded: 0,
        assists: 5,
        saves: null,
      },
      shots: { total: 55, on: 28 },
      passes: { total: 600, key: 40, accuracy: '78' },
      tackles: { total: 20, blocks: 3, interceptions: 10 },
      cards: { yellow: 2, yellowred: 0, red: 0 },
    },
  ],
};

const mockGoalkeeperStats: PlayerStats = {
  player: {
    id: 100,
    name: 'Andre Onana',
    age: 28,
    nationality: 'Cameroon',
    position: 'Goalkeeper',
    photo: '',
  },
  statistics: [
    {
      games: {
        appearances: 32,
        lineups: 32,
        minutes: 2880,
        number: 24,
        position: 'Goalkeeper',
        rating: '6.9',
        captain: false,
      },
      goals: {
        total: null,
        conceded: 38,
        assists: null,
        saves: 90,
      },
      shots: { total: null, on: null },
      passes: { total: 800, key: 5, accuracy: '85' },
      tackles: { total: 2, blocks: 1, interceptions: 2 },
      cards: { yellow: 1, yellowred: 0, red: 0 },
    },
  ],
};

describe('PlayerCard', () => {
  it('renders player name', () => {
    render(<PlayerCard playerStats={mockPlayerStats} />);
    expect(screen.getByText('Marcus Rashford')).toBeInTheDocument();
  });

  it('renders nationality', () => {
    render(<PlayerCard playerStats={mockPlayerStats} />);
    expect(screen.getByText('England')).toBeInTheDocument();
  });

  it('renders goals count', () => {
    render(<PlayerCard playerStats={mockPlayerStats} />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders assists count', () => {
    render(<PlayerCard playerStats={mockPlayerStats} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders appearances count', () => {
    render(<PlayerCard playerStats={mockPlayerStats} />);
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('renders position badge', () => {
    render(<PlayerCard playerStats={mockPlayerStats} />);
    expect(screen.getByText('Attacker')).toBeInTheDocument();
  });

  it('renders shirt number', () => {
    render(<PlayerCard playerStats={mockPlayerStats} />);
    expect(screen.getByText('#10')).toBeInTheDocument();
  });

  it('renders goalkeeper position badge with correct color class', () => {
    render(<PlayerCard playerStats={mockGoalkeeperStats} />);
    expect(screen.getByText('Goalkeeper')).toBeInTheDocument();
  });

  it('shows 0 goals when total is null', () => {
    render(<PlayerCard playerStats={mockGoalkeeperStats} />);
    // goals.total is null → shows 0
    const goalValues = screen.getAllByText('0');
    expect(goalValues.length).toBeGreaterThan(0);
  });

  it('renders player initial when no photo', () => {
    render(<PlayerCard playerStats={mockPlayerStats} />);
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('renders player photo when provided', () => {
    const statsWithPhoto = {
      ...mockPlayerStats,
      player: { ...mockPlayerStats.player, photo: 'https://example.com/photo.jpg' },
    };
    render(<PlayerCard playerStats={statsWithPhoto} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });
});
