import Link from 'next/link';
import { industries } from '@/data/industries';

export default function IndustriesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14 }}>Find Tools for Your Industry</h1>
          <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 540, margin: '0 auto' }}>
            A 50-person law firm and a 50-person e-commerce company have completely different needs.
            Get curated stacks — including compliance requirements.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {industries.map(ind => (
            <Link key={ind.slug} href={`/industry/${ind.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: 28, cursor: 'pointer', height: '100%' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{ind.emoji}</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{ind.name}</h2>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>{ind.tagline}</p>
                {ind.complianceRequirements.filter(c => c.critical).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {ind.complianceRequirements.filter(c => c.critical).slice(0, 3).map(r => (
                      <span key={r.name} style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', padding: '2px 8px', borderRadius: 99 }}>{r.name}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{ind.stacks.length} curated stacks</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 48, background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 14, padding: '36px 32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Don't see your industry?</h3>
          <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 20 }}>Use our AI advisor to describe your situation and get tailored recommendations.</p>
          <Link href="/chat" style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Chat with AI Advisor →
          </Link>
        </div>
      </div>
    </div>
  );
}
