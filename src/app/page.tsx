import Link from 'next/link';
import { getAllCategories, getTopRated, getAllTools } from '@/lib/toolsService';
import { industries } from '@/data/industries';
import { EmailCapture } from '@/components/EmailCapture';

const TRENDING = [
  { id: 'cursor',            name: 'Cursor',          tag: 'AI Coding',       heat: '🔥 Trending' },
  { id: 'clay',              name: 'Clay',            tag: 'AI Sales',        heat: '🔥 Trending' },
  { id: 'apollo-io',         name: 'Apollo.io',       tag: 'Outreach',        heat: '📈 Growing' },
  { id: 'fireflies-ai',      name: 'Fireflies.ai',    tag: 'AI Meetings',     heat: '🔥 Trending' },
  { id: 'perplexity-business', name: 'Perplexity',    tag: 'AI Research',     heat: '🚀 Hot' },
  { id: 'windsurf',          name: 'Windsurf',        tag: 'AI IDE',          heat: '🆕 New' },
  { id: 'instantly-ai',      name: 'Instantly.ai',    tag: 'Cold Email',      heat: '📈 Growing' },
  { id: 'airtable',          name: 'Airtable',        tag: 'No-Code',         heat: '⭐ Staff Pick' },
];

export default function HomePage() {
  const categories = getAllCategories();
  const featuredTools = getTopRated(undefined, 6);
  const totalTools = getAllTools().length;

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'var(--text-1)', color: '#fff', padding: '88px 24px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -200, right: -100, width: 600, height: 600, background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 99, padding: '5px 14px', marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818CF8', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#C7D2FE', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {totalTools}+ tools reviewed · Free forever · No affiliate links
            </span>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.04em', marginBottom: 24, maxWidth: 820, color: '#818CF8' }}>
            The Decision Engine for<br />
            <span style={{ color: '#818CF8' }}>Business Software</span>
          </h1>
          <p style={{ fontSize: 18, color: '#A1A1AA', lineHeight: 1.7, marginBottom: 44, maxWidth: 560 }}>
            Not "top 10" affiliate lists. Context-aware recommendations for your industry, team size, current stack, and budget. Free forever.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 52 }}>
            <Link href="/chat" style={{ background: 'var(--accent)', color: '#fff', padding: '14px 30px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.01em' }}>
              Ask AI Advisor →
            </Link>
            <Link href="/quiz" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '14px 30px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Take the Quiz
            </Link>
            <Link href="/stack-builder" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#A1A1AA', padding: '14px 30px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Build Your Stack
            </Link>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            {[
              { value: `${totalTools}+`, label: 'Tools reviewed' },
              { value: `${categories.length}`, label: 'Categories' },
              { value: '10', label: 'Industries' },
              { value: '100%', label: 'Free to use' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#71717A', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Tools */}
      <section style={{ padding: '72px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What everyone's evaluating right now</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Trending AI Tools</h2>
            </div>
            <Link href="/tools" style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>Browse all {totalTools} →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {TRENDING.map(t => (
              <Link key={t.id} href={`/tools/${t.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3, letterSpacing: '-0.01em' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.tag}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-light)', padding: '3px 8px', borderRadius: 99, whiteSpace: 'nowrap', marginLeft: 8 }}>{t.heat}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Power Features */}
      <section style={{ padding: '80px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>
              Built to help you decide, not just browse
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 480, margin: '0 auto' }}>
              Four tools that go beyond a directory.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[
              { href: '/stack-builder', emoji: '🧩', title: 'Stack Builder', badge: 'Popular', bc: '#059669', bb: '#ECFDF5', desc: "Add your current tools. See compatibility, conflicts, and what's missing — with real cost estimates." },
              { href: '/industry', emoji: '🏭', title: 'By Industry', badge: 'New', bc: '#059669', bb: '#ECFDF5', desc: 'Curated stacks for 10 industries with compliance filters, tools to avoid, and sizing guidance.' },
              { href: '/chat', emoji: '🤖', title: 'AI Advisor', badge: 'AI', bc: '#4F46E5', bb: '#EEF2FF', desc: 'Describe your situation in plain English. Get specific, honest recommendations — no fluff.' },
              { href: '/migration', emoji: '⚖️', title: 'Should I Switch?', badge: 'Useful', bc: '#D97706', bb: '#FFFBEB', desc: 'Calculate the real cost of migrating — training, data migration, integrations, break-even date.' },
            ].map(f => (
              <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 26, height: '100%', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 34 }}>{f.emoji}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: f.bc, background: f.bb, padding: '3px 8px', borderRadius: 99 }}>{f.badge}</span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section style={{ padding: '0 24px 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>Browse by Industry</h2>
              <p style={{ fontSize: 15, color: 'var(--text-2)' }}>Compliance-aware stacks built for your world</p>
            </div>
            <Link href="/industry" style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>All 10 →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(176px, 1fr))', gap: 12 }}>
            {industries.slice(0, 5).map(ind => (
              <Link key={ind.slug} href={`/industry/${ind.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '18px 14px', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{ind.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3, letterSpacing: '-0.01em' }}>{ind.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{ind.stacks.length} stacks</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section style={{ padding: '0 24px 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <EmailCapture
            intent="homepage"
            headline="Get your personalized stack recommendations"
            subline="Tell us your industry and team size and we'll send you a curated list of the exact tools that fit your situation. Free, no spam."
          />
        </div>
      </section>

      {/* Why different */}
      <section style={{ padding: '80px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em' }}>Why StackMatch exists</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40 }}>
            {[
              { emoji: '🎯', title: 'Context over lists', desc: "What works for a 5-person startup isn't what works for a 500-person company. We tell you when a tool is right — and when it isn't." },
              { emoji: '💰', title: 'Real costs, honestly', desc: "Not just '$29/month' but what you'll actually pay with your team size, add-ons, and implementation. No surprises." },
              { emoji: '🚫', title: 'Zero affiliate links', desc: "We're not paid when you click. Rankings are based on fit for your situation. We make our business model on talent and vendor partnerships, not click-throughs." },
              { emoji: '🤝', title: 'Free forever', desc: "StackMatch is free for every user, always. The community trust we build is the foundation of everything." },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center', padding: '0 12px' }}>
                <div style={{ fontSize: 38, marginBottom: 14 }}>{item.emoji}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top rated */}
      <section style={{ padding: '80px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Top-Rated Tools</h2>
            <Link href="/tools" style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>Browse all {totalTools} →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {featuredTools.map(tool => {
              const avg = tool.ratings.length > 0 ? (tool.ratings.reduce((s, r) => s + r.score, 0) / tool.ratings.length).toFixed(1) : null;
              const tc: Record<string, string> = { free: '#059669', starter: '#2563EB', professional: '#7C3AED', enterprise: '#B45309' };
              const tb: Record<string, string> = { free: '#ECFDF5', starter: '#EFF6FF', professional: '#F5F3FF', enterprise: '#FFFBEB' };
              return (
                <Link key={tool.id} href={`/tools/${tool.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: 22, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>{tool.name}</h3>
                      <span style={{ fontSize: 10, fontWeight: 700, color: tc[tool.pricingTier], background: tb[tool.pricingTier], padding: '3px 8px', borderRadius: 99, marginLeft: 8, whiteSpace: 'nowrap' }}>{tool.pricingTier}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-light)', display: 'inline-block', padding: '2px 8px', borderRadius: 4, marginBottom: 10 }}>{tool.category}</div>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, flex: 1, marginBottom: 14 }}>{tool.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Best for: {tool.bestFor.join(', ')}</span>
                      {avg && <span style={{ fontSize: 13, fontWeight: 600, color: '#D97706' }}>⭐ {avg}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Submit CTA */}
      <section style={{ padding: '72px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Know a tool that belongs here?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 28 }}>
            StackMatch is community-curated. If you know a tool that would genuinely help other professionals, submit it. Every tool is reviewed by our team before going live.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/submit" style={{ background: 'var(--accent)', color: '#fff', padding: '12px 26px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Submit a Tool →
            </Link>
            <Link href="/chat" style={{ border: '1px solid var(--border)', color: 'var(--text-1)', padding: '12px 26px', borderRadius: 9, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Ask AI Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* AI CTA */}
      <section style={{ padding: '80px 24px', background: 'var(--accent)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 14 }}>
            Not sure where to start?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.65 }}>
            Tell our AI advisor about your company and what's not working. Get specific, honest recommendations in 30 seconds.
          </p>
          <Link href="/chat" style={{ display: 'inline-block', background: '#fff', color: 'var(--accent)', padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 800, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}>
            Chat with AI Advisor →
          </Link>
        </div>
      </section>
    </div>
  );
}
