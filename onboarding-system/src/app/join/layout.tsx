import type { Metadata } from 'next';

const SITE_URL = 'https://garylifeindex.com';

export const metadata: Metadata = {
  title: 'Join GFI × Team OOC — Build Your Financial Services Career',
  description:
    'Join GFI × Team OOC and build a life-changing career in financial services. Up to 133% compensation, 30+ A-rated carriers, proven training system, ownership program, and mission-driven culture. Start today.',
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/join`,
    title: 'Join GFI × Team OOC — Build Your Financial Services Career',
    description:
      'Up to 133% compensation, 30+ A-rated carriers, proven training, and real ownership. Mission before commission.',
    images: [
      {
        url: `${SITE_URL}/images/nyse-signing.jpeg`,
        width: 1200,
        height: 630,
        alt: 'GFI Partnership Signing Ceremony at NYSE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join GFI × Team OOC — Financial Services Career',
    description:
      'Up to 133% compensation, 30+ carriers, proven system, and real ownership. Mission before commission.',
    images: [`${SITE_URL}/images/nyse-signing.jpeg`],
  },
  alternates: {
    canonical: `${SITE_URL}/join`,
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
