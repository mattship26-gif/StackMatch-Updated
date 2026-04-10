import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'StackMatch — Find the Right Tools for Your Team',
  description: 'StackMatch is the free, honest guide to 200+ business tools. Find the right stack for your industry, team size, and budget. No affiliate links. No outdated lists.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
          <nav style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--text-1)', letterSpacing: '-0.03em' }}>
                Stack<span style={{ color: 'var(--accent)' }}>Match</span>
              </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
              {[
                { href: '/industry', label: 'By Industry' },
                { href: '/stack-builder', label: 'Stack Builder' },
                { href: '/migration', label: 'Should I Switch?' },
                { href: '/tools', label: 'All Tools' },
                { href: '/categories', label: 'Categories' },
                { href: '/submit', label: 'Submit a Tool' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ padding: '6px 12px', fontSize: 14, fontWeight: 500, color: 'var(--text-2)', textDecoration: 'none', borderRadius: 6, transition: 'background 0.15s, color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-2)'; }}>
                  {label}
                </Link>
              ))}
            </div>

            <Link href="/chat" style={{ background: 'var(--accent)', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.01em', transition: 'opacity 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}>
              AI Advisor
            </Link>
          </nav>
        </header>

        <main>{children}</main>

        <footer style={{ background: 'var(--text-1)', color: '#fff', marginTop: 80 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em', marginBottom: 12 }}>
                  Stack<span style={{ color: '#818CF8' }}>Match</span>
                </div>
                <p style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 1.6 }}>
                  Honest, context-aware tool recommendations. No affiliate links. No paid placements.
                </p>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#71717A', marginBottom: 14 }}>Find Tools</div>
                {[['/', 'Home'], ['/categories', 'Categories'], ['/industry', 'By Industry'], ['/tools', 'All Tools'], ['/quiz', 'Take the Quiz']].map(([href, label]) => (
                  <Link key={href} href={href} style={{ display: 'block', fontSize: 14, color: '#A1A1AA', textDecoration: 'none', marginBottom: 8, transition: 'color 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#A1A1AA'; }}>
                    {label}
                  </Link>
                ))}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#71717A', marginBottom: 14 }}>Make Decisions</div>
                {[['/stack-builder', 'Stack Builder'], ['/migration', 'Should I Switch?'], ['/chat', 'AI Advisor'], ['/submit', 'Submit a Tool']].map(([href, label]) => (
                  <Link key={href} href={href} style={{ display: 'block', fontSize: 14, color: '#A1A1AA', textDecoration: 'none', marginBottom: 8, transition: 'color 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#A1A1AA'; }}>
                    {label}
                  </Link>
                ))}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#71717A', marginBottom: 14 }}>Industries</div>
                {[['/industry/accounting-finance', 'Accounting & Finance'], ['/industry/legal', 'Legal'], ['/industry/healthcare', 'Healthcare'], ['/industry/saas-tech', 'SaaS & Tech'], ['/industry', 'View all →']].map(([href, label]) => (
                  <Link key={href} href={href} style={{ display: 'block', fontSize: 14, color: label === 'View all →' ? '#818CF8' : '#A1A1AA', textDecoration: 'none', marginBottom: 8, transition: 'color 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = label === 'View all →' ? '#818CF8' : '#A1A1AA'; }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #27272A', paddingTop: 24, textAlign: 'center', fontSize: 13, color: '#52525B' }}>
              No affiliate links. No paid placements. Just what works.
            </div>
          </div>
        </footer>

        <style>{`
          .hidden-mobile { display: flex; }
          @media (max-width: 768px) { .hidden-mobile { display: none; } }
        `}</style>
      </body>
    </html>
  );
}
