'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/catalogue/Breadcrumbs';

type Step = 'details' | 'review' | 'payment';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi', 'Lakshadweep',
  'Puducherry', 'Jammu and Kashmir', 'Ladakh',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, grandTotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('details');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [address, setAddress] = useState({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    gstin: '',
  });

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-text-primary">Your cart is empty</h2>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-5 text-2xl font-bold text-text-primary">Order Placed!</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Thank you for your order. You will receive a confirmation email at{' '}
          <span className="font-medium">{address.email}</span> shortly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/account/orders"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            View Orders
          </Link>
          <Link
            href="/products"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const total = grandTotal();
  const totalExGst = Math.round((total / 1.18) * 100) / 100;
  const gst = Math.round((total - totalExGst) * 100) / 100;

  const steps: { key: Step; label: string }[] = [
    { key: 'details', label: 'Delivery Details' },
    { key: 'review', label: 'Review Order' },
    { key: 'payment', label: 'Payment' },
  ];
  const currentStepIdx = steps.findIndex((s) => s.key === step);

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    // TODO: POST to /api/orders then redirect to Stripe payment
    await new Promise((r) => setTimeout(r, 1200));
    clearCart();
    setOrderPlaced(true);
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]}
      />

      {/* Step indicator */}
      <div className="mt-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i < currentStepIdx
                  ? 'bg-green-500 text-white'
                  : i === currentStepIdx
                    ? 'bg-primary text-white'
                    : 'border border-border bg-white text-text-muted'
              }`}
            >
              {i < currentStepIdx ? '✓' : i + 1}
            </div>
            <span
              className={`text-sm ${
                i === currentStepIdx ? 'font-semibold text-text-primary' : 'text-text-secondary'
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-text-muted" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Step 1: Delivery Details */}
          {step === 'details' && (
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="text-base font-semibold text-text-primary">Delivery Details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  { name: 'full_name', label: 'Full Name', type: 'text', required: true, placeholder: 'Rahul Sharma', colSpan: false },
                  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'rahul@example.com', colSpan: false },
                  { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+91 98765 43210', colSpan: false },
                  { name: 'gstin', label: 'GSTIN (optional)', type: 'text', required: false, placeholder: '27AAAAA0000A1Z5', colSpan: false },
                  { name: 'address_line1', label: 'Address Line 1', type: 'text', required: true, placeholder: 'House / Flat / Building', colSpan: true },
                  { name: 'address_line2', label: 'Address Line 2', type: 'text', required: false, placeholder: 'Area / Colony / Locality', colSpan: true },
                  { name: 'city', label: 'City', type: 'text', required: true, placeholder: 'Mumbai', colSpan: false },
                  { name: 'pincode', label: 'PIN Code', type: 'text', required: true, placeholder: '400001', colSpan: false },
                ].map(({ name, label, type, required, placeholder, colSpan }) => (
                  <div key={name} className={colSpan ? 'sm:col-span-2' : ''}>
                    <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor={name}>
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      id={name}
                      name={name}
                      type={type}
                      required={required}
                      value={address[name as keyof typeof address]}
                      onChange={handleAddressChange}
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="state">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    required
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select state…</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep('review')}
                  disabled={!address.full_name || !address.email || !address.phone || !address.address_line1 || !address.city || !address.state || !address.pincode}
                  className="rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-text-primary">Order Items</h2>
                  <button onClick={() => setStep('details')} className="text-sm text-primary hover:underline">
                    Edit details
                  </button>
                </div>
                <div className="mt-4 divide-y divide-border">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{item.product_name}</p>
                        <p className="text-xs text-text-secondary">
                          {item.quantity.toLocaleString()} × {formatPrice(item.pricing.unit_price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-text-primary">
                        {formatPrice(item.pricing.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-white p-6">
                <h2 className="text-base font-semibold text-text-primary">Delivery Address</h2>
                <div className="mt-2 text-sm text-text-secondary">
                  <p className="font-medium text-text-primary">{address.full_name}</p>
                  <p>{address.address_line1}{address.address_line2 ? `, ${address.address_line2}` : ''}</p>
                  <p>{address.city}, {address.state} – {address.pincode}</p>
                  <p className="mt-1">{address.email} · {address.phone}</p>
                  {address.gstin && <p className="mt-1">GSTIN: {address.gstin}</p>}
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep('details')} className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-primary hover:bg-surface">
                  Back
                </button>
                <button onClick={() => setStep('payment')} className="rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && (
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="text-base font-semibold text-text-primary">Payment</h2>
              <p className="mt-1 text-sm text-text-secondary">
                You will be redirected to our secure payment gateway (Stripe) to complete your payment.
              </p>

              <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm text-text-secondary">
                <p className="font-medium text-text-primary">Order Total: {formatPrice(total)}</p>
                <p className="text-xs mt-0.5">Includes GST of {formatPrice(gst)}</p>
              </div>

              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                <strong>Note:</strong> Stripe payment integration will be fully activated once the Supabase and Stripe credentials are configured in production.
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep('review')} className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-primary hover:bg-surface">
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                >
                  {submitting ? 'Placing Order…' : `Pay ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl border border-border bg-white p-6">
            <h2 className="text-base font-semibold text-text-primary">Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal (excl. GST)</span>
                <span>{formatPrice(totalExGst)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>GST (18%)</span>
                <span>{formatPrice(gst)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="text-text-muted">TBD</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between font-bold text-text-primary">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
