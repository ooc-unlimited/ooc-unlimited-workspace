import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Links | Everything You Need — In One Place',
  description: 'Organized for the builders. Built for the winners.',
};

interface LinkCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  icon: string;
}

function LinkCard({ title, description, buttonText, buttonUrl, icon }: LinkCardProps) {
  const isExternal = buttonUrl.startsWith('http');
  
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6">{description}</p>
      {isExternal ? (
        <a 
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {buttonText}
        </a>
      ) : (
        <Link 
          href={buttonUrl}
          className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-4">QUICK LINKS</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Everything You Need —<br />
          <span className="text-purple-400">In One Place</span>
        </h1>
        <p className="text-gray-400">Organized for the builders. Built for the winners.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* AGENT TOOLS Section */}
        <div className="mb-12">
          <h2 className="text-purple-400 text-sm font-semibold uppercase tracking-wider text-center mb-8">AGENT TOOLS</h2>
          
          {/* First row */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <LinkCard
              title="Tevah"
              description="Login to Tevah back office"
              buttonText="Go to Website"
              buttonUrl="https://tevahtech.com/"
              icon="📊"
            />
            <LinkCard
              title="Virtual Office"
              description="Join our team Zoom room"
              buttonText="Enter Zoom"
              buttonUrl="https://us02web.zoom.us/j/88888888888"
              icon="💻"
            />
            <LinkCard
              title="Grand Openings"
              description="RSVP for upcoming events"
              buttonText="View Events"
              buttonUrl="/admin/grand-opening"
              icon="⭐"
            />
          </div>

          {/* Second row */}
          <div className="grid md:grid-cols-3 gap-6">
            <LinkCard
              title="Agent Tracker"
              description="Your progression dashboard"
              buttonText="Track Progress"
              buttonUrl="/admin/dashboard"
              icon="📈"
            />
            <LinkCard
              title="Onboarding"
              description="Onboarding presentation"
              buttonText="Start Training"
              buttonUrl="/admin/onboarding"
              icon="📋"
            />
            <LinkCard
              title="Calendar"
              description="Schedule your appointments"
              buttonText="Go to Calendar"
              buttonUrl="https://calendly.com/gary-cosby-jr"
              icon="📅"
            />
          </div>
        </div>

        {/* CLIENT TOOLS Section */}
        <div className="mb-12">
          <h2 className="text-purple-400 text-sm font-semibold uppercase tracking-wider text-center mb-8">CLIENT TOOLS</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <LinkCard
              title="Personal Financial Review"
              description="Digital PFR for clients"
              buttonText="Start PFR"
              buttonUrl="/admin/pfr"
              icon="📊"
            />
            <LinkCard
              title="Annuity Intake"
              description="Client information sheet for rollovers"
              buttonText="Submit Forms"
              buttonUrl="/admin/annuity-intake"
              icon="📝"
            />
          </div>
        </div>

        {/* JOIN THE TEAM Section */}
        <div className="mb-12">
          <h2 className="text-purple-400 text-sm font-semibold uppercase tracking-wider text-center mb-8">JOIN THE TEAM</h2>
          
          <div className="max-w-md mx-auto">
            <LinkCard
              title="Join Our Team"
              description="Learn about the opportunity"
              buttonText="Learn More"
              buttonUrl="/join"
              icon="👥"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-6 text-center">
        <p className="text-gray-500 text-sm">
          OOC Unlimited © 2026 — Mission before Commission
        </p>
      </footer>
    </div>
  );
}