import { NextRequest, NextResponse } from 'next/server';
import { calculatePrice } from '@/lib/pricing';
import { PRODUCTS } from '@/lib/catalogue-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, configuration, quantity } = body;

    if (!product_id || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'product_id and a positive integer quantity are required.' },
        { status: 400 },
      );
    }

    const product = PRODUCTS.find((p) => p.id === product_id || p.slug === product_id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // Sum option modifiers
    let optionModifiers = 0;
    if (configuration && typeof configuration === 'object') {
      for (const option of product.options) {
        if (option.type === 'select' && option.values) {
          const selected = configuration[option.key];
          const match = option.values.find((v) => v.value === selected);
          if (match) optionModifiers += match.modifier;
        }
      }
    }

    // Size modifier for products with has_size_modifier
    let sizeModifier = 0;
    if (product.has_size_modifier && configuration) {
      const width = parseFloat(configuration.width) || 0;
      const height = parseFloat(configuration.height) || 0;
      sizeModifier = Math.round(width * height * 0.5 * 100) / 100;
    }

    const pricing = calculatePrice(product.base_price, optionModifiers, sizeModifier, quantity);

    return NextResponse.json({
      product_id: product.id,
      product_name: product.name,
      configuration,
      pricing,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
