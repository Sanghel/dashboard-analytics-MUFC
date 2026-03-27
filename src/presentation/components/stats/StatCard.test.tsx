import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders title', () => {
    render(<StatCard title="Goals" value={25} />);
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });

  it('renders value', () => {
    render(<StatCard title="Goals" value={25} />);
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<StatCard title="Goals" value={25} subtitle="This season" />);
    expect(screen.getByText('This season')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<StatCard title="Goals" value={25} />);
    expect(screen.queryByText('This season')).not.toBeInTheDocument();
  });

  it('renders trend label when trend=up and trendLabel provided', () => {
    render(<StatCard title="Goals" value={25} trend="up" trendLabel="+5%" />);
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });

  it('renders trend label when trend=down and trendLabel provided', () => {
    render(<StatCard title="Goals" value={25} trend="down" trendLabel="-3%" />);
    expect(screen.getByText('-3%')).toBeInTheDocument();
  });

  it('renders trend section when trend=neutral', () => {
    const { container } = render(
      <StatCard title="Goals" value={25} trend="neutral" trendLabel="0%" />
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
    // neutral trend uses Minus icon - svg should be present
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render trend section when no trend', () => {
    render(<StatCard title="Goals" value={25} />);
    // No trendLabel text
    expect(screen.queryByText('+5%')).not.toBeInTheDocument();
  });

  it('applies highlight styles when highlight=true', () => {
    const { container } = render(<StatCard title="Goals" value={25} highlight={true} />);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('border-mufc-red');
  });

  it('does not apply highlight styles when highlight=false', () => {
    const { container } = render(<StatCard title="Goals" value={25} highlight={false} />);
    const div = container.firstChild as HTMLElement;
    expect(div.className).not.toContain('border-mufc-red');
  });

  it('renders icon when provided', () => {
    const icon = <span data-testid="custom-icon">★</span>;
    render(<StatCard title="Goals" value={25} icon={icon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<StatCard title="League" value="Premier League" />);
    expect(screen.getByText('Premier League')).toBeInTheDocument();
  });
});
