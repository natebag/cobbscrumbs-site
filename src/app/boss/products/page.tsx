'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import AdminNav from '@/components/AdminNav';
import { Product } from '@/lib/types';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  price_label: string;
  stock: string;
  is_available: boolean;
  tag: string;
  tag_emoji: string;
  image_url: string;
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  price_label: '',
  stock: '0',
  is_available: true,
  tag: '',
  tag_emoji: '',
  image_url: '',
};

function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/boss');
        } else {
          fetchProducts();
        }
      });
  }, [router]);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openNewProductModal();
    }
  }, [searchParams]);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  function openNewProductModal() {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      price_label: product.price_label || '',
      stock: product.stock.toString(),
      is_available: product.is_available,
      tag: product.tag || '',
      tag_emoji: product.tag_emoji || '',
      image_url: product.image_url || '',
    });
    setShowModal(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setForm({ ...form, image_url: data.url });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        price_label: form.price_label || null,
        stock: parseInt(form.stock),
        is_available: form.is_available,
        tag: form.tag || null,
        tag_emoji: form.tag_emoji || null,
        image_url: form.image_url || null,
      };

      if (editingProduct) {
        await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProduct.id, ...payload }),
        });
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      await fetch(`/api/admin/products?id=${product.id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    }
  }

  async function toggleAvailability(product: Product) {
    try {
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          is_available: !product.is_available,
        }),
      });
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
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

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)]">Products</h1>
            <p className="text-[var(--text-soft)]">
              Manage your bakery items
            </p>
          </div>

          <button onClick={openNewProductModal} className="btn-main">
            ➕ Add New Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">🧁</div>
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
              No products yet
            </h3>
            <p className="text-[var(--text-soft)] mb-4">
              Add your first product to get started!
            </p>
            <button onClick={openNewProductModal} className="btn-main">
              Add Product
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const isSoldOut = product.stock <= 0 || !product.is_available;
              return (
                <div
                  key={product.id}
                  className={`card p-4 flex flex-wrap gap-4 items-center ${
                    isSoldOut ? 'opacity-60' : ''
                  }`}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#fefce8] flex-shrink-0">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🧁
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[var(--text-main)] truncate">
                        {product.name}
                      </h3>
                      {isSoldOut && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-soft)] truncate">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                      <span className="font-semibold text-[var(--accent)]">
                        {product.price_label || `$${product.price}`}
                      </span>
                      <span className="text-[var(--text-soft)]">
                        Stock: {product.stock}
                      </span>
                      {product.tag && (
                        <span className="text-[var(--text-soft)]">
                          {product.tag_emoji} {product.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAvailability(product)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        product.is_available
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {product.is_available ? 'Available' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => openEditModal(product)}
                      className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-orange-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="px-3 py-1.5 rounded-full text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[var(--text-main)]">
                  {editingProduct ? 'Edit Product' : 'New Product'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[var(--text-soft)] hover:text-[var(--text-main)] text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-soft)] mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#fefce8] flex-shrink-0 border-2 border-dashed border-[var(--accent-soft)]">
                      {form.image_url ? (
                        <Image
                          src={form.image_url}
                          alt="Preview"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          📷
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-outline text-sm"
                      >
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                      {form.image_url && (
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image_url: '' })}
                          className="ml-2 text-sm text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Birthday Sprinkle Truffles (4-pack)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Fudgy chocolate truffles rolled in rainbow sprinkles..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="10.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                      Price Label (optional)
                    </label>
                    <input
                      type="text"
                      value={form.price_label}
                      onChange={(e) => setForm({ ...form, price_label: e.target.value })}
                      placeholder="from $4 each"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="5"
                  />
                  <p className="text-xs text-[var(--text-soft)] mt-1">
                    Set to 0 to mark as sold out
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                      Tag (optional)
                    </label>
                    <input
                      type="text"
                      value={form.tag}
                      onChange={(e) => setForm({ ...form, tag: e.target.value })}
                      placeholder="Seasonal favourite"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                      Tag Emoji (optional)
                    </label>
                    <input
                      type="text"
                      value={form.tag_emoji}
                      onChange={(e) => setForm({ ...form, tag_emoji: e.target.value })}
                      placeholder="👻"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={form.is_available}
                    onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                    className="w-5 h-5 rounded accent-[var(--accent)]"
                  />
                  <label htmlFor="is_available" className="text-[var(--text-main)]">
                    Available for ordering
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
                    {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center admin-body">
          <div className="text-4xl animate-bounce">🧁</div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
