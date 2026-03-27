import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';

function renderSidebar(props = {}, initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Sidebar {...props} />
    </MemoryRouter>
  );
}

describe('Sidebar', () => {
  it('renders MAN UNITED logo text', () => {
    renderSidebar();
    expect(screen.getByText('MAN UNITED')).toBeInTheDocument();
  });

  it('renders Analytics subtitle', () => {
    renderSidebar();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('renders all nav items', () => {
    renderSidebar();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Standings')).toBeInTheDocument();
    expect(screen.getByText('Player Stats')).toBeInTheDocument();
    expect(screen.getByText('Live Match')).toBeInTheDocument();
    expect(screen.getByText('Tactical Analysis')).toBeInTheDocument();
    expect(screen.getByText('Injuries')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Records')).toBeInTheDocument();
  });

  it('applies active class to current route link', () => {
    renderSidebar({}, '/standings');
    const standingsLink = screen.getByText('Standings').closest('a');
    expect(standingsLink?.className).toContain('bg-mufc-red');
  });

  it('does not apply active class to non-current route links', () => {
    renderSidebar({}, '/standings');
    const overviewLink = screen.getByText('Overview').closest('a');
    expect(overviewLink?.className).not.toContain('bg-mufc-red');
  });

  it('calls onClose when a nav item is clicked', () => {
    const onClose = vi.fn();
    renderSidebar({ onClose });
    fireEvent.click(screen.getByText('Overview'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nav links with correct hrefs', () => {
    renderSidebar();
    const overviewLink = screen.getByText('Overview').closest('a');
    expect(overviewLink).toHaveAttribute('href', '/');
    const standingsLink = screen.getByText('Standings').closest('a');
    expect(standingsLink).toHaveAttribute('href', '/standings');
  });
});
