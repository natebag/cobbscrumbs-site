'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

export default function Header() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="mb-6">
      <div className="sprinkle-bar" />

      <nav className="card p-4 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="font-[var(--font-pacifico)] text-2xl text-[var(--accent)] hover:scale-105 transition-transform"
          style={{ fontFamily: 'var(--font-pacifico), cursive' }}
        >
          Cobb&apos;s Crumbs
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              pathname === '/'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-soft)] hover:bg-[var(--accent-soft)]'
            }`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              pathname === '/shop'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-soft)] hover:bg-[var(--accent-soft)]'
            }`}
          >
            Shop
          </Link>
          <a
            href="https://instagram.com/cobbscrumbs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full font-semibold text-[var(--text-soft)] hover:bg-[var(--accent-soft)] transition-all hidden sm:block"
          >
            Instagram
          </a>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-4 py-2 rounded-full font-semibold text-[var(--text-soft)] hover:bg-[var(--accent-soft)] transition-all"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--accent)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
