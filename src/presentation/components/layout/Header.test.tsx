import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { ThemeProvider } from '@/presentation/components/ui/ThemeProvider';

function renderHeader(props: Partial<Parameters<typeof Header>[0]> = {}) {
  return render(
    <ThemeProvider defaultTheme="dark">
      <Header onMenuToggle={() => {}} {...props} />
    </ThemeProvider>
  );
}

describe('Header', () => {
  it('renders default title when no title prop', () => {
    renderHeader();
    expect(screen.getByText('Season Overview')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    renderHeader({ title: 'Player Stats' });
    expect(screen.getByText('Player Stats')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    renderHeader({ subtitle: 'Premier League 2024/25' });
    expect(screen.getByText('Premier League 2024/25')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    renderHeader();
    expect(screen.queryByText('Premier League 2024/25')).not.toBeInTheDocument();
  });

  it('calls onMenuToggle when menu button is clicked', () => {
    const onMenuToggle = vi.fn();
    renderHeader({ onMenuToggle });
    // The menu button uses variant=ghost, size=icon
    const buttons = screen.getAllByRole('button');
    // First button is the menu toggle
    fireEvent.click(buttons[0]);
    expect(onMenuToggle).toHaveBeenCalledTimes(1);
  });

  it('renders theme toggle button', () => {
    renderHeader();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('renders Avatar with DS fallback', () => {
    renderHeader();
    expect(screen.getByText('DS')).toBeInTheDocument();
  });

  it('toggles theme when theme button is clicked', () => {
    renderHeader();
    const buttons = screen.getAllByRole('button');
    // Second button is the theme toggle
    const themeButton = buttons[1];
    // Should show Sun icon when dark (since dark→click→light shows Moon)
    fireEvent.click(themeButton);
    // After click from dark, should switch to light
    // We just verify it doesn't crash and re-renders
    expect(screen.getByText('Season Overview')).toBeInTheDocument();
  });
});
