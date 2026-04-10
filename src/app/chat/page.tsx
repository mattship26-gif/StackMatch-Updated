'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  "I'm a 30-person SaaS company still tracking everything in spreadsheets. Where do we start?",
  "We're a law firm and our contracts are a mess. What's the best contract management tool?",
  "We're on QuickBooks but outgrowing it. What should we migrate to?",
  "I need HIPAA-compliant tools for a 50-person healthcare company. What's safe to use?",
  "We use Salesforce but the team hates it. Is there a better CRM for a 20-person sales team?",
  "What's the best stack for a marketing agency with 15 people?",
];

function ChatContent() {
  const searchParams = useSearchParams();
  const initialContext = searchParams.get('context') || '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          systemContext: initialContext,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: `Error: ${err.error || 'Something went wrong. Check your API key in Vercel settings.'}` },
        ]);
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          const data = line.replace('data: ', '');
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.delta?.text || parsed?.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullContent += delta;
              setStreamingContent(fullContent);
            }
          } catch {}
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
      setStreamingContent('');
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please try again.' },
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const displayedStreamContent = streamingContent || (isStreaming ? '...' : '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Tool Advisor</h1>
            <p className="text-sm text-slate-500">Describe your situation. Get specific recommendations.</p>
          </div>
          <Link href="/quiz" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Prefer a quiz? →
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Welcome */}
          {messages.length === 0 && !isStreaming && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                What are you trying to figure out?
              </h2>
              <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                Tell me about your company, your current tools, and what's not working.
                I'll give you honest, specific recommendations — no affiliate fluff.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-left">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition text-sm text-slate-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message thread */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
              }`}>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.content}</pre>
              </div>
            </div>
          ))}

          {/* Streaming */}
          {isStreaming && displayedStreamContent && (
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
                  {displayedStreamContent}
                </pre>
              </div>
            </div>
          )}

          {isStreaming && !displayedStreamContent && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your company size, industry, current tools, and what's not working..."
            rows={2}
            disabled={isStreaming}
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isStreaming || !input.trim()}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
          >
            {isStreaming ? '...' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-600">Loading advisor...</div>}>
      <ChatContent />
    </Suspense>
  );
}
