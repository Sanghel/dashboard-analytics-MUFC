import { render, screen } from '@testing-library/react';
import { ApiLimitReached } from './ApiLimitReached';

describe('ApiLimitReached', () => {
  it('renders used/max request count', () => {
    render(<ApiLimitReached usedRequests={95} maxRequests={100} />);
    expect(screen.getByText('95/100')).toBeInTheDocument();
  });

  it('renders the overlay with fixed positioning', () => {
    const { container } = render(<ApiLimitReached usedRequests={100} maxRequests={100} />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay.className).toContain('fixed');
    expect(overlay.className).toContain('inset-0');
  });

  it('renders API Limit Reached title', () => {
    render(<ApiLimitReached usedRequests={100} maxRequests={100} />);
    expect(screen.getByText('API Limit Reached')).toBeInTheDocument();
  });

  it('renders the maxRequests in the description', () => {
    render(<ApiLimitReached usedRequests={100} maxRequests={100} />);
    expect(
      screen.getByText(/The free tier of API Football allows 100 requests per day/)
    ).toBeInTheDocument();
  });

  it('renders reset date when provided', () => {
    render(<ApiLimitReached usedRequests={100} maxRequests={100} resetDate="2026-03-27" />);
    expect(screen.getByText(/Your limit resets on 2026-03-27/)).toBeInTheDocument();
  });

  it('does not render reset date text when not provided', () => {
    render(<ApiLimitReached usedRequests={100} maxRequests={100} />);
    expect(screen.queryByText(/Your limit resets on/)).not.toBeInTheDocument();
  });

  it('shows cached data message', () => {
    render(<ApiLimitReached usedRequests={100} maxRequests={100} />);
    expect(screen.getByText(/using cached data/i)).toBeInTheDocument();
  });
});
