import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, systemContext } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured. Add it to your Vercel environment variables.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert AI tool advisor for a platform called ToolFinder. Your job is to help professionals find the right software tools for their specific workflows, company size, industry, and budget.

You have deep knowledge of:
- Enterprise software (ERP, CRM, HRM, project management, accounting, legal tech, healthcare IT)
- Integration patterns between tools
- Compliance requirements by industry (HIPAA, SOX, GDPR, FERPA, etc.)
- Realistic pricing and total cost of ownership
- Migration costs and complexity
- Tool combinations that work well together vs. overlap or conflict

Your approach:
1. Ask clarifying questions if you don't have enough context (company size, industry, current tools, budget, team size)
2. Give specific, opinionated recommendations — not wishy-washy "it depends" answers
3. Always explain WHY a tool is right for their situation, not just that it's popular
4. Flag compliance requirements proactively
5. Warn about tools that commonly disappoint in their situation
6. Be honest about costs — don't just say "pricing available on request"
7. Keep responses concise and actionable

${systemContext ? `Additional context: ${systemContext}` : ''}

When recommending tools, format clearly with the tool name, why it fits, and what to watch out for. Don't recommend more than 5 tools per response — quality over quantity.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'messages-2023-12-15',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    // Stream the response back
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
