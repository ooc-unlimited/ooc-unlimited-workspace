import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grand Opening Factory',
  description: 'Create and manage Grand Opening events for OOC Unlimited.',
  robots: { index: false, follow: false },
};

export default function GrandOpeningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
