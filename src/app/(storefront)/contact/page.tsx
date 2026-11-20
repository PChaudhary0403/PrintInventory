'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/catalogue/Breadcrumbs';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-text-primary">Contact Us</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Have a question or need a quote? Our team is here to help.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Contact info */}
        <div className="space-y-6">
          {[
            {
              icon: MapPin,
              label: 'Address',
              lines: ['Digital Heroes', 'Mumbai, Maharashtra', 'India – 400001'],
            },
            {
              icon: Phone,
              label: 'Phone',
              lines: ['+91 98765 43210', 'Mon–Sat, 10 am–6 pm IST'],
            },
            {
              icon: Mail,
              label: 'Email',
              lines: ['hello@digitalheroes.co.in', 'support@digitalheroes.co.in'],
            },
            {
              icon: Clock,
              label: 'Business Hours',
              lines: ['Monday – Saturday', '10:00 am – 6:00 pm IST', 'Closed on public holidays'],
            },
          ].map(({ icon: Icon, label, lines }) => (
            <div key={label} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{label}</p>
                {lines.map((line) => (
                  <p key={line} className="text-sm text-text-secondary">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white py-16 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div>
                <p className="text-base font-semibold text-text-primary">Message Sent!</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Thank you for reaching out. We will get back to you within 1–2 business days.
                </p>
              </div>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="text-sm font-medium text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary" htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary" htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary" htmlFor="subject">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject" name="subject" required value={form.subject} onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a subject…</option>
                  <option>General Enquiry</option>
                  <option>Custom Quote Request</option>
                  <option>Order Follow-up</option>
                  <option>Artwork & Design Help</option>
                  <option>Delivery & Shipping</option>
                  <option>Billing & Payments</option>
                  <option>Feedback or Complaint</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary" htmlFor="message">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message" name="message" required rows={5} value={form.message} onChange={handleChange}
                  placeholder="Tell us how we can help you…"
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
