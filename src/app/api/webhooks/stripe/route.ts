import { NextRequest, NextResponse } from 'next/server';

// POST /api/webhooks/stripe
// Handles Stripe webhook events for payment verification.
// App Router reads raw body via req.text() — no bodyParser config needed.

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured.');
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  let event: any;
  const rawBody = await req.text();

  try {
    // Dynamically import Stripe only on server
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-11-18.endive' as any });
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.order_id;
      console.log(`PaymentIntent succeeded for order ${orderId}`);
      // TODO: createClient(admin) → update orders SET payment_status='paid', status='confirmed'
      // TODO: Insert into payments table
      // TODO: Trigger notification to customer
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.order_id;
      console.error(`PaymentIntent failed for order ${orderId}`);
      // TODO: update orders SET payment_status='failed'
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object;
      console.log(`Charge refunded: ${charge.id}`);
      // TODO: update orders SET status='refunded'
      break;
    }

    default:
      // Ignore unhandled event types
      break;
  }

  return NextResponse.json({ received: true });
}
