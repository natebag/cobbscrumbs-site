'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import Link from 'next/link';

interface Stats {
  pendingOrders: number;
  totalProducts: number;
  availableProducts: number;
  soldOutProducts: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check auth
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/boss');
        } else {
          fetchStats();
        }
      });
  }, [router]);

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-body">
        <div className="text-4xl animate-bounce">🧁</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-body">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <AdminNav />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-main)]">
            Hey Emily! 👋
          </h1>
          <p className="text-[var(--text-soft)]">
            Here&apos;s what&apos;s happening with your bakery today.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/boss/orders" className="card p-5 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-3xl font-bold text-[var(--accent)]">
              {stats?.pendingOrders || 0}
            </div>
            <div className="text-sm text-[var(--text-soft)]">Pending Orders</div>
          </Link>

          <Link href="/boss/products" className="card p-5 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🧁</div>
            <div className="text-3xl font-bold text-[var(--accent)]">
              {stats?.totalProducts || 0}
            </div>
            <div className="text-sm text-[var(--text-soft)]">Total Products</div>
          </Link>

          <div className="card p-5">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-500">
              {stats?.availableProducts || 0}
            </div>
            <div className="text-sm text-[var(--text-soft)]">Available</div>
          </div>

          <div className="card p-5">
            <div className="text-3xl mb-2">😴</div>
            <div className="text-3xl font-bold text-gray-400">
              {stats?.soldOutProducts || 0}
            </div>
            <div className="text-sm text-[var(--text-soft)]">Sold Out</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-5">
            <h2 className="font-bold text-lg text-[var(--text-main)] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/boss/products?action=new"
                className="btn-main w-full justify-center"
              >
                ➕ Add New Product
              </Link>
              <Link
                href="/boss/orders"
                className="btn-outline w-full justify-center"
              >
                📦 View All Orders
              </Link>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-bold text-lg text-[var(--text-main)] mb-4">
              Tips & Reminders
            </h2>
            <ul className="space-y-2 text-sm text-[var(--text-soft)]">
              <li className="flex gap-2">
                <span>💡</span>
                <span>Update stock counts after each batch sells</span>
              </li>
              <li className="flex gap-2">
                <span>📸</span>
                <span>Add photos to products - they sell better!</span>
              </li>
              <li className="flex gap-2">
                <span>✨</span>
                <span>Mark seasonal items with fun emojis</span>
              </li>
              <li className="flex gap-2">
                <span>📦</span>
                <span>Check orders daily to stay on top of requests</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
