import { NextRequest, NextResponse } from 'next/server';

// Tool submission handler
// Set SUBMISSION_EMAIL env var to receive submissions by email (via Resend or similar)
// Without it, submissions are logged server-side.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, website, category, description, pricing, submittedBy, whyValuable } = body;

    if (!name || !website || !category) {
      return NextResponse.json({ error: 'Name, website, and category required' }, { status: 400 });
    }

    const submission = { name, website, category, description, pricing, submittedBy, whyValuable, timestamp: new Date().toISOString() };
    console.log('[StackMatch Tool Submission]', JSON.stringify(submission, null, 2));

    // ── Email notification via Resend ──────────────────────────────
    if (process.env.RESEND_API_KEY && process.env.SUBMISSION_EMAIL) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'submissions@stackmatch.io',
          to: process.env.SUBMISSION_EMAIL,
          subject: `New Tool Submission: ${name}`,
          html: `
            <h2>New Tool Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Website:</strong> <a href="${website}">${website}</a></p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Pricing:</strong> ${pricing}</p>
            <p><strong>Why valuable:</strong> ${whyValuable}</p>
            <p><strong>Submitted by:</strong> ${submittedBy}</p>
            <p><strong>Time:</strong> ${submission.timestamp}</p>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[submit-tool error]', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
