'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/catalogue/Breadcrumbs';
import { DIVISIONS } from '@/lib/catalogue-data';
import { CheckCircle } from 'lucide-react';

const QUANTITY_RANGES = ['1–24', '25–99', '100–499', '500–999', '1,000+'];

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    division: '',
    product_description: '',
    quantity_range: '',
    additional_notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: POST to /api/quotes when Supabase is configured
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <CheckCircle className="mx-auto h-14 w-14 text-green-500" />
        <h2 className="mt-5 text-2xl font-bold text-text-primary">Quote Request Received</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Thank you, {form.full_name}. Our team will review your request and get back to you at{' '}
          <span className="font-medium">{form.email}</span> within 1–2 business days.
        </p>
        <a
          href="/"
          className="mt-8 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Request a Custom Quote' }]} />

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-text-primary">Request a Custom Quote</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Need a specialised product or large volume? Fill in the form below and our team will
          prepare a detailed quote for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Contact */}
        <fieldset className="rounded-xl border border-border bg-white p-6">
          <legend className="px-1 text-sm font-semibold text-text-primary">Your Details</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="full_name">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={form.full_name}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Rahul Sharma"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="rahul@company.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="company">
                Company / Organisation
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={form.company}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Acme Pvt Ltd"
              />
            </div>
          </div>
        </fieldset>

        {/* Product */}
        <fieldset className="rounded-xl border border-border bg-white p-6">
          <legend className="px-1 text-sm font-semibold text-text-primary">Product Requirements</legend>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="division">
                  Product Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="division"
                  name="division"
                  required
                  value={form.division}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a category…</option>
                  {DIVISIONS.map((d) => (
                    <option key={d.id} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
                  <option value="other">Other / Not sure</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="quantity_range">
                  Approximate Quantity
                </label>
                <select
                  id="quantity_range"
                  name="quantity_range"
                  value={form.quantity_range}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a range…</option>
                  {QUANTITY_RANGES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="product_description">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="product_description"
                name="product_description"
                required
                rows={4}
                value={form.product_description}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Please describe the product you need: dimensions, materials, finishes, special requirements, etc."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="additional_notes">
                Additional Notes
              </label>
              <textarea
                id="additional_notes"
                name="additional_notes"
                rows={3}
                value={form.additional_notes}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Deadline, delivery location, artwork status…"
              />
            </div>
          </div>
        </fieldset>

        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            We will respond within 1–2 business days (Mon–Sat, 10 am–6 pm IST).
          </p>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
