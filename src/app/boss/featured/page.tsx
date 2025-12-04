'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import { FeaturedItem } from '@/lib/types';

interface FeaturedForm {
  emoji: string;
  title: string;
  description: string;
  is_visible: boolean;
}

const emptyForm: FeaturedForm = {
  emoji: '✨',
  title: '',
  description: '',
  is_visible: true,
};

// Common emojis for quick selection
const EMOJI_SUGGESTIONS = ['🎂', '🧁', '🍪', '🍰', '🎃', '👻', '🌎', '❤️', '✨', '🌸', '🎄', '🐰'];

export default function FeaturedPage() {
  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FeaturedItem | null>(null);
  const [form, setForm] = useState<FeaturedForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/boss');
        } else {
          fetchItems();
        }
      });
  }, [router]);

  async function fetchItems() {
    try {
      const res = await fetch('/api/admin/featured');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch featured items:', error);
    } finally {
      setLoading(false);
    }
  }

  function openNewModal() {
    setEditingItem(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(item: FeaturedItem) {
    setEditingItem(item);
    setForm({
      emoji: item.emoji,
      title: item.title,
      description: item.description,
      is_visible: item.is_visible,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        emoji: form.emoji,
        title: form.title,
        description: form.description,
        is_visible: form.is_visible,
      };

      if (editingItem) {
        await fetch('/api/admin/featured', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
      } else {
        await fetch('/api/admin/featured', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, sort_order: items.length + 1 }),
        });
      }

      setShowModal(false);
      fetchItems();
    } catch (error) {
      console.error('Failed to save featured item:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: FeaturedItem) {
    if (!confirm(`Delete "${item.title}"?`)) return;

    try {
      await fetch(`/api/admin/featured?id=${item.id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      console.error('Failed to delete featured item:', error);
      alert('Failed to delete. Please try again.');
    }
  }

  async function toggleVisibility(item: FeaturedItem) {
    try {
      await fetch('/api/admin/featured', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          is_visible: !item.is_visible,
        }),
      });
      fetchItems();
    } catch (error) {
      console.error('Failed to update featured item:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-body">
        <div className="text-4xl animate-bounce">✨</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-body">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AdminNav />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)]">This Week</h1>
            <p className="text-[var(--text-soft)]">
              Edit the featured items shown on your homepage
            </p>
          </div>

          <button onClick={openNewModal} className="btn-main">
            ➕ Add Item
          </button>
        </div>

        {/* Preview */}
        <div className="card p-5 mb-6">
          <h2 className="text-sm font-semibold text-[var(--text-soft)] uppercase mb-3">
            Preview (how it looks on homepage)
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {items.filter(i => i.is_visible).map((item) => (
              <div key={item.id} className="p-4 rounded-xl border-2 border-dashed border-[var(--accent-soft)] bg-white/50">
                <span className="text-2xl mb-2 block">{item.emoji}</span>
                <strong className="text-[var(--accent)]">{item.title}</strong>
                <p className="text-sm text-[var(--text-soft)]">{item.description}</p>
              </div>
            ))}
            {items.filter(i => i.is_visible).length === 0 && (
              <p className="text-[var(--text-soft)] col-span-3 text-center py-4">
                No visible items. Add some below!
              </p>
            )}
          </div>
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
              No featured items yet
            </h3>
            <p className="text-[var(--text-soft)] mb-4">
              Add items to showcase what you&apos;re baking this week!
            </p>
            <button onClick={openNewModal} className="btn-main">
              Add First Item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`card p-4 flex items-center gap-4 ${
                  !item.is_visible ? 'opacity-50' : ''
                }`}
              >
                <div className="text-3xl">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--text-main)]">{item.title}</h3>
                  <p className="text-sm text-[var(--text-soft)] truncate">
                    {item.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleVisibility(item)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      item.is_visible
                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {item.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-orange-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="px-3 py-1.5 rounded-full text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="card p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[var(--text-main)]">
                  {editingItem ? 'Edit Item' : 'New Featured Item'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[var(--text-soft)] hover:text-[var(--text-main)] text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-soft)] mb-2">
                    Emoji
                  </label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {EMOJI_SUGGESTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setForm({ ...form, emoji })}
                        className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                          form.emoji === emoji
                            ? 'bg-[var(--accent)] scale-110'
                            : 'bg-[var(--accent-soft)] hover:bg-orange-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={form.emoji}
                    onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    placeholder="Or type any emoji"
                    className="text-center text-2xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Birthday sprinkle boxes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Perfect for parties or just because"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_visible"
                    checked={form.is_visible}
                    onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                    className="w-5 h-5 rounded accent-[var(--accent)]"
                  />
                  <label htmlFor="is_visible" className="text-[var(--text-main)]">
                    Show on homepage
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-main flex-1 justify-center"
                  >
                    {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
