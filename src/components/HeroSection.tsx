'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteContent } from '@/lib/types';

export default function HeroSection() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="card p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-10 w-32 h-32 rounded-full bg-orange-200/30" />
        <div className="absolute -bottom-20 -left-16 w-36 h-36 rounded-full bg-pink-200/30" />
        <div className="relative z-10 animate-pulse">
          <div className="h-12 bg-[var(--accent-soft)] rounded w-48 mb-2" />
          <div className="h-4 bg-[var(--accent-soft)] rounded w-64 mb-4" />
          <div className="h-8 bg-[var(--accent-soft)] rounded w-96 mb-4" />
          <div className="h-20 bg-[var(--accent-soft)] rounded w-full max-w-xl mb-6" />
        </div>
      </section>
    );
  }

  if (!content) return null;

  const instagramUrl = content.instagram_handle
    ? `https://instagram.com/${content.instagram_handle.replace('@', '')}`
    : 'https://instagram.com/cobbscrumbs';

  return (
    <section className="card p-6 md:p-8 mb-8 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-10 w-32 h-32 rounded-full bg-orange-200/30" />
      <div className="absolute -bottom-20 -left-16 w-36 h-36 rounded-full bg-pink-200/30" />

      <div className="relative z-10">
        <h1
          className="text-4xl md:text-5xl text-[var(--accent)] mb-2"
          style={{ fontFamily: 'var(--font-pacifico), cursive' }}
        >
          {content.site_title}
        </h1>
        <p className="text-[var(--text-soft)] mb-4">{content.tagline}</p>

        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)] mb-4">
          {content.hero_heading}
        </h2>

        <p className="text-[var(--text-soft)] mb-6 max-w-xl">{content.hero_description}</p>

        <div className="flex flex-wrap gap-3 mb-4">
          <Link href="/shop" className="btn-main">
            🧁 Browse the Shop
          </Link>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            📸 See more on Instagram
          </a>
        </div>

        <p className="text-sm text-[var(--text-soft)]">{content.hero_note}</p>
      </div>
    </section>
  );
}
