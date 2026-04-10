'use client';
import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Message { role: 'user' | 'assistant'; content: string; }

const SUGGESTED = [
  "We're a 30-person SaaS company still in spreadsheets. Where do we start?",
  "Law firm, contracts are a mess. Best contract management tool?",
  "We're outgrowing QuickBooks. What should we migrate to?",
  "Need HIPAA-compliant tools for a 50-person healthcare company.",
  "Our team hates Salesforce. Better CRM for 20-person sales team?",
  "Best stack for a 15-person marketing agency?",
];

function ChatContent() {
  const searchParams = useSearchParams();
  const initialContext = searchParams.get('context') || '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  // Track whether user is near bottom
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }, []);

  // Only auto-scroll if user is near bottom
  useEffect(() => {
    if (isNearBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamingContent]);

  // Always scroll on new user messages
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === 'user') {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      isNearBottom.current = true;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, systemContext: initialContext }),
      });
      if (!res.ok) {
        const err = await res.json();
        setMessages(p => [...p, { role: 'assistant', content: `Error: ${err.error || 'Check your ANTHROPIC_API_KEY in Vercel settings.'}` }]);
        setIsStreaming(false);
        return;
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          const data = line.replace('data: ', '');
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.delta?.text || parsed?.choices?.[0]?.delta?.content || '';
            if (delta) { full += delta; setStreamingContent(full); }
          } catch {}
        }
      }
      setMessages(p => [...p, { role: 'assistant', content: full }]);
      setStreamingContent('');
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 2 }}>AI Tool Advisor</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Describe your situation · Get specific, honest recommendations</p>
        </div>
        <Link href="/quiz" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', padding: '7px 14px', border: '1px solid var(--accent-mid)', borderRadius: 7 }}>
          Prefer a quiz? →
        </Link>
      </div>

      {/* Messages */}
      <div ref={containerRef} onScroll={handleScroll} style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {messages.length === 0 && !isStreaming && (
            <div style={{ textAlign: 'center', paddingTop: 24 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
              <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>What are you trying to figure out?</h2>
              <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 36, maxWidth: 440, margin: '0 auto 36px' }}>
                Tell me about your company, your current tools, and what's not working. I'll give you honest, specific recommendations.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                {SUGGESTED.map((p, i) => (
                  <button key={i} onClick={() => sendMessage(p)} style={{ textAlign: 'left', padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-2)', cursor: 'pointer', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.15s, box-shadow 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-mid)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(79,70,229,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: messages.length > 0 ? 0 : 32 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '12px 16px',
                  background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-1)',
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.65, margin: 0 }}>{msg.content}</pre>
                </div>
              </div>
            ))}

            {isStreaming && streamingContent && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ maxWidth: '80%', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.65, margin: 0, color: 'var(--text-1)' }}>{streamingContent}</pre>
                </div>
              </div>
            )}

            {isStreaming && !streamingContent && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ borderRadius: '18px 18px 18px 4px', padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 1, 2].map(n => (
                      <span key={n} className="bounce-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-3)', display: 'inline-block' }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '16px 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 10 }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Describe your company, industry, current tools, and what's not working..."
            rows={2} disabled={isStreaming}
            style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', fontSize: 14, resize: 'none', fontFamily: "'DM Sans', sans-serif", color: 'var(--text-1)', background: 'var(--bg)', outline: 'none', lineHeight: 1.5, transition: 'border-color 0.15s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
          />
          <button onClick={() => sendMessage(input)} disabled={isStreaming || !input.trim()}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: isStreaming || !input.trim() ? 0.5 : 1, transition: 'opacity 0.15s', flexShrink: 0 }}>
            {isStreaming ? '...' : 'Send'}
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', marginTop: 8 }}>Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ padding: 48, textAlign: 'center', color: 'var(--text-2)' }}>Loading advisor...</div>}>
      <ChatContent />
    </Suspense>
  );
}
