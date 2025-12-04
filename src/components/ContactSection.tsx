'use client';

import { useState, useEffect } from 'react';
import { SiteContent } from '@/lib/types';

export default function ContactSection() {
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
      <section className="mb-8">
        <div className="h-8 bg-[var(--accent-soft)] rounded w-40 mb-2 animate-pulse" />
        <div className="h-4 bg-[var(--accent-soft)] rounded w-64 mb-4 animate-pulse" />
        <div className="flex gap-3">
          <div className="h-12 bg-[var(--accent-soft)] rounded w-48 animate-pulse" />
          <div className="h-12 bg-[var(--accent-soft)] rounded w-40 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!content) return null;

  const whatsappUrl = `https://wa.me/${content.whatsapp_number}`;
  const instagramUrl = content.instagram_handle
    ? `https://instagram.com/${content.instagram_handle.replace('@', '')}`
    : 'https://instagram.com/cobbscrumbs';

  return (
    <section className="mb-8">
      <h2
        className="text-2xl text-[var(--accent)] mb-2"
        style={{ fontFamily: 'var(--font-pacifico), cursive' }}
      >
        Get in Touch
      </h2>
      <p className="text-[var(--text-soft)] mb-4">
        Want to order or have questions? Reach out!
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-main"
        >
          💬 Message on WhatsApp
        </a>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          📸 DM on Instagram
        </a>
      </div>
    </section>
  );
}
