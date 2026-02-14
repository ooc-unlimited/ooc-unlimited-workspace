import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — Onboarding Command Center',
  description: 'Sign in to the OOC Unlimited Onboarding Command Center.',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
