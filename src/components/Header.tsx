'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

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
            className="px-4 py-2 rounded-full font-semibold text-[var(--text-soft)] hover:bg-[var(--accent-soft)] transition-all"
          >
            Instagram
          </a>
        </div>
      </nav>
    </header>
  );
}
