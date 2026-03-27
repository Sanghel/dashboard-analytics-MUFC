import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders default title when no title provided', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders default description when no description provided', () => {
    render(<EmptyState />);
    expect(screen.getByText('There is no data to display at the moment.')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<EmptyState title="No fixtures found" />);
    expect(screen.getByText('No fixtures found')).toBeInTheDocument();
  });

  it('renders custom description', () => {
    render(<EmptyState description="Try adjusting your filters." />);
    expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    const icon = <span data-testid="custom-icon">📭</span>;
    render(<EmptyState icon={icon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders default Inbox icon when no custom icon', () => {
    const { container } = render(<EmptyState />);
    // lucide-react renders SVGs
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
