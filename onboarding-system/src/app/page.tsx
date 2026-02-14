import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gary Cosby | Life Insurance & Financial Services | OOC Unlimited',
  description: 'Protecting families and building futures. Personalized life insurance solutions — IUL, Whole Life, Term Life. Mission before commission.',
  openGraph: {
    title: 'Gary Cosby | Life Insurance & Financial Services',
    description: 'Protecting families and building futures through personalized life insurance and financial services.',
    type: 'website',
  },
};

const services = [
  {
    title: 'Indexed Universal Life (IUL)',
    desc: 'Build cash value tied to market index performance with downside protection. Ideal for families seeking growth potential with a safety net — tax-advantaged wealth building for the long term.',
    icon: '📈',
    for: 'Best for: Long-term wealth builders',
  },
  {
    title: 'Whole Life Insurance',
    desc: 'Guaranteed cash value growth and lifetime coverage with predictable premiums. A foundation of certainty for your family\'s financial future that never expires.',
    icon: '🛡️',
    for: 'Best for: Families seeking guaranteed protection',
  },
  {
    title: 'Term Life Insurance',
    desc: 'Affordable, straightforward coverage for a set period — 10, 20, or 30 years. Maximum protection when your family needs it most, at a price that fits any budget.',
    icon: '📋',
    for: 'Best for: Young families & budget-conscious',
  },
];

const values = [
  { title: 'Personalized Guidance', desc: 'Every family is different. Your plan should be too. We take time to understand your unique situation before recommending anything.', icon: '🤝' },
  { title: 'No-Pressure Approach', desc: 'Education first, always. You\'ll never be pushed into a product. We believe informed families make the best decisions.', icon: '💬' },
  { title: 'Licensed & Experienced', desc: 'Access to 30+ A-rated carriers means we find the right fit — not just the one that pays us the most.', icon: '✅' },
  { title: 'Mission-Driven', desc: 'Born from personal loss, built on purpose. Every policy we write protects a family from the unthinkable.', icon: '❤️' },
];

const testimonials = [
  { quote: "Gary took the time to explain everything — no pressure, no jargon. For the first time, I actually understood what I was buying and why it mattered for my family.", name: "Marcus T.", context: "Father of 3, first-time policyholder" },
  { quote: "After my husband passed, I saw firsthand what happens without coverage. Gary made sure my kids would never face that. He genuinely cares.", name: "Angela R.", context: "Single mother, IUL client" },
  { quote: "I thought life insurance was just an expense. Gary showed me how IUL could be a wealth-building tool. Complete game-changer for our family's future.", name: "David & Kim P.", context: "Young couple, IUL clients" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span className="text-purple-400">Gary Cosby</span> <span className="text-zinc-400 font-normal text-sm">| OOC Unlimited</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#why" className="hover:text-white transition-colors">Why Gary</a>
            <Link href="/join" className="hover:text-white transition-colors">Join Our Team</Link>
            <a href="#" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Book a Consultation
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">OOC Unlimited — Life Insurance & Financial Services</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Protecting Families.<br />
            <span className="text-purple-400">Building Futures.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your family deserves a financial safety net designed with care, not a sales pitch. 
            Personalized life insurance solutions that protect what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg shadow-purple-600/20">
              Book a Free Consultation
            </a>
            <Link href="/join" className="border border-zinc-700 hover:border-purple-400 text-zinc-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors">
              Join Our Team →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-20 md:py-28 px-6 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4 text-center">About Gary</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">Mission Before Commission</h2>
          <div className="text-zinc-400 text-lg leading-relaxed space-y-6 max-w-3xl mx-auto">
            <p>
              Gary Cosby Jr. didn&apos;t start in financial services. He spent years in retail management at Best Buy, 
              building teams and hitting targets. But everything changed when his father passed away — without life insurance.
            </p>
            <p>
              Gary watched his family scramble to cover final expenses, navigate financial uncertainty, and deal with 
              the kind of stress no grieving family should face. That experience lit a fire that hasn&apos;t gone out.
            </p>
            <p>
              Today, Gary leads OOC Unlimited with one mission: make sure no family goes through what his did. 
              Every conversation starts with understanding, not selling. Every recommendation is built on what&apos;s right 
              for the family — not what pays the highest commission.
            </p>
            <p className="text-white font-semibold text-xl text-center pt-4">
              &ldquo;Mission before commission — always.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4 text-center">Services</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Protection That Fits Your Life</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto text-center mb-12">
            Every family&apos;s needs are different. We offer multiple solutions to find the right fit.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-white/5 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <span className="text-4xl mb-4">{s.icon}</span>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-1">{s.desc}</p>
                <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">{s.for}</p>
                <a href="#" className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors">
                  Learn more & book a call →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY GARY ═══ */}
      <section id="why" className="py-20 md:py-28 px-6 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4 text-center">Why Work With Gary</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">A Different Kind of Agent</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6">
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4 text-center">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">What Families Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/5 border border-zinc-800 rounded-2xl p-8">
                <p className="text-zinc-300 italic leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-zinc-500 text-sm">{t.context}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ JOIN THE TEAM ═══ */}
      <section className="py-20 md:py-28 px-6 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">Careers</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Build a Career That Matters?</h2>
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            We&apos;re building a team of licensed professionals who believe in protecting families — not just closing deals. 
            Up to 133% compensation, 30+ carriers, real ownership, and a mission worth waking up for.
          </p>
          <Link href="/join" className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg shadow-purple-600/20">
            Learn More About Joining →
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="text-lg font-bold mb-2">OOC Unlimited LLC</p>
              <p className="text-zinc-500 text-sm italic">&ldquo;Mission before commission.&rdquo;</p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <Link href="/join" className="hover:text-white transition-colors">Join Our Team</Link>
            </div>
            <div className="text-sm text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Book a Consultation</a>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8">
            <p className="text-xs text-zinc-600 leading-relaxed">
              © {new Date().getFullYear()} OOC Unlimited LLC. All rights reserved. 
              Life insurance products are offered through licensed agents. Policy terms, conditions, and availability 
              vary by state and carrier. This website is for informational purposes only and does not constitute 
              financial, legal, or tax advice. Guarantees are based on the claims-paying ability of the issuing 
              insurance company. OOC Unlimited LLC is not a registered investment advisor. Consult a qualified 
              professional for advice specific to your situation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
