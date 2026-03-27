import { render, screen } from '@testing-library/react';
import { SeasonPerformanceChart } from './SeasonPerformanceChart';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

const mockData = [
  { matchday: 'GW1', goals: 2, goalsAgainst: 1, points: 3 },
  { matchday: 'GW2', goals: 0, goalsAgainst: 0, points: 1 },
  { matchday: 'GW3', goals: 3, goalsAgainst: 2, points: 3 },
];

describe('SeasonPerformanceChart', () => {
  it('renders without crashing', () => {
    render(<SeasonPerformanceChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders AreaChart', () => {
    render(<SeasonPerformanceChart data={mockData} />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(<SeasonPerformanceChart data={[]} />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });
});
