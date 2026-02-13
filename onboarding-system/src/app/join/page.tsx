'use client';

import { useEffect, useRef, useState } from 'react';

/* ───────── Animated Counter ───────── */
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-purple-accent whitespace-nowrap">
      {count}{suffix}
    </span>
  );
}

/* ───────── FAQ Accordion ───────── */
function FAQ({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-5 md:p-6 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-white pr-4">{q}</span>
        <span className="text-purple-accent text-2xl flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-5 md:px-6 md:pb-6 text-gray-400 leading-relaxed">{a}</div>
      </div>
    </div>
  );
}

/* ───────── Culture Videos ───────── */
function CultureVideos() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videos = [
    { title: 'Partnership Ownership Program', id: 'VPn_GrCU', thumb: 'https://stream.adilo.com/adilo-encoding/zPbCyz5Mbfqv0HL2/VPn_GrCU/thumb/1080_2.jpg' },
    { title: "Five F's", id: '3hI9C8Nv', thumb: 'https://stream.adilo.com/adilo-encoding/zPbCyz5Mbfqv0HL2/3hI9C8Nv/thumb/1080_2.jpg' },
    { title: 'GFI Partners', id: 'waMOhLiV', thumb: 'https://stream.adilo.com/adilo-encoding/zPbCyz5Mbfqv0HL2/waMOhLiV/thumb/1080_2.jpg' },
    { title: 'What is GFI', id: 'FuLyJw3w', thumb: 'https://stream.adilo.com/adilo-encoding/zPbCyz5Mbfqv0HL2/FuLyJw3w/thumb/1080_2.jpg' },
    { title: 'Athletes Division', id: 'Msnovdaz', thumb: 'https://stream.adilo.com/adilo-encoding/zPbCyz5Mbfqv0HL2/Msnovdaz/thumb/1080_2.jpg' },
  ];

  return (
    <Section className="bg-[#0d0d0d]">
      <h2 className="text-3xl md:text-5xl font-bold mb-3 text-center">Culture Makes the Difference</h2>
      <div className="w-16 h-1 bg-purple-accent mx-auto mb-6 rounded-full" />
      <p className="text-gray-400 text-center text-lg mb-12 max-w-2xl mx-auto">
        Everyone says they have great culture. Hit play and see the difference for yourself.
      </p>

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
          onKeyDown={(e) => e.key === 'Escape' && setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} className="absolute -top-10 right-0 text-white text-2xl hover:text-purple-accent" aria-label="Close video">✕</button>
            <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '177%' }}>
              <iframe
                src={`https://adilo.bigcommand.com/watch/${activeVideo}`}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                allow="autoplay; fullscreen"
                title="Culture video"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {videos.map((v) => (
          <div key={v.id} className="text-center">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">{v.title}</h3>
            <button
              onClick={() => setActiveVideo(v.id)}
              className="relative w-full rounded-xl overflow-hidden border border-gray-700 hover:border-purple-accent/60 transition-all group"
              style={{ aspectRatio: '9/16' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumb} alt={v.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-purple-accent/80 group-hover:bg-purple-accent flex items-center justify-center transition-colors shadow-lg">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

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
    <span className="inline-block text-sm font-semibold tracking-widest uppercase text-purple-accent mb-4">
      {children}
    </span>
  );
}

/* ───────── Carrier logos ───────── */
const carriers = [
  'Prudential','Allianz','F&G Annuities & Life','North American','Corebridge Financial','Ameritas',
  'AuguStar Financial','Ethos','Foresters Financial','Mutual of Omaha','Symetra','Banner Life',
  'John Hancock','American National','Lincoln Financial Group','Global Atlantic Financial Group',
  'SILAC Insurance','American Equity','National Western Life','Nassau','BMI','OneAmerica Financial',
  'Securian Financial','EquiTrust Life','Pan American Life','SBLI','American-Amicable',
  'United Home Life','TruStage','Security Mutual Life',
];

/* ───────── Divisions ───────── */
const divisions = [
  { name: 'Faith Division' },
  { name: 'Military Division' },
  { name: 'Healthcare Division' },
  { name: 'Teachers Division' },
  { name: 'Advanced Planning' },
  { name: 'Influencer Division' },
  { name: 'Athletes Division' },
  { name: 'Multi-Cultural Division' },
  { name: 'First Responders' },
  { name: 'Agriculture Division' },
  { name: 'Client Leads Division' },
  { name: 'Real Estate Division' },
];

/* ───────── 12 Reasons ───────── */
const reasons = [
  { num: '01', title: "The 5 F's (The Fulfillment Formula)", desc: 'Faith • Family • Fitness • Finance • Fun' },
  { num: '02', title: 'Builders Compensation', desc: '12 Month Annualization • Uncapped Commissions • 100% of Target • Rollovers Pay Through The Grid' },
  { num: '03', title: 'Incentive Trips & Events', desc: '' },
  { num: '04', title: 'Leadership Development Obsession', desc: '' },
  { num: '05', title: 'Unified & Proven System', desc: '' },
  { num: '06', title: 'Direct Contracts With Carriers', desc: '' },
  { num: '07', title: 'Tevah Technologies & Armor Tech Stack', desc: 'Fintech Platform' },
  { num: '08', title: 'Hybrid Business Model', desc: 'Inspirational Marketing (Recruit & Build) • Direct Marketing (Leads) • Advanced Marketing (Advanced Planning)' },
  { num: '09', title: 'Track Record of Success', desc: 'Eighteen 7 Figure Earners' },
  { num: '10', title: 'International (50+ Countries)', desc: '' },
  { num: '11', title: 'Winning Culture | Inspirational Marketing', desc: '' },
  { num: '12', title: 'Ownership Package & "POP"', desc: 'Partnership Ownership Program' },
];

/* ───────── MAIN PAGE ───────── */
function StickyButtons() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      <button
        onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
        className="bg-purple-accent hover:bg-purple-700 text-white font-bold px-5 py-3 rounded-full shadow-lg shadow-purple-accent/30 transition-all hover:scale-105 text-sm"
      >
        Apply Now
      </button>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white scroll-smooth">
      <style jsx global>{`
        .text-purple-accent { color: #7B2FBE; }
        .bg-purple-accent { background-color: #4A0E78; }
        .bg-purple-accent-light { background-color: #5B1A91; }
        .border-purple-accent { border-color: #4A0E78; }
        .from-purple-accent { --tw-gradient-from: #4A0E78; }
        .to-purple-accent { --tw-gradient-to: #7B2FBE; }
        .ring-purple-accent { --tw-ring-color: #4A0E78; }
        .glow-purple { box-shadow: 0 0 40px rgba(74, 14, 120, 0.3); }
        .gradient-text {
          background: linear-gradient(135deg, #7B2FBE, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-accent/20 rounded-full blur-[120px]" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h2 className="text-lg md:text-xl font-semibold text-purple-accent tracking-wide uppercase mb-4">
            GFI × Team OOC Career Opportunity
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Opportunity <span className="gradient-text">Overview</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-16">
            Learn about this exclusive financial services career opportunity and the qualifications needed to succeed
          </p>

          {/* Hero Video */}
          <div className="max-w-3xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl glow-purple">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://adilo.bigcommand.com/watch/zIJA8St9"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                allow="autoplay; fullscreen"
                title="GFI Empowering Freedom - Company Overview"
              />
            </div>
          </div>

          {/* Stat counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 max-w-7xl mx-auto">
            {[
              { end: 12, suffix: '+', label: 'Specialized Divisions', sub: 'Each crafted to honor your unique background and expertise' },
              { end: 18, suffix: '+', label: 'Millionaires Created', sub: 'Proven track record of building life-changing wealth' },
              { end: 30, suffix: '+', label: 'A+ Rated Providers', sub: "Access to America's most trusted financial institutions" },
              { end: 50, suffix: '+', label: 'Countries Worldwide', sub: 'Global expansion across multiple continents and markets' },
              { end: 58, suffix: 'K+', label: 'Agents', sub: 'Growing network of successful financial professionals' },
              { end: 100, suffix: 'K+', label: 'Clients', sub: "Families and businesses we've helped achieve their financial goals" },
            ].map((s, i) => (
              <div key={i} className="text-center bg-white/5 rounded-2xl px-3 py-6 border-t-4 border-purple-accent shadow-lg hover:-translate-y-2 hover:shadow-purple-accent/20 hover:shadow-xl transition-all duration-300 cursor-default overflow-hidden">
                <AnimatedCounter end={s.end} suffix={s.suffix} />
                <h4 className="text-white font-bold mt-3 text-sm">{s.label}</h4>
                <p className="text-gray-500 text-xs mt-2 leading-relaxed">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PROFESSIONAL OPPORTUNITY ════════ */}
      <Section>
        <Pill>Professional Opportunity</Pill>
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">GFI × Team OOC Career</h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto text-center mb-12">
          Join a professional team representing 25+ of America&apos;s largest financial institutions with comprehensive training and ongoing support
        </p>

        <h3 className="text-2xl font-bold mb-8">Requirements &amp; Qualifications</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>, title: 'Age Requirement', text: 'Must be 18 years or older to participate in this financial services opportunity and meet regulatory compliance standards.' },
            { icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>, title: 'US Citizenship Required', text: 'Must be a US citizen or permanent resident. Student visas and temporary work permits do not qualify for this position.' },
            { icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Background Verification', text: 'Must complete a background check. This requirement is non-negotiable for all positions.' },
            { icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: '$199 to Get Started', text: 'One-time platform investment required for qualified candidates. This small investment unlocks access to training, systems, and support worth 10x the cost.' },
            { icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>, title: 'Independent Contractor Status', text: 'Position structured as 1099 independent contractor with complete flexibility and autonomy in your work schedule.' },
            { icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>, title: 'Remote Work Environment', text: 'Work from your home with location independence and flexible scheduling to accommodate your lifestyle.' },
          ].map((r, i) => (
            <div key={i} className="bg-white/5 border border-gray-800 rounded-xl p-6 hover:border-purple-accent/50 transition-colors text-center">
              <div className="text-purple-accent mx-auto mb-3 flex justify-center">{r.icon}</div>
              <h4 className="text-white font-semibold mb-2">{r.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════ WHY GFI & TEAM OOC ════════ */}
      <Section className="bg-[#0d0d0d]">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Why GFI &amp; Team OOC?</h2>
        <p className="text-purple-accent font-semibold text-lg mb-4 text-center">Because Here, Success Means More Than Money.</p>
        <p className="text-gray-400 max-w-3xl mx-auto text-center mb-12">
          At GFI, we believe true success is measured by the life you create in Faith, Family, Fitness, Finance, and Fun. We call it the Fulfillment Formula, the 5 F&apos;s. When you join us, you&apos;re not just building income. You&apos;re building a life of purpose, freedom, and impact.
        </p>

        {/* 5 F's */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {[
            { f: 'Faith', desc: 'Strengthen your spiritual foundation and find deeper purpose in your journey', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-4-12h8" /></svg> },
            { f: 'Family', desc: 'Build stronger relationships and create lasting memories with those you love', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
            { f: 'Finance', desc: 'Achieve financial freedom and build long-term wealth for your future', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-1m0-16V3m0 1L4 8v1h16V8l-8-4zM4 9v9h2V9M10 9v9h4V9m4 0v9h2V9M3 18h18v2H3v-2z" /></svg> },
            { f: 'Fitness', desc: 'Improve your physical health and maintain the energy to pursue your dreams', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-6 4 12 3-6h5" /></svg> },
            { f: 'Fun', desc: 'Enjoy the journey and celebrate successes with your team and community', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg> },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-5 text-center border border-gray-800 border-t-4 border-t-purple-accent hover:border-purple-accent/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-accent/10 transition-all duration-300">
              <span className="text-2xl mb-3 block text-purple-accent flex justify-center">{item.icon}</span>
              <h4 className="text-white font-bold mb-1">{item.f}</h4>
              <p className="text-gray-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Value props */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Unmatched Compensation and Real Ownership', text: "At GFI, your work is valued at the highest level. With compensation up to 133%, access to more than 25 A+ rated product providers, and true ownership opportunities, you're positioned to build wealth that lasts." },
            { title: 'A Culture That Brings Out Your Best', text: "We have a family-type culture built on having each other's back. Here, you'll find a winning and positive environment built on support, encouragement, and accountability. You don't have to figure it all out alone. You'll step into a simple, proven system designed to help you win, already expanding across 50+ countries worldwide." },
            { title: 'Recognition, Travel, and Mentorship', text: "At GFI, hard work never goes unnoticed. You'll be rewarded with leadership retreats, incentive trips, and exclusive access to millionaire mentors who have walked the path before you. And behind it all is an incredible leadership team committed to guiding you every step of the way." },
            { title: 'A Mission Bigger Than Ourselves', text: "We believe in business with a heart. Our top agents choose charities close to their hearts, and we provide dollar-for-dollar matching contributions. In 2024 alone, we donated over $250,000 to causes that matter. Through charitable work, diversity and inclusion, and a culture of service, we ensure that our success creates ripple effects of positive change throughout communities nationwide." },
            { title: 'Training That Creates Leaders', text: "You don't need to be an expert to succeed here. With our plug and play training model, inspirational marketing tools, and hands-on mentorship, you'll have everything you need to launch, grow, and lead with confidence." },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-gray-800 rounded-xl p-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-accent/10 transition-all duration-300">
              <h4 className="text-white font-semibold mb-3 text-lg">{item.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════ THREE PILLARS ════════ */}
      <Section>
        <Pill>Our Mission</Pill>
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Three Pillars of Impact</h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-center mb-12">
          GFI&apos;s mission is to make a significant impact on people&apos;s financial well-being through a holistic approach to financial empowerment. The focus is on closing the wealth gap and empowering everyone to build wealth and turn dreams into realities.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Build & Secure Wealth', sub: 'For Families & Individuals', icon: '▣' },
            { title: 'Creating a Movement', sub: 'Of Financial Professionals', icon: '◈' },
            { title: 'Turn Wealth Into Impact', sub: 'Creating Lasting Change', icon: '◉' },
          ].map((p, i) => (
            <div key={i} className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-gray-800 rounded-xl p-8 text-center hover:border-purple-accent/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-accent/10 transition-all duration-300">
              <span className="text-4xl mb-4 block">{p.icon}</span>
              <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
              <p className="text-gray-400">{p.sub}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════ 12 REASONS ════════ */}
      <Section className="bg-[#0d0d0d]">
        <Pill>Why Choose Us</Pill>
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">12 Reasons Why GFI × Team OOC</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div key={r.num} className="bg-white/5 border border-gray-800 rounded-xl p-6 hover:border-purple-accent/50 transition-colors group">
              <span className="text-purple-accent font-mono text-sm">{r.num}</span>
              <h4 className="text-white font-semibold mt-2 mb-1">{r.title}</h4>
              {r.desc && <p className="text-gray-500 text-sm">{r.desc}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* ════════ EXIT PLAN / POP ════════ */}
      <Section>
        <h3 className="text-2xl md:text-4xl font-bold mb-6">What&apos;s your exit plan?</h3>
        <p className="text-gray-400 max-w-3xl mx-auto text-center mb-8">
          Most people work their whole lives making someone else rich. We&apos;re doing something different.
        </p>
        <p className="text-gray-400 max-w-3xl mx-auto text-center mb-8">
          We went from 0 to 43,000+ people in 18 months. Entire teams are leaving their old companies to join us. Why? Because of our winning culture, technology and we let you earn ownership.
        </p>
        <div className="bg-gradient-to-r from-[#1a0a2e] to-[#0d0d0d] border border-purple-accent/30 rounded-2xl p-8 md:p-12 mb-8 glow-purple text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/nyse-signing.jpeg" alt="Partnership Signing Ceremony at NYSE" className="w-full max-w-[600px] mx-auto rounded-xl mb-6" />
          <p className="text-gray-300 text-base italic mb-6">
            New York Stock Exchange, August 20, 2025. Historic signing ceremony marking the official launch of our Partnership Ownership Program — where your success becomes your equity.
          </p>
          <p className="text-white text-xl font-semibold">
            When we go public in 2030, you won&apos;t be watching from the sidelines. You&apos;ll own a piece of what we built together.
          </p>
        </div>

        <h3 className="text-2xl font-bold mb-4">This Is About Your Future.</h3>
        <p className="text-gray-400 max-w-3xl mx-auto text-center mb-6">
          The Partnership Ownership Program gives you real ownership. Not just a paycheck. Real wealth that grows with the company. Think about it: Would you rather get paid to build someone else&apos;s dream? Or own a piece of something that could change your family&apos;s life forever?
        </p>
        <p className="text-purple-accent font-bold text-lg mb-4">
          The people joining us now will be the millionaires of tomorrow.
        </p>
        <p className="text-gray-400 max-w-3xl mx-auto text-center mb-8">
          This opportunity won&apos;t last forever. As we get closer to going public, ownership becomes harder to get. Your choice is simple: Keep making other people rich, or start building something that&apos;s yours.
        </p>
        <p className="text-white text-xl font-bold">What&apos;s it going to be?</p>
      </Section>

      {/* ════════ CULTURE VIDEOS ════════ */}
      <CultureVideos />

      {/* ════════ CARRIER NETWORK ════════ */}
      <Section className="bg-[#0d0d0d]">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Trusted Partnership Network</h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto text-center mb-12">
          We represent 25+ A+ rated financial institutions, giving you access to America&apos;s most trusted providers
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {carriers.map((c) => (
            <div key={c} className="bg-white/5 border border-gray-800 rounded-lg px-4 py-3 text-center text-sm text-gray-300 hover:border-purple-accent/50 hover:text-white transition-colors">
              {c}
            </div>
          ))}
        </div>
      </Section>

      {/* ════════ DIVISIONS ════════ */}
      <Section>
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">GFI&apos;s Specialized Divisions</h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto text-center mb-4">
          Find your perfect fit with divisions designed around your unique background and expertise
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto text-center mb-12">
          At GFI, we believe everyone has the potential for greatness — no matter your background or experience. We&apos;ve created 12+ specialized divisions so you can build on what you already know and leverage your unique strengths for maximum success.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {divisions.map((d) => (
            <div key={d.name} className="bg-white/5 border border-gray-800 rounded-xl p-5 text-center hover:border-purple-accent/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-accent/10 transition-all duration-300">
              <span className="text-white text-sm font-semibold">{d.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-white/5 border border-gray-800 rounded-xl p-6 text-center">
          <h4 className="text-white font-semibold mb-1">Find Your Perfect Division</h4>
          <p className="text-gray-400 text-sm">During your interview, we&apos;ll help you identify which division aligns with your background and goals for maximum success.</p>
        </div>
      </Section>

      {/* ════════ CLIENT SOLUTIONS ════════ */}
      <Section className="bg-[#0d0d0d]">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">How We Help Our Clients</h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto text-center mb-12">
          Comprehensive financial solutions designed to protect, grow, and preserve wealth for families and businesses across America
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Wealth Building & Protection', items: ['Tax-Advantaged Wealth Accumulation Strategies','Asset Protection & Qualified Plan Rollovers','Infinite Banking And Family Banks','Estate And Legacy Planning'] },
            { title: 'Insurance & Risk Management', items: ['Life Insurance, Living Benefits, & Final Expense','Mortgage Protection Term','Business Owner Strategies'] },
            { title: 'Retirement & Education Planning', items: ['Indexed Growth Roth IRA, SEP IRA, Traditional IRA','College Education Funds','Debt Management And Consolidation'] },
          ].map((cat, i) => (
            <div key={i} className="bg-white/5 border border-gray-800 rounded-xl p-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-accent/10 transition-all duration-300">
              <h4 className="text-white font-bold mb-4">{cat.title}</h4>
              <ul className="space-y-2">
                {cat.items.map((item, j) => (
                  <li key={j} className="text-gray-400 text-sm flex items-start gap-2">
                    <span className="text-purple-accent mt-1">•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-6 max-w-3xl">
          As a GFI agent, you&apos;ll be equipped to provide these comprehensive solutions, backed by industry-leading training and support from 25+ A+ rated financial institutions.
        </p>
      </Section>

      {/* ════════ SIX WAYS TO GET PAID ════════ */}
      <Section>
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Six Ways You Can Get Paid</h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto text-center mb-12">
          Multiple income streams designed to create lasting wealth and financial independence for you
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { n: 1, title: 'Personal Income', text: 'Direct commissions from your personal client sales with compensation up to 133% — among the highest in the industry.' },
            { n: 2, title: 'Agency Income', text: 'Build your own team and earn override commissions on their production as you develop into agency leadership.' },
            { n: 3, title: 'Expansion Income', text: 'Participate in territorial expansion opportunities as we grow into new markets and regions nationwide and internationally.' },
            { n: 4, title: 'Bonus Income', text: 'Performance-based bonuses, recognition rewards, and achievement incentives for hitting production milestones.' },
            { n: 5, title: 'Recurring & Renewal Income', text: 'Ongoing residual income from client renewals and recurring premium payments that build wealth over time.' },
            { n: 6, title: 'Equity Shares', text: 'Real ownership through our Partnership Ownership Program with plans to take the company public in 2030.' },
          ].map((item) => (
            <div key={item.n} className="bg-white/5 border border-gray-800 rounded-xl p-6 hover:border-purple-accent/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-accent/10 transition-all duration-300">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-accent text-white text-sm font-bold mb-3">{item.n}</span>
              <h4 className="text-white font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-gradient-to-r from-[#1a0a2e] to-transparent border border-purple-accent/30 rounded-xl p-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-accent/10 transition-all duration-300">
          <h4 className="text-white font-bold mb-2">Multiple Income Streams = Financial Security</h4>
          <p className="text-gray-400 text-sm">Unlike traditional jobs with single income sources, our compensation structure provides six different ways to build wealth, creating true financial independence and long-term security for you and your family.</p>
        </div>
      </Section>

      {/* ════════ WHERE DO YOU SEE YOURSELF ════════ */}
      <Section className="bg-[#0d0d0d]">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Where Do You See Yourself Starting?</h2>
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white/5 border border-gray-800 rounded-2xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Agent Path</h3>
            <p className="text-gray-400 text-sm leading-relaxed flex-1">
              Start earning immediately with our proven system. Enjoy flexible scheduling, multiple income streams through revenue sharing and referrals, and the freedom to build your career part-time or full-time. Perfect for ambitious professionals ready to control their financial future.
            </p>
          </div>
          <div className="flex items-center justify-center text-gray-600 text-lg font-bold md:hidden">OR</div>
          <div className="bg-white/5 border border-gray-800 rounded-2xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Agency Owner Path</h3>
            <p className="text-gray-400 text-sm leading-relaxed flex-1">
              Build a legacy business that works for you. Create your own agency on our platform, scale a team, and develop generational wealth you can pass to your children. For visionary entrepreneurs ready to own their destiny.
            </p>
          </div>
        </div>
        <div className="hidden md:flex justify-center -mt-4 mb-4">
          <span className="bg-purple-accent text-white text-sm font-bold px-4 py-1 rounded-full">OR</span>
        </div>
      </Section>

      {/* ════════ FAQ ════════ */}
      <Section>
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        <p className="text-gray-400 text-lg mb-12">Answers to common questions about this career opportunity</p>
        <div className="space-y-3 max-w-4xl">
          <FAQ q="What is the $199 platform fee for?"
            a={<>The $199 platform fee provides comprehensive access to our professional development ecosystem, including 20+ live training sessions per week, personalized coaching, ongoing mentorship, comprehensive product training, sales methodology, compliance education, ongoing professional and personal development, and all the tools and resources necessary to build a successful financial services career.<br/><br/>If you&apos;re not yet licensed, this investment also covers all study materials and courses needed for licensing, plus the background check requirement. This is comparable to other professional industries — for example, real estate professionals typically spend between $400–$1,000 total to get their license, plus ongoing monthly fees for errors and omissions insurance.</>}
          />
          <FAQ q="How will you learn the information?"
            a={<><strong>Phase 1:</strong> You get licensed and complete all required certifications.<br/><strong>Phase 2:</strong> We train you by having you shadow experienced agents as we sit down and help families achieve their financial goals.<br/><strong>Phase 3:</strong> You become independent and start meeting with clients on your own, with ongoing support and mentorship available whenever needed.</>}
          />
          <FAQ q="Where do I get clients from?"
            a="We don't give you clients — we give you something better. We give you a proven system to generate your own. You'll get access to lead generation systems, referral networks, and most importantly — we teach you how to create value so people want to work with you. You'll learn warm market development, social media strategies, networking systems, lead generation systems, and client referral programs. The most successful agents don't wait for leads to be handed to them — they create their own pipeline. That's real business ownership."
          />
          <FAQ q="This sounds too good to be true. What's the reality?"
            a="It's not too good to be true — it's serious work that requires dedication. You earn based on the value you bring to the marketplace. Success requires obtaining proper licensing, being coachable, and committing to continuous learning. This isn't a get-rich-quick scheme; it's a legitimate business opportunity that rewards those willing to invest the time and effort to master their craft."
          />
          <FAQ q="I have zero background in this — can I be successful?"
            a="Actually, that might be your biggest advantage. You don't have bad habits to unlearn. Some of our most successful agents started with zero experience because they followed our proven system exactly without trying to 'improve' it. We provide comprehensive training that assumes you're starting from scratch. Your success isn't determined by your background; it's determined by your commitment to learning and your willingness to be coached."
          />
          <FAQ q="What other investments will I need to make?"
            a="Beyond the platform fee, you'll need reliable internet connection and a computer. You'll also need to obtain proper licensing (varies by state) and E&O Insurance (Errors and Omissions) required at $35/month from GFI. For your first year in business, you should expect approximately $300–700 in total expenses as a ballpark estimate."
          />
          <FAQ q="How much time should I expect to invest?"
            a="Getting started requires 5–15 hours per week for training, licensing, and building your initial client relationships. If you're serious about building a substantial income, expect to dedicate 40–60 hours per week like any professional business owner. Your time investment directly correlates with your potential earnings and long-term success."
          />
        </div>
      </Section>

      {/* ════════ CTA / APPLICATION ════════ */}
      <Section id="cta" className="bg-[#0d0d0d]">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Ready to Begin?</h2>
          <p className="text-gray-400 text-lg mb-12">Take the next step toward your financial services career</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 border border-gray-800 rounded-2xl p-8 md:p-10">
            <h3 className="text-xl font-bold text-white mb-8 text-center">Application Process</h3>
            <ol className="space-y-6">
              {[
                'Watch the company overview video above to understand our opportunity',
                'Review all requirements and ensure you qualify',
                'Contact the representative who shared this opportunity',
                'Schedule your interview to discuss next steps',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-accent text-white text-sm font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-gray-300 text-sm leading-relaxed pt-1.5">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 bg-purple-accent/20 border border-purple-accent/30 rounded-xl p-5">
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-purple-accent font-bold">Important:</span> Contact the representative who shared this opportunity with you to schedule your interview. They will guide you through the application process and answer any questions you may have.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ════════ STICKY FLOATING BUTTONS ════════ */}
      <StickyButtons />

      {/* ════════ FOOTER / DISCLAIMER ════════ */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h4 className="text-white font-semibold mb-4">Income Disclaimer</h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Important: Income representations are aspirational statements only. Success depends on individual skills, effort, time investment, and market conditions. Examples shown are not promises or guarantees of earnings. Your success depends entirely on your effort, dedication, and market factors. This is not a &quot;get rich quick&quot; scheme — results require consistent work and professional commitment.
          </p>
          <div className="mt-8 text-gray-600 text-xs">
            © {new Date().getFullYear()} GFI × Team OOC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
