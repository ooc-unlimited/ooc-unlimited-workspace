import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = 'https://garylifeindex.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Gary Cosby | Life Insurance & Financial Services | OOC Unlimited',
    template: '%s | Gary Cosby — OOC Unlimited',
  },
  description:
    'Protecting families and building futures through personalized life insurance and financial services. IUL, Whole Life, Term Life — mission before commission. Gary Cosby Jr. | OOC Unlimited.',
  keywords: [
    'financial services career',
    'insurance agent opportunity',
    'GFI',
    'Team OOC',
    'life insurance career',
    'IUL',
    'financial advisor',
    'insurance recruiting',
    'OOC Unlimited',
  ],
  authors: [{ name: 'OOC Unlimited' }],
  creator: 'OOC Unlimited',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'GFI × Team OOC',
    title: 'GFI × Team OOC | Financial Services Career Opportunity',
    description:
      'Build a life-changing career in financial services. Up to 133% compensation, 30+ A-rated carriers, proven system, and real ownership.',
    images: [
      {
        url: `${SITE_URL}/images/nyse-signing.jpeg`,
        width: 1200,
        height: 630,
        alt: 'GFI Partnership Signing Ceremony at the New York Stock Exchange',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GFI × Team OOC | Financial Services Career Opportunity',
    description:
      'Build a life-changing career in financial services. Up to 133% compensation, 30+ A-rated carriers, and real ownership.',
    images: [`${SITE_URL}/images/nyse-signing.jpeg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: 'UtbsyO8otRWksWESnwO54gR-iBWI3E7STgENqqE1_Yo',
  },
};

// JSON-LD structured data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OOC Unlimited — GFI × Team OOC',
  url: SITE_URL,
  logo: `${SITE_URL}/images/nyse-signing.jpeg`,
  description:
    'OOC Unlimited helps people build life-changing careers in financial services — mission before commission.',
  foundingDate: '2024',
  founder: { '@type': 'Person', name: 'Gary Cosby Jr.' },
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'recruiting',
    availableLanguage: 'English',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GFI × Team OOC',
  url: SITE_URL,
  description:
    'Build a life-changing career in financial services with GFI × Team OOC.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.className} bg-[#0a0a0a] text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
