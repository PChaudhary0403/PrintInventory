import { PRODUCTS, DIVISIONS, getDivisionBySlug } from '@/lib/catalogue-data';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/catalogue/Breadcrumbs';

// Static gallery of product showcases
const GALLERY_ITEMS = [
  { division: 'Labels & Stickers', title: 'Product Label Set', desc: 'Circular white vinyl labels for organic honey packaging — gloss finish, 300 units.', img: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&q=80' },
  { division: 'Race & Event Numbers', title: 'Marathon Bib Numbers', desc: 'Variable-data race bibs for a 2,000-runner half-marathon event — numbered 1–2000.', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80' },
  { division: 'MTB Boards', title: 'Enduro Race Plates', desc: 'Durable polypropylene number boards for a 3-day mountain bike enduro race.', img: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=600&q=80' },
  { division: 'Stamps', title: 'Business Return Stamp', desc: 'Self-inking address stamp for a small accounting firm — 500 impressions per ink load.', img: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=600&q=80' },
  { division: 'Trophies', title: 'Club Awards Night', desc: 'Engraved acrylic trophies for annual sports club awards — 48 unique designs.', img: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=600&q=80' },
  { division: 'Laser-Cut Work', title: 'Retail Signage', desc: 'Precision-cut acrylic logo signs for a chain of 12 retail stores.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { division: 'Labels & Stickers', title: 'Promotional Sticker Pack', desc: 'Custom die-cut sticker assortment for a consumer goods brand launch — 1,000 pcs.', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80' },
  { division: 'Laser-Cut Work', title: 'Wedding Decor', desc: 'Personalised wooden table numbers and name plaques for a 200-guest wedding.', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80' },
  { division: 'Stamps', title: 'Library Date Stamps', desc: 'Traditional date stamps for a school library — bulk order of 60 units.', img: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80' },
];

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Gallery' }]} />

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-text-primary">Work Showcase</h1>
        <p className="mt-1 text-sm text-text-secondary">
          A selection of recent projects across our six print divisions.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_ITEMS.map((item, i) => (
          <div
            key={i}
            className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <span className="text-xs font-medium uppercase tracking-wide text-primary">
                {item.division}
              </span>
              <h3 className="mt-1 text-sm font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border bg-surface p-8 text-center">
        <h2 className="text-lg font-semibold text-text-primary">Want to see your project here?</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Start by browsing our product catalogue or request a custom quote.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Browse Products
          </Link>
          <Link
            href="/quote"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-white"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
