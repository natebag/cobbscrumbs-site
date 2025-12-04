'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import { SiteContent } from '@/lib/types';

const FIELD_CONFIG = [
  {
    key: 'site_title',
    label: 'Site Title',
    type: 'text',
    placeholder: "Cobb's Crumbs",
    section: 'hero',
  },
  {
    key: 'tagline',
    label: 'Tagline',
    type: 'text',
    placeholder: 'cozy bakes • tiny batches • big love',
    section: 'hero',
  },
  {
    key: 'hero_heading',
    label: 'Main Heading',
    type: 'text',
    placeholder: 'Homemade treats for birthdays...',
    section: 'hero',
  },
  {
    key: 'hero_description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Emily bakes small-batch goodies...',
    section: 'hero',
  },
  {
    key: 'hero_note',
    label: 'Note (small text)',
    type: 'text',
    placeholder: 'P.S. Allergies or special requests?...',
    section: 'hero',
  },
  {
    key: 'about_title',
    label: 'Section Title',
    type: 'text',
    placeholder: 'Meet Emily',
    section: 'about',
  },
  {
    key: 'about_text',
    label: 'About Text',
    type: 'textarea',
    placeholder: "Cobb's Crumbs started as...",
    section: 'about',
  },
  {
    key: 'about_instagram',
    label: 'Instagram Call-to-Action',
    type: 'textarea',
    placeholder: 'Follow @cobbscrumbs on Instagram...',
    section: 'about',
  },
  {
    key: 'instagram_handle',
    label: 'Instagram Handle',
    type: 'text',
    placeholder: '@cobbscrumbs',
    section: 'contact',
  },
  {
    key: 'whatsapp_number',
    label: 'WhatsApp Number (numbers only)',
    type: 'text',
    placeholder: '12269244889',
    section: 'contact',
  },
] as const;

export default function ContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/boss');
        } else {
          fetchContent();
        }
      });
  }, [router]);

  async function fetchContent() {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      setContent(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!content) return;

    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('Failed to save. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function updateField(key: keyof SiteContent, value: string) {
    if (!content) return;
    setContent({ ...content, [key]: value });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-body">
        <div className="text-4xl animate-bounce">📝</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen admin-body">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <AdminNav />
          <div className="card p-8 text-center">
            <p className="text-red-500">Failed to load content. Please refresh.</p>
          </div>
        </div>
      </div>
    );
  }

  const heroFields = FIELD_CONFIG.filter((f) => f.section === 'hero');
  const aboutFields = FIELD_CONFIG.filter((f) => f.section === 'about');
  const contactFields = FIELD_CONFIG.filter((f) => f.section === 'contact');

  return (
    <div className="min-h-screen admin-body">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AdminNav />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)]">Site Content</h1>
            <p className="text-[var(--text-soft)]">
              Edit the text displayed on your homepage
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`btn-main ${saved ? 'bg-green-500 hover:bg-green-600' : ''}`}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Hero Section */}
        <div className="card p-5 mb-6">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <span>🏠</span> Hero Section
          </h2>
          <p className="text-sm text-[var(--text-soft)] mb-4">
            The main welcome area at the top of your homepage
          </p>

          <div className="space-y-4">
            {heroFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={content[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full"
                  />
                ) : (
                  <input
                    type="text"
                    value={content[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="card p-5 mb-6">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <span>👋</span> About Section
          </h2>
          <p className="text-sm text-[var(--text-soft)] mb-4">
            Tell visitors about yourself and your baking journey
          </p>

          <div className="space-y-4">
            {aboutFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={content[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full"
                  />
                ) : (
                  <input
                    type="text"
                    value={content[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="card p-5 mb-6">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <span>📱</span> Contact Info
          </h2>
          <p className="text-sm text-[var(--text-soft)] mb-4">
            Your social media and contact details
          </p>

          <div className="space-y-4">
            {contactFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={content[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <span>👀</span> Live Preview
          </h2>
          <p className="text-sm text-[var(--text-soft)] mb-4">
            This is roughly how your homepage will look
          </p>

          <div className="bg-white/50 rounded-xl p-6 border-2 border-dashed border-[var(--accent-soft)]">
            {/* Hero Preview */}
            <div className="mb-6 pb-6 border-b border-[var(--accent-soft)]">
              <h1
                className="text-3xl text-[var(--accent)] mb-1"
                style={{ fontFamily: 'var(--font-pacifico), cursive' }}
              >
                {content.site_title}
              </h1>
              <p className="text-sm text-[var(--text-soft)] mb-3">{content.tagline}</p>
              <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">
                {content.hero_heading}
              </h2>
              <p className="text-[var(--text-soft)] mb-3">{content.hero_description}</p>
              <p className="text-sm text-[var(--text-soft)]">{content.hero_note}</p>
            </div>

            {/* About Preview */}
            <div>
              <h2
                className="text-xl text-[var(--accent)] mb-2"
                style={{ fontFamily: 'var(--font-pacifico), cursive' }}
              >
                {content.about_title}
              </h2>
              <p className="text-[var(--text-soft)] mb-2">{content.about_text}</p>
              <p className="text-[var(--text-soft)] text-sm">{content.about_instagram}</p>
            </div>
          </div>
        </div>

        {/* Floating save button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`btn-main shadow-lg ${saved ? 'bg-green-500 hover:bg-green-600' : ''}`}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved!' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
