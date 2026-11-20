import Link from "next/link";
import { DivisionCard } from "@/components/home/DivisionCard";
import { HowItWorks } from "@/components/home/HowItWorks";

const divisions = [
  {
    name: "Labels & Stickers",
    slug: "labels-stickers",
    description:
      "Custom printed labels and stickers in any shape, size, or finish.",
  },
  {
    name: "Race & Event Numbers",
    slug: "race-event-numbers",
    description:
      "Durable race bibs and event numbers with optional timing chips.",
  },
  {
    name: "MTB Boards",
    slug: "mtb-boards",
    description:
      "Custom mountain bike number boards and signage for events.",
  },
  {
    name: "Stamps",
    slug: "stamps",
    description:
      "Self-inking and traditional rubber stamps for business and personal use.",
  },
  {
    name: "Trophies",
    slug: "trophies",
    description:
      "Awards, medals, and trophies with custom engraving and branding.",
  },
  {
    name: "Laser-Cut Work",
    slug: "laser-cut-work",
    description:
      "Precision laser cutting and engraving on wood, acrylic, and metal.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[linear-gradient(to_bottom,#F8FAFC,#FFFFFF)] max-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-text-primary">
                Professional Printing Solutions
              </h1>
              <p className="mt-4 text-lg text-text-secondary max-w-lg">
                Custom printing across six specialist divisions — from labels
                and stickers to laser-cut work. Configured online, produced to
                the highest standard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Browse Products
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-text-primary hover:border-primary hover:text-primary transition-colors"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center rounded-lg bg-gray-50 border border-gray-200 aspect-[4/3]">
              <span className="text-text-muted text-sm">Product Showcase</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Divisions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary mb-8">
          Our Product Ranges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisions.map((division) => (
            <DivisionCard key={division.slug} {...division} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* CTA */}
      <section className="bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            Ready to get started?
          </h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Browse our product ranges and configure your order online. Fast
            turnaround, professional results.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center mt-6 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </>
  );
}
