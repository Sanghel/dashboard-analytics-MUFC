import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders default message when no message prop', () => {
    render(<ErrorMessage />);
    expect(screen.getByText('An error occurred while loading data.')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<ErrorMessage message="Network connection failed." />);
    expect(screen.getByText('Network connection failed.')).toBeInTheDocument();
  });

  it('renders "Something went wrong" heading', () => {
    render(<ErrorMessage />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorMessage onRetry={() => {}} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('does NOT render retry button when onRetry is not provided', () => {
    render(<ErrorMessage />);
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('calls onRetry when button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
