import { NextRequest, NextResponse } from 'next/server';

// StackMatch email capture
// Plug in your email provider by setting env vars:
//   MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID  → Mailchimp
//   CONVERTKIT_API_KEY + CONVERTKIT_FORM_ID → ConvertKit
//   LOOPS_API_KEY                           → Loops.so (recommended for SaaS)
// Without env vars, submissions are logged server-side only.

export async function POST(req: NextRequest) {
  try {
    const { email, intent, context } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    console.log(`[StackMatch Lead] ${email} | intent: ${intent ?? 'general'} | context: ${context ?? ''} | ${timestamp}`);

    // ── Mailchimp ──────────────────────────────────────────────────
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
      const dc = process.env.MAILCHIMP_API_KEY.split('-').pop();
      const res = await fetch(
        `https://${dc}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            tags: ['stackmatch', intent ?? 'general'].filter(Boolean),
            merge_fields: { SOURCE: context ?? 'stackmatch' },
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        // 400 with "Member Exists" is fine — already subscribed
        if (err.title !== 'Member Exists') {
          console.error('[Mailchimp error]', err);
        }
      }
    }

    // ── Loops.so ───────────────────────────────────────────────────
    if (process.env.LOOPS_API_KEY) {
      await fetch('https://app.loops.so/api/v1/contacts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          source: 'stackmatch',
          userGroup: intent ?? 'general',
        }),
      });
    }

    // ── ConvertKit ─────────────────────────────────────────────────
    if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
      await fetch(
        `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.CONVERTKIT_API_KEY,
            email,
            tags: [intent ?? 'stackmatch'],
          }),
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[subscribe error]', err);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
