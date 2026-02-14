import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrier Product Guide',
  description: 'Carrier products and payout reference for OOC Unlimited agents.',
  robots: { index: false, follow: false },
};

export default function CarriersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
