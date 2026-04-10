'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [q, setQ] = useState('');
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q)}`);
  };
  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
      <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>⌕</span>
      <input
        type="text" value={q} onChange={e => setQ(e.target.value)}
        placeholder="Search tools, categories, or use cases..."
        style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '14px 52px 14px 46px', fontSize: 15, color: '#fff', fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s, background 0.2s' }}
        onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.borderColor = 'rgba(129,140,248,0.5)'; }}
        onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
      />
      <button type="submit" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Search
      </button>
    </form>
  );
}
