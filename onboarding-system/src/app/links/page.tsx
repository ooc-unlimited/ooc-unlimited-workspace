'use client';

import { useState } from 'react';

/* ───────── Section wrapper ───────── */
function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 md:py-28 px-4 md:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

/* ───────── Pill label ───────── */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-sm font-semibold tracking-widest uppercase text-purple-400 mb-4 text-center">
      {children}
    </span>
  );
}

/* ───────── Link Card Component ───────── */
function LinkCard({ title, description, url, category, icon }: {
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white/5 border border-gray-800 rounded-xl p-6 hover:border-purple-400/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/10 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <span className="text-purple-400 text-xs font-semibold uppercase tracking-wider">{category}</span>
          <h3 className="text-white font-semibold text-lg mt-1 mb-2 group-hover:text-purple-400 transition-colors">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
          <div className="flex items-center gap-2 mt-3 text-purple-400 text-sm font-medium">
            <span>Visit Link</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ───────── Category Filter ───────── */
function CategoryFilter({ categories, active, onSelect }: {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === category
              ? 'bg-purple-600 text-white'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default function LinksPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const links = [
    // ==================== CORE PLATFORMS ====================
    {
      title: 'Tevah Tech Platform',
      description: 'Your back office platform for commission tracking, recruiting metrics, and operational data',
      url: 'https://tevahtech.com/',
      category: 'Platforms',
      icon: '📊'
    },
    {
      title: 'Ringy CRM',
      description: 'Customer relationship management system for managing leads, contacts, and sales pipeline',
      url: 'https://app.ringy.com/home/sms',
      category: 'Platforms',
      icon: '📱'
    },
    {
      title: 'GoHighLevel',
      description: 'All-in-one marketing and CRM platform for automation and client communication',
      url: 'https://app.gohighlevel.com/',
      category: 'Marketing',
      icon: '🚀'
    },
    {
      title: 'PropHog Lead Generation',
      description: 'Advanced lead generation platform for finding licensed agents and prospects',
      url: 'https://agent-recruiting.prophog.ai/leads',
      category: 'Lead Generation',
      icon: '🎯'
    },
    
    // ==================== PROLIFIC SYSTEM ====================
    {
      title: 'Prolific Drive',
      description: 'Google Drive with all training slides, templates, emails, and announcements from Coach DC',
      url: 'https://drive.google.com/drive/folders/prolific-system',
      category: 'Training',
      icon: '📁'
    },
    {
      title: 'Onboarding Dashboard',
      description: 'Complete onboarding system for new agents - 3-part Prolific system automation',
      url: '/admin/onboarding',
      category: 'Onboarding',
      icon: '🎓'
    },
    {
      title: 'Ethos Insurance',
      description: 'Income protection policies for new agents - practice what you preach',
      url: 'https://apply.ethoslife.com/',
      category: 'Insurance',
      icon: '🛡️'
    },
    {
      title: 'Onboarding 1 Booking',
      description: 'Schedule Client Experience sessions (within 48h of agent code)',
      url: 'https://calendly.com/gary-cosby-jr/onboarding-1',
      category: 'Scheduling',
      icon: '📅'
    },

    // ==================== SALES & PRESENTATIONS ====================
    {
      title: 'iDecide Presentations',
      description: 'Interactive presentation platform - GFI standard and Welcome to GFI for prospects',
      url: 'https://login.idecide.com/members/#contacts',
      category: 'Sales Tools',
      icon: '🎥'
    },
    {
      title: 'Agent Dashboard',
      description: 'Your personal agent dashboard for tracking progress and accessing tools',
      url: '/admin',
      category: 'Dashboard',
      icon: '📈'
    },
    {
      title: 'Grand Opening System',
      description: 'Create and manage grand opening events for new agents and team building',
      url: '/admin/grand-opening',
      category: 'Events',
      icon: '🎉'
    },
    {
      title: 'SMS Templates',
      description: 'Pre-built SMS templates for prospecting and client communication',
      url: '/admin/sms-templates',
      category: 'Sales Tools',
      icon: '💬'
    },

    // ==================== PRODUCTIVITY TOOLS ====================
    {
      title: 'QMD Search',
      description: 'Quick markdown search - semantic search across 157 files, 5 collections',
      url: 'https://github.com/tobi/qmd',
      category: 'Productivity',
      icon: '🔍'
    },
    {
      title: 'TradingView Pro',
      description: 'Real-time CME/COMEX/NYMEX data for NQ1! futures and trading analysis',
      url: 'https://www.tradingview.com/',
      category: 'Trading',
      icon: '📈'
    },
    {
      title: 'Granola.ai Transcription',
      description: 'Meeting transcription service - 6-hour token refresh cycle',
      url: 'https://granola.ai/',
      category: 'Productivity',
      icon: '🎙️'
    },
    {
      title: 'Google Workspace',
      description: 'Donna account for calendar, email, drive, docs, sheets, and scheduling',
      url: 'https://workspace.google.com/',
      category: 'Productivity',
      icon: '📧'
    },

    // ==================== COMMUNICATIONS ====================
    {
      title: 'Twilio Console',
      description: 'SMS and voice provider - integrates with GHL LC Phone',
      url: 'https://www.twilio.com/console',
      category: 'Communications',
      icon: '📞'
    },
    {
      title: 'SiriusXM Yacht Soul',
      description: 'Background ambiance music for Virtual Office Zoom meetings',
      url: 'https://player.siriusxm.com/player/channel-xtra/yacht-soul/',
      category: 'Ambiance',
      icon: '🎵'
    },
    {
      title: 'Discord Server',
      description: 'OOC Unlimited server - agent channels, approvals, pipeline, alerts',
      url: 'https://discord.gg/ooc-unlimited',
      category: 'Communications',
      icon: '💬'
    },

    // ==================== COMPANY & TRAINING ====================
    {
      title: 'Gary Life Index',
      description: 'Main company website and agent portal for resources and information',
      url: 'https://garylifeindex.com/',
      category: 'Company',
      icon: '🏢'
    },
    {
      title: 'Training Videos',
      description: 'Access comprehensive training materials and educational content',
      url: '/training',
      category: 'Training',
      icon: '📚'
    },
    {
      title: 'Scripts Library',
      description: 'Sales scripts and templates for prospecting and client conversations',
      url: '/scripts',
      category: 'Sales Tools',
      icon: '📝'
    },

    // ==================== LEGAL & COMPLIANCE ====================
    {
      title: 'Privacy Policy',
      description: 'Our privacy policy and data protection guidelines',
      url: '/privacy-policy',
      category: 'Legal',
      icon: '🔒'
    },
    {
      title: 'Terms of Service',
      description: 'Terms and conditions for platform usage and services',
      url: '/terms-of-service',
      category: 'Legal',
      icon: '📋'
    }
  ];

  const categories = ['All', 'Platforms', 'Training', 'Onboarding', 'Sales Tools', 'Productivity', 'Communications', 'Company', 'Legal'];
  const filteredLinks = activeCategory === 'All' ? links : links.filter(link => link.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style jsx global>{`
        .text-purple-accent { color: #7B2FBE; }
        .bg-purple-accent { background-color: #4A0E78; }
        .border-purple-accent { border-color: #4A0E78; }
        .gradient-text {
          background: linear-gradient(135deg, #7B2FBE, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* ════════ HERO ════════ */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <Pill>Quick Access Portal</Pill>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Essential Links</span> &amp; Resources
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Quick access to all the platforms, tools, and resources you need to succeed in your GFI career
          </p>
        </div>
      </section>

      {/* ════════ LINKS SECTION ════════ */}
      <Section>
        <CategoryFilter 
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link, index) => (
            <LinkCard
              key={index}
              title={link.title}
              description={link.description}
              url={link.url}
              category={link.category}
              icon={link.icon}
            />
          ))}
        </div>
      </Section>

      {/* ════════ QUICK ACCESS SECTION ════════ */}
      <Section className="bg-[#0d0d0d]">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Quick Access</h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto text-center mb-12">
          Frequently used tools and resources for daily operations
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Login Portal', url: '/login', icon: '🔐', desc: 'Access your account' },
            { name: 'Join Team', url: '/join', icon: '🤝', desc: 'Career opportunity info' },
            { name: 'Admin Dashboard', url: '/admin', icon: '⚡', desc: 'Agent tools & metrics' },
            { name: 'Scripts Library', url: '/scripts', icon: '📝', desc: 'Sales scripts & templates' },
          ].map((item, index) => (
            <a
              key={index}
              href={item.url}
              className="bg-white/5 border border-gray-800 rounded-xl p-6 text-center hover:border-purple-400/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/10 transition-all duration-300 group"
            >
              <span className="text-3xl block mb-3">{item.icon}</span>
              <h3 className="text-white font-semibold mb-2 group-hover:text-purple-400 transition-colors">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </a>
          ))}
        </div>
      </Section>

      {/* ════════ SUPPORT SECTION ════════ */}
      <Section>
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Need Help?</h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto text-center mb-12">
          Get support and assistance with our platforms and tools
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-gray-800 rounded-xl p-6 text-center">
            <span className="text-3xl block mb-3">❓</span>
            <h3 className="text-white font-semibold mb-2">Platform Support</h3>
            <p className="text-gray-400 text-sm mb-4">Technical issues with any platform or tool</p>
            <button className="text-purple-400 font-medium text-sm hover:text-purple-300 transition-colors">
              Contact Support
            </button>
          </div>
          
          <div className="bg-white/5 border border-gray-800 rounded-xl p-6 text-center">
            <span className="text-3xl block mb-3">📞</span>
            <h3 className="text-white font-semibold mb-2">Sales Training</h3>
            <p className="text-gray-400 text-sm mb-4">Questions about sales process or client meetings</p>
            <button className="text-purple-400 font-medium text-sm hover:text-purple-300 transition-colors">
              Get Training Help
            </button>
          </div>
          
          <div className="bg-white/5 border border-gray-800 rounded-xl p-6 text-center">
            <span className="text-3xl block mb-3">💼</span>
            <h3 className="text-white font-semibold mb-2">Business Support</h3>
            <p className="text-gray-400 text-sm mb-4">General business questions and guidance</p>
            <button className="text-purple-400 font-medium text-sm hover:text-purple-300 transition-colors">
              Business Help
            </button>
          </div>
        </div>
      </Section>

      {/* ════════ FOOTER ════════ */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-lg font-bold mb-2 text-white">OOC Unlimited LLC</p>
            <p className="text-zinc-500 text-sm italic mb-6">&quot;Mission before commission.&quot;</p>
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} OOC Unlimited LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}