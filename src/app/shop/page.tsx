'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import OrderModal from '@/components/OrderModal';
import { Product } from '@/lib/types';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      // Sort: available first (by sort_order), then sold out at bottom
      const sorted = data.sort((a: Product, b: Product) => {
        const aAvailable = a.stock > 0 && a.is_available;
        const bAvailable = b.stock > 0 && b.is_available;
        if (aAvailable && !bAvailable) return -1;
        if (!aAvailable && bAvailable) return 1;
        return a.sort_order - b.sort_order;
      });
      setProducts(sorted);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <Header />

      <section className="mb-6">
        <h1
          className="text-3xl text-[var(--accent)] mb-2"
          style={{ fontFamily: 'var(--font-pacifico), cursive' }}
        >
          The Shop
        </h1>
        <p className="text-[var(--text-soft)]">
          Browse Emily&apos;s current treats. Click &quot;Order&quot; to send a request via WhatsApp!
        </p>
      </section>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 animate-bounce">🧁</div>
          <p className="text-[var(--text-soft)]">Loading treats...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">🍪</div>
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
            No treats available right now
          </h3>
          <p className="text-[var(--text-soft)] mb-4">
            Emily is busy baking! Check back soon or message her on WhatsApp.
          </p>
          <a
            href="https://wa.me/12269244889"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-main inline-flex"
          >
            💬 Message Emily
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrder={setSelectedProduct}
            />
          ))}
        </div>
      )}

      <div className="card p-5 mt-8 border-dashed text-center">
        <p className="text-[var(--text-soft)]">
          Don&apos;t see what you&apos;re looking for?{' '}
          <a
            href="https://wa.me/12269244889"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] font-semibold hover:underline"
          >
            Message Emily
          </a>{' '}
          for custom orders!
        </p>
      </div>

      <Footer />

      <OrderModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </main>
  );
}
