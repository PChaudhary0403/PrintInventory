'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

const searchCategories = [
  'All Categories',
  'Labels & Stickers',
  'Race & Event Numbers',
  'MTB Boards',
  'Stamps',
  'Trophies',
  'Laser-Cut Work',
];

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const categoryRef = useRef<HTMLDivElement>(null);
  const cartItemCount = 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch() {
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams({ q: searchQuery });
    if (selectedCategory !== 'All Categories') {
      params.set('category', selectedCategory);
    }
    window.location.href = `/products?${params.toString()}`;
  }

  return (
    <header className="w-full bg-white border-b border-[#E5E7EB]">
      {/* Row 1: Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-1 text-xl font-bold text-[#1F2937]">
            Digital<span className="text-[#2563EB]">Heroes</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-1.5 text-sm text-[#1F2937] hover:text-[#2563EB] transition-colors"
                >
                  <User className="h-4 w-4" />
                  Account
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hidden sm:block text-sm text-[#1F2937] hover:text-[#2563EB] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block text-sm text-[#1F2937] hover:text-[#2563EB] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:block text-sm text-[#1F2937] hover:text-[#2563EB] transition-colors"
                >
                  Register
                </Link>
              </>
            )}

            <Link href="/cart" className="relative p-1.5 text-[#1F2937] hover:text-[#2563EB] transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-semibold text-white bg-[#2563EB] rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Navigation Bar */}
      <div className="border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#1F2937] hover:text-[#2563EB] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#1F2937] hover:text-[#2563EB] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search bar */}
            <div className="hidden sm:flex items-center flex-1 max-w-lg ml-6">
              <div ref={categoryRef} className="relative">
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="flex items-center gap-1 h-9 px-3 text-sm text-[#1F2937] bg-[#F3F4F6] border border-r-0 border-[#E5E7EB] rounded-l-md hover:bg-[#E5E7EB] transition-colors whitespace-nowrap"
                >
                  <span className="max-w-[120px] truncate">{selectedCategory}</span>
                  <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
                </button>
                {categoryOpen && (
                  <div className="absolute top-full left-0 z-50 mt-1 w-52 bg-white border border-[#E5E7EB] rounded-md shadow-sm py-1">
                    {searchCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCategoryOpen(false);
                        }}
                        className={cn(
                          'block w-full text-left px-3 py-1.5 text-sm transition-colors',
                          cat === selectedCategory
                            ? 'text-[#2563EB] bg-blue-50'
                            : 'text-[#1F2937] hover:bg-[#F3F4F6]'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search products..."
                className="h-9 flex-1 min-w-0 px-3 text-sm text-[#1F2937] border border-[#E5E7EB] outline-none focus:border-[#2563EB] transition-colors"
              />
              <button
                onClick={handleSearch}
                className="flex items-center justify-center h-9 w-9 bg-[#2563EB] text-white rounded-r-md hover:bg-[#1D4ED8] transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {/* Request a Quote button */}
            <Link
              href="/quote"
              className="hidden lg:inline-flex items-center ml-4 h-9 px-4 text-sm font-medium text-white bg-[#2563EB] rounded-md hover:bg-[#1D4ED8] transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile slide-down panel */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-200 ease-in-out border-t border-[#E5E7EB]',
          mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0 border-t-0'
        )}
      >
        <div className="px-4 py-3 space-y-3">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-[#1F2937] hover:text-[#2563EB] hover:bg-[#F3F4F6] rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile search */}
          <div className="sm:hidden flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search products..."
              className="h-9 flex-1 min-w-0 px-3 text-sm text-[#1F2937] border border-[#E5E7EB] rounded-l-md outline-none focus:border-[#2563EB] transition-colors"
            />
            <button
              onClick={handleSearch}
              className="flex items-center justify-center h-9 w-9 bg-[#2563EB] text-white rounded-r-md hover:bg-[#1D4ED8] transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile auth links */}
          <div className="sm:hidden flex flex-col gap-1 pt-2 border-t border-[#E5E7EB]">
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#1F2937] hover:text-[#2563EB] hover:bg-[#F3F4F6] rounded-md transition-colors"
                >
                  <User className="h-4 w-4" />
                  Account
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm text-[#1F2937] hover:text-[#2563EB] hover:bg-[#F3F4F6] rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-[#1F2937] hover:text-[#2563EB] hover:bg-[#F3F4F6] rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-[#1F2937] hover:text-[#2563EB] hover:bg-[#F3F4F6] rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <Link
            href="/quote"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center h-9 w-full text-sm font-medium text-white bg-[#2563EB] rounded-md hover:bg-[#1D4ED8] transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
