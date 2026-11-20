'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/catalogue/Breadcrumbs';

export default function CartPage() {
  const { items, removeItem, clearCart, grandTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Cart' }]} />
        <div className="mt-10 flex flex-col items-center gap-6 py-20 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300" />
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Your cart is empty</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Browse our product catalogue to get started.
            </p>
          </div>
          <Link
            href="/products"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const total = grandTotal();
  const gst = Math.round(total / 1.18 * 0.18 * 100) / 100;
  const subtotal = total - gst;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Cart' }]} />

      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-text-secondary underline-offset-2 hover:text-red-500 hover:underline"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Item list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    {item.division_name}
                  </p>
                  <h3 className="mt-0.5 text-base font-semibold text-text-primary">
                    {item.product_name}
                  </h3>

                  {/* Configuration summary */}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                    {Object.entries(item.configuration).map(([key, val]) => (
                      <span key={key}>
                        <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                        {String(val)}
                      </span>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                    <span className="text-text-secondary">
                      {item.quantity.toLocaleString()} × {formatPrice(item.pricing.unit_price)}
                    </span>
                    {item.pricing.discount_percentage > 0 && (
                      <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        {(item.pricing.discount_percentage * 100).toFixed(0)}% volume discount
                      </span>
                    )}
                    <span className="text-xs text-text-muted">incl. GST</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <p className="text-lg font-bold text-text-primary">
                    {formatPrice(item.pricing.total)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl border border-border bg-white p-6">
            <h2 className="text-base font-semibold text-text-primary">Order Summary</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal (excl. GST)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>GST (18%)</span>
                <span>{formatPrice(gst)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="text-text-muted">Calculated at checkout</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between font-bold text-text-primary">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/products"
              className="mt-3 block text-center text-sm text-text-secondary hover:text-text-primary"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
