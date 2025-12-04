'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/boss');
  };

  const navItems = [
    { href: '/boss/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/boss/orders', label: 'Orders', icon: '📦' },
    { href: '/boss/products', label: 'Products', icon: '🧁' },
    { href: '/boss/featured', label: 'This Week', icon: '✨' },
    { href: '/boss/content', label: 'Content', icon: '📝' },
  ];

  return (
    <nav className="card p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/boss/dashboard"
            className="text-xl text-[var(--accent)]"
            style={{ fontFamily: 'var(--font-pacifico), cursive' }}
          >
            Boss Mode
          </Link>

          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  pathname === item.href
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-soft)] hover:bg-[var(--accent-soft)]'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-sm text-[var(--text-soft)] hover:text-[var(--accent)]"
          >
            View Site →
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
