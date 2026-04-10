'use client';
import { useState } from 'react';

interface Props {
  intent?: string;
  context?: string;
  headline?: string;
  subline?: string;
  placeholder?: string;
  compact?: boolean;
}

export function EmailCapture({
  intent = 'general',
  context = '',
  headline = 'Get personalized stack recommendations',
  subline = 'We\'ll send you a curated list for your industry and team size. No spam.',
  placeholder = 'you@company.com',
  compact = false,
}: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, intent, context }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: compact ? '16px 0' : '24px 0' }}>
        <div style={{ fontSize: compact ? 20 : 28, marginBottom: 8 }}>✅</div>
        <p style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: compact ? 14 : 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          You're on the list!
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
          We'll send you recommendations shortly.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder={placeholder} required
          style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: 'var(--text-1)', background: 'var(--surface)', outline: 'none' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
        />
        <button type="submit" disabled={status === 'loading'}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: status === 'loading' ? 0.7 : 1, whiteSpace: 'nowrap' }}>
          {status === 'loading' ? '...' : 'Get Updates'}
        </button>
      </form>
    );
  }

  return (
    <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 14, padding: '32px 28px', textAlign: 'center' }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Free · No spam · Unsubscribe anytime
      </p>
      <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {headline}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20, lineHeight: 1.6 }}>{subline}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 420, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder={placeholder} required
          style={{ flex: '1 1 220px', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: 'var(--text-1)', background: 'var(--surface)', outline: 'none' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
        />
        <button type="submit" disabled={status === 'loading'}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: status === 'loading' ? 0.7 : 1 }}>
          {status === 'loading' ? 'Saving...' : 'Get Recommendations →'}
        </button>
      </form>
      {status === 'error' && (
        <p style={{ fontSize: 13, color: 'var(--danger)', marginTop: 10 }}>Something went wrong. Try again.</p>
      )}
    </div>
  );
}
