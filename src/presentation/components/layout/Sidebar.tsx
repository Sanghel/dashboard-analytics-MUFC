import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Trophy,
  Users,
  Radio,
  TrendingUp,
  HeartPulse,
  Calendar,
  Award,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: BarChart3 },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/players', label: 'Player Stats', icon: Users },
  { href: '/live-match', label: 'Live Match', icon: Radio },
  { href: '/tactical-analysis', label: 'Tactical Analysis', icon: TrendingUp },
  { href: '/injuries', label: 'Injuries', icon: HeartPulse },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/records', label: 'Records', icon: Award },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="flex flex-col h-full w-64 bg-mufc-sidebar border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-10 h-10 bg-mufc-red rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          MU
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">MAN UNITED</p>
          <p className="text-white/40 text-xs">Analytics</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-mufc-red text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
