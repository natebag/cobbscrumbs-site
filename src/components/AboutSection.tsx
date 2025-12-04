'use client';

import { useState, useEffect } from 'react';
import { SiteContent } from '@/lib/types';

export default function AboutSection() {
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
        <div className="h-8 bg-[var(--accent-soft)] rounded w-32 mb-2 animate-pulse" />
        <div className="card p-5 border-dashed animate-pulse">
          <div className="h-4 bg-[var(--accent-soft)] rounded w-full mb-2" />
          <div className="h-4 bg-[var(--accent-soft)] rounded w-3/4" />
        </div>
      </section>
    );
  }

  if (!content) return null;

  return (
    <section className="mb-8">
      <h2
        className="text-2xl text-[var(--accent)] mb-2"
        style={{ fontFamily: 'var(--font-pacifico), cursive' }}
      >
        {content.about_title}
      </h2>
      <div className="card p-5 border-dashed">
        <p className="text-[var(--text-soft)]">{content.about_text}</p>
        <p className="text-[var(--text-soft)] mt-3">
          {content.about_instagram.split(content.instagram_handle).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <strong className="text-[var(--accent)]">{content.instagram_handle}</strong>
              )}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
