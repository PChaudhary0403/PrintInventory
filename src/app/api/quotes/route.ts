import { NextRequest, NextResponse } from 'next/server';

// POST /api/quotes
// Saves a custom quote request to the database.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, company, division, product_description, quantity_range, additional_notes } = body;

    if (!full_name || !email || !product_description || !division) {
      return NextResponse.json(
        { error: 'full_name, email, division, and product_description are required.' },
        { status: 400 },
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // TODO: Once Supabase is configured:
    //   createClient(admin).from('custom_quotes').insert({...})
    // TODO: Send email notification to admin via Resend

    console.log('Quote request received:', { full_name, email, division, quantity_range });

    return NextResponse.json({
      success: true,
      message: 'Quote request received. We will respond within 1–2 business days.',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
