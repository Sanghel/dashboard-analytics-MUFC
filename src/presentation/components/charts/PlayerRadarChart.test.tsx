import { render, screen } from '@testing-library/react';
import { PlayerRadarChart } from './PlayerRadarChart';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  RadarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="radar-chart">{children}</div>
  ),
  Radar: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
}));

const mockData = [
  { attribute: 'Pace', value: 85, fullMark: 100 },
  { attribute: 'Shooting', value: 80, fullMark: 100 },
  { attribute: 'Passing', value: 75, fullMark: 100 },
  { attribute: 'Dribbling', value: 88, fullMark: 100 },
  { attribute: 'Defending', value: 40, fullMark: 100 },
  { attribute: 'Physical', value: 70, fullMark: 100 },
];

describe('PlayerRadarChart', () => {
  it('renders without crashing', () => {
    render(<PlayerRadarChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders RadarChart', () => {
    render(<PlayerRadarChart data={mockData} />);
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });

  it('renders with custom color', () => {
    const { container } = render(<PlayerRadarChart data={mockData} color="#00ff00" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(<PlayerRadarChart data={[]} />);
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });
});
