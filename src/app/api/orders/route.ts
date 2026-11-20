import { NextRequest, NextResponse } from 'next/server';
import { calculatePrice } from '@/lib/pricing';
import { PRODUCTS } from '@/lib/catalogue-data';

// POST /api/orders
// Creates an order after server-side price verification.
// In production this writes to Supabase and creates a Stripe PaymentIntent.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, delivery_address, customer_email } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array is required.' }, { status: 400 });
    }
    if (!delivery_address || !customer_email) {
      return NextResponse.json(
        { error: 'delivery_address and customer_email are required.' },
        { status: 400 },
      );
    }

    // Server-side re-verification of prices
    const verifiedItems = [];
    for (const item of items) {
      const { product_id, configuration, quantity } = item;
      const product = PRODUCTS.find((p) => p.id === product_id);
      if (!product) {
        return NextResponse.json({ error: `Product ${product_id} not found.` }, { status: 404 });
      }

      let optionModifiers = 0;
      for (const option of product.options) {
        if (option.type === 'select' && option.values && configuration) {
          const match = option.values.find((v) => v.value === configuration[option.key]);
          if (match) optionModifiers += match.modifier;
        }
      }

      let sizeModifier = 0;
      if (product.has_size_modifier === true && configuration) {
        const w = parseFloat(configuration.width) || 0;
        const h = parseFloat(configuration.height) || 0;
        sizeModifier = Math.round(w * h * 0.5 * 100) / 100;
      }

      const pricing = calculatePrice(product.base_price, optionModifiers, sizeModifier, quantity);

      verifiedItems.push({
        product_id: product.id,
        product_name: product.name,
        configuration,
        quantity,
        pricing,
        configuration_snapshot: {
          product_id: product.id,
          product_name: product.name,
          base_price: product.base_price,
          options_at_purchase: configuration,
          calculated_at: new Date().toISOString(),
        },
      });
    }

    const grandTotal = verifiedItems.reduce((sum, i) => sum + i.pricing.total, 0);

    // TODO: Once Supabase is configured:
    //   1. createClient(server) → insert into orders table
    //   2. Insert order_items rows with configuration_snapshot
    //   3. Create Stripe PaymentIntent for grandTotal
    //   4. Return { order_id, client_secret } for Stripe Elements

    // For now return the verified order structure
    return NextResponse.json({
      order_number: `DH-${Date.now().toString().slice(-6)}`,
      items: verifiedItems,
      grand_total: grandTotal,
      delivery_address,
      customer_email,
      status: 'pending',
      message: 'Order structure verified. Supabase + Stripe integration activates with real credentials.',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
