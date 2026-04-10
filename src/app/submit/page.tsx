'use client';
import { useState } from 'react';
import Link from 'next/link';
import { getAllCategories } from '@/lib/toolsService';

const CATEGORIES = [
  'AI Coding & Developer Tools', 'AI Writing & Content Generation', 'AI Image & Creative Generation',
  'AI Meeting & Productivity', 'AI Sales & Outreach Automation', 'AI Customer Service & Chatbots',
  'AI Data Analysis & Research', 'Generative AI & Automation', 'No-Code / Low-Code Platforms',
  'CRM & Client Management', 'Project Management', 'HR & Talent Management',
  'Marketing Automation', 'Product Analytics', 'Business Intelligence & Analytics',
  'Customer Service & Support', 'Communication & Collaboration', 'E-Commerce Platforms',
  'Cloud Infrastructure & DevOps', 'API & Integration Platforms', 'Cybersecurity',
  'Accounting & Finance', 'Contract Management', 'Document Management',
  'Learning & Development', 'SEO & Digital Marketing', 'Social Media Management',
  'Other',
];

export default function SubmitToolPage() {
  const [form, setForm] = useState({ name: '', website: '', category: '', description: '', pricing: '', whyValuable: '', submittedBy: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = { width: '100%', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: 'var(--text-1)', background: 'var(--surface)', outline: 'none', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" };

  if (status === 'success') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>Thank you!</h1>
          <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 28 }}>
            Your submission has been received. We review every tool manually and aim to add approved tools within 72 hours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/" style={{ background: 'var(--accent)', color: '#fff', padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Back to StackMatch</Link>
            <button onClick={() => { setStatus('idle'); setForm({ name: '', website: '', category: '', description: '', pricing: '', whyValuable: '', submittedBy: '' }); }}
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-1)', padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Submit another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Link href="/" style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 32 }}>← Back to StackMatch</Link>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>Submit a Tool</h1>
          <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7 }}>
            Know a tool that belongs on StackMatch? Submit it and help the community discover it.
            Every submission is reviewed by our team before going live.
          </p>
        </div>

        {/* Community note */}
        <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 10, padding: '16px 20px', marginBottom: 36, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🤝</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginBottom: 3 }}>Community-driven</p>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
              StackMatch is free forever and community-curated. Tool vendors do not pay for placement — submissions are evaluated solely on usefulness to the community.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Tool Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Notion" required style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
            </div>
            <div>
              <label style={labelStyle}>Website URL *</label>
              <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://" required style={inputStyle} type="url"
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} required
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              <option value="">Select a category...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>One-line description *</label>
            <input value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="e.g. AI-powered project management for engineering teams" required maxLength={150} style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{form.description.length}/150 characters</p>
          </div>

          <div>
            <label style={labelStyle}>Pricing summary</label>
            <input value={form.pricing} onChange={e => set('pricing', e.target.value)}
              placeholder="e.g. Free tier. Pro: $20/user/month. Enterprise: custom." style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
          </div>

          <div>
            <label style={labelStyle}>Why should this be on StackMatch? *</label>
            <textarea value={form.whyValuable} onChange={e => set('whyValuable', e.target.value)}
              placeholder="What makes this tool valuable? Who is it best for? What problem does it solve better than alternatives?"
              required rows={4}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
          </div>

          <div>
            <label style={labelStyle}>Your email (optional — for follow-up)</label>
            <input value={form.submittedBy} onChange={e => set('submittedBy', e.target.value)}
              placeholder="your@email.com" type="email" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Only used to notify you when the tool goes live.</p>
          </div>

          {status === 'error' && (
            <p style={{ fontSize: 14, color: 'var(--danger)', padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8 }}>
              Submission failed. Please try again.
            </p>
          )}

          <button type="submit" disabled={status === 'loading'}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: status === 'loading' ? 0.7 : 1, marginTop: 8 }}>
            {status === 'loading' ? 'Submitting...' : 'Submit Tool →'}
          </button>
        </form>
      </div>
    </div>
  );
}
