import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GFI x Team OOC — Career Opportunity',
  description: 'Join GFI x Team OOC. Build a financial services career with true ownership, up to 133% compensation, and a proven system.',
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
