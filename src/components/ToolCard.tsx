import Link from 'next/link';

interface ToolRating { source: string; reviewCount: number; score: number; }
interface ToolData {
  id: string; name: string; description: string; category: string;
  pricingTier: 'free' | 'starter' | 'professional' | 'enterprise';
  bestFor: string[]; ratings: ToolRating[];
}

const TIER: Record<string, { color: string; bg: string }> = {
  free:         { color: '#059669', bg: '#ECFDF5' },
  starter:      { color: '#2563EB', bg: '#EFF6FF' },
  professional: { color: '#7C3AED', bg: '#F5F3FF' },
  enterprise:   { color: '#B45309', bg: '#FFFBEB' },
};

export function ToolCard({ tool }: { tool: ToolData }) {
  const avg = tool.ratings.length > 0
    ? (tool.ratings.reduce((s, r) => s + r.score, 0) / tool.ratings.length).toFixed(1)
    : null;
  const t = TIER[tool.pricingTier] ?? TIER.professional;
  return (
    <Link href={`/tools/${tool.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div className="card" style={{ padding: 22, height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{tool.name}</h3>
          {avg && <span style={{ fontSize: 13, fontWeight: 600, color: '#D97706', marginLeft: 8, whiteSpace: 'nowrap' }}>⭐ {avg}</span>}
        </div>
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-light)', padding: '2px 8px', borderRadius: 4 }}>{tool.category}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, flex: 1, marginBottom: 14 }}>{tool.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{tool.bestFor.slice(0, 2).join(', ')}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: t.color, background: t.bg, padding: '3px 8px', borderRadius: 99 }}>{tool.pricingTier}</span>
        </div>
      </div>
    </Link>
  );
}
