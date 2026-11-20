import Link from 'next/link';

const divisions = [
  { name: 'Labels & Stickers', href: '/products/labels-stickers' },
  { name: 'Race & Event Numbers', href: '/products/race-event-numbers' },
  { name: 'MTB Boards', href: '/products/mtb-boards' },
  { name: 'Stamps', href: '/products/stamps' },
  { name: 'Trophies', href: '/products/trophies' },
  { name: 'Laser-Cut Work', href: '/products/laser-cut-work' },
];

const accountLinks = [
  { name: 'My Account', href: '/account' },
  { name: 'Order History', href: '/account/orders' },
  { name: 'Saved Designs', href: '/account/designs' },
  { name: 'Track Order', href: '/account/orders' },
];

export function Footer() {
  return (
    <footer className="bg-[#F9FAFB] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[#1F2937] uppercase tracking-wider mb-4">
              About
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Digital Heroes delivers professional printing solutions across six specialist divisions — labels, race numbers, MTB boards, stamps, trophies, and laser-cut work.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1F2937] uppercase tracking-wider mb-4">
              Products
            </h3>
            <ul className="space-y-2.5">
              {divisions.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1F2937] uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-2.5">
              {accountLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1F2937] uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:info@digitalheroes.co.in"
                  className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors"
                >
                  info@digitalheroes.co.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+919000001234"
                  className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors"
                >
                  +91 9000 001 234
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Digital Heroes. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-xs text-gray-500 hover:text-[#2563EB] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-[#2563EB] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
