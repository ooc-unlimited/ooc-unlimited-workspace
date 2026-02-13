'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/trade-journal', label: 'Journal', icon: '📝' },
  { href: '/strategies', label: 'Strategies', icon: '📚' },
  { href: '/performance', label: 'Performance', icon: '🏆' },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-border-main bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-accent">NQ1!</span>
          <span className="text-text-secondary text-sm hidden sm:inline">Paper Trading</span>
        </div>
        <div className="flex gap-1 sm:gap-2">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-2 sm:px-3 py-1.5 rounded text-sm transition-colors ${
                pathname === l.href
                  ? 'bg-bg-tertiary text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="sm:hidden">{l.icon}</span>
              <span className="hidden sm:inline">{l.icon} {l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
