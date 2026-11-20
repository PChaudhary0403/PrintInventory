'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { calculatePrice, type PriceBreakdown } from '@/lib/pricing';
import { useCartStore } from '@/lib/cart-store';
import { ShoppingCart, Palette, CheckCircle } from 'lucide-react';

interface OptionValue {
  label: string;
  value: string;
  modifier: number;
}

interface ProductOption {
  key: string;
  name: string;
  type: 'select' | 'number';
  required: boolean;
  values?: OptionValue[];
  validation?: { min: number; max: number; step: number };
}

interface Product {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  has_size_modifier: boolean;
  options: ProductOption[];
}

const QUANTITY_PRESETS = [25, 50, 100, 250, 500, 1000];

export default function ProductConfigurator({
  product,
  divisionName = '',
}: {
  product: Product;
  divisionName?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [addedToCart, setAddedToCart] = useState(false);

  const [configuration, setConfiguration] = useState<Record<string, string | number>>(() => {
    const defaults: Record<string, string | number> = {};
    for (const option of product.options) {
      if (option.type === 'select' && option.values?.length) {
        defaults[option.key] = option.values[0].value;
      } else if (option.type === 'number' && option.validation) {
        defaults[option.key] = option.validation.min;
      }
    }
    return defaults;
  });

  const updateOption = (key: string, value: string | number) => {
    setConfiguration((prev) => ({ ...prev, [key]: value }));
  };

  const quantityOption = product.options.find((o) => o.key === 'quantity');
  const quantity = Number(configuration.quantity) || (quantityOption?.validation?.min ?? 1);

  const pricing: PriceBreakdown = useMemo(() => {
    let optionModifiers = 0;
    for (const option of product.options) {
      if (option.type === 'select' && option.values) {
        const selected = configuration[option.key];
        const match = option.values.find((v) => v.value === selected);
        if (match) optionModifiers += match.modifier;
      }
    }

    let sizeModifier = 0;
    if (product.has_size_modifier) {
      const width = Number(configuration.width) || 0;
      const height = Number(configuration.height) || 0;
      sizeModifier = Math.round(width * height * 0.5 * 100) / 100;
    }

    return calculatePrice(product.base_price, optionModifiers, sizeModifier, quantity);
  }, [configuration, product, quantity]);

  const activeModifiers = useMemo(() => {
    const mods: { label: string; amount: number }[] = [];
    for (const option of product.options) {
      if (option.type === 'select' && option.values) {
        const selected = configuration[option.key];
        const match = option.values.find((v) => v.value === selected);
        if (match && match.modifier !== 0) {
          mods.push({ label: `${option.name}: ${match.label}`, amount: match.modifier });
        }
      }
    }
    if (product.has_size_modifier) {
      const width = Number(configuration.width) || 0;
      const height = Number(configuration.height) || 0;
      const sizeMod = Math.round(width * height * 0.5 * 100) / 100;
      if (sizeMod > 0) {
        mods.push({ label: `Size (${width} × ${height} cm)`, amount: sizeMod });
      }
    }
    return mods;
  }, [configuration, product]);

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      division_name: divisionName,
      configuration,
      quantity,
      pricing,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Options */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Configure Your Product
        </h3>

        {product.options
          .filter((o) => o.key !== 'quantity')
          .map((option) => (
            <div key={option.key}>
              <label
                htmlFor={option.key}
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                {option.name}
                {option.required && <span className="ml-0.5 text-red-500">*</span>}
              </label>

              {option.type === 'select' && option.values && (
                <select
                  id={option.key}
                  value={String(configuration[option.key] ?? '')}
                  onChange={(e) => updateOption(option.key, e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {option.values.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                      {v.modifier > 0 && ` (+${formatPrice(v.modifier)})`}
                      {v.modifier < 0 && ` (${formatPrice(v.modifier)})`}
                    </option>
                  ))}
                </select>
              )}

              {option.type === 'number' && option.validation && (
                <input
                  id={option.key}
                  type="number"
                  min={option.validation.min}
                  max={option.validation.max}
                  step={option.validation.step}
                  value={Number(configuration[option.key]) || option.validation.min}
                  onChange={(e) =>
                    updateOption(option.key, parseFloat(e.target.value) || option.validation!.min)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              )}
            </div>
          ))}
      </div>

      {/* Quantity */}
      {quantityOption && (
        <div>
          <label
            htmlFor="quantity"
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            {quantityOption.name}
            {quantityOption.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
          <input
            id="quantity"
            type="number"
            min={quantityOption.validation?.min}
            max={quantityOption.validation?.max}
            step={quantityOption.validation?.step}
            value={quantity}
            onChange={(e) =>
              updateOption(
                'quantity',
                parseInt(e.target.value, 10) || quantityOption.validation!.min,
              )
            }
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {QUANTITY_PRESETS.filter(
              (q) =>
                (!quantityOption.validation || q >= quantityOption.validation.min) &&
                (!quantityOption.validation || q <= quantityOption.validation.max),
            ).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => updateOption('quantity', q)}
                className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                  quantity === q
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-text-secondary hover:border-primary hover:text-primary'
                }`}
              >
                {q.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price breakdown */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Price Breakdown
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>Base price</span>
            <span>{formatPrice(product.base_price)}</span>
          </div>

          {activeModifiers.map((mod) => (
            <div key={mod.label} className="flex justify-between text-text-secondary">
              <span>{mod.label}</span>
              <span>
                {mod.amount > 0 ? '+' : ''}
                {formatPrice(mod.amount)}
              </span>
            </div>
          ))}

          <div className="flex justify-between font-medium text-text-primary">
            <span>Unit price</span>
            <span>{formatPrice(pricing.unit_price)}</span>
          </div>

          <div className="flex justify-between text-text-secondary">
            <span>× {pricing.quantity.toLocaleString()} units</span>
            <span>{formatPrice(pricing.subtotal)}</span>
          </div>

          {pricing.discount_percentage > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Volume discount ({(pricing.discount_percentage * 100).toFixed(0)}%)</span>
              <span>−{formatPrice(pricing.discount_amount)}</span>
            </div>
          )}

          <div className="my-2 border-t border-border" />

          <div className="flex justify-between text-text-secondary">
            <span>Taxable amount</span>
            <span>{formatPrice(pricing.taxable_amount)}</span>
          </div>

          <div className="flex justify-between text-text-secondary">
            <span>GST (18%)</span>
            <span>{formatPrice(pricing.gst_amount)}</span>
          </div>

          <div className="my-2 border-t border-border" />

          <div className="flex justify-between text-lg font-bold text-text-primary">
            <span>Total</span>
            <span>{formatPrice(pricing.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ${
            addedToCart
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-primary hover:bg-primary-dark'
          }`}
        >
          {addedToCart ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart — {formatPrice(pricing.total)}
            </>
          )}
        </button>

        <Link
          href={`/design/${product.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
        >
          <Palette className="h-4 w-4" />
          Design Your Product
        </Link>
      </div>
    </div>
  );
}
