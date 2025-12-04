'use client';

import { useState, useEffect } from 'react';
import { FeaturedItem } from '@/lib/types';

export default function ThisWeekSection() {
  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/featured')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mb-8">
        <h2
          className="text-2xl text-[var(--accent)] mb-2"
          style={{ fontFamily: 'var(--font-pacifico), cursive' }}
        >
          This Week
        </h2>
        <p className="text-[var(--text-soft)] mb-4">
          A peek at what Emily&apos;s been baking lately
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 border-dashed animate-pulse">
              <div className="w-8 h-8 bg-[var(--accent-soft)] rounded mb-2" />
              <div className="h-4 bg-[var(--accent-soft)] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[var(--accent-soft)] rounded w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null; // Don't show section if no items
  }

  return (
    <section className="mb-8">
      <h2
        className="text-2xl text-[var(--accent)] mb-2"
        style={{ fontFamily: 'var(--font-pacifico), cursive' }}
      >
        This Week
      </h2>
      <p className="text-[var(--text-soft)] mb-4">
        A peek at what Emily&apos;s been baking lately
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card p-4 border-dashed">
            <span className="text-2xl mb-2 block">{item.emoji}</span>
            <strong className="text-[var(--accent)]">{item.title}</strong>
            <p className="text-sm text-[var(--text-soft)]">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
