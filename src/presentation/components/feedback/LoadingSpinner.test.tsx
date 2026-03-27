import { render } from '@testing-library/react';
import { LoadingSpinner, LoadingPage } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with size sm', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector('.w-4');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with size md (default)', () => {
    const { container } = render(<LoadingSpinner size="md" />);
    const spinner = container.querySelector('.w-8');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with size lg', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('.w-12');
    expect(spinner).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with animate-spin class', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

describe('LoadingPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders a large spinner', () => {
    const { container } = render(<LoadingPage />);
    const spinner = container.querySelector('.w-12');
    expect(spinner).toBeInTheDocument();
  });
});
