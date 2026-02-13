'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/agents', label: 'Agents', icon: '👥' },
  { href: '/alerts', label: 'Alerts', icon: '🚨' },
  { href: '/sms-templates', label: 'SMS Templates', icon: '💬' },
  { href: '/email-preview', label: 'Pushback Email', icon: '📧' },
  { href: '/metrics', label: 'Metrics', icon: '📈' },
  { href: '/carriers', label: 'Carrier Guide', icon: '🏢' },
  { href: '/grand-opening', label: 'Grand Openings', icon: '🎉' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="p-6 border-b border-[#262626]">
        <h1 className="text-lg font-bold text-white">🚀 Onboarding</h1>
        <p className="text-xs text-zinc-500 mt-1">Command Center</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                  : 'text-zinc-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#262626]">
        <p className="text-xs text-zinc-600">Gary Cosby Jr. • OOC Unlimited</p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#111111] border border-[#262626] rounded-lg p-2 text-white"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"/></svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-screen w-64 bg-[#111111] border-r border-[#262626] flex flex-col" onClick={e => e.stopPropagation()}>
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-[#111111] border-r border-[#262626] flex-col z-50">
        {navContent}
      </aside>
    </>
  );
}
