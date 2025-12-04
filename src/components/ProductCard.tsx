'use client';

import Image from 'next/image';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onOrder?: (product: Product) => void;
}

export default function ProductCard({ product, onOrder }: ProductCardProps) {
  const isSoldOut = product.stock <= 0 || !product.is_available;

  return (
    <article
      className={`card p-3 transition-all ${
        isSoldOut ? 'opacity-60 grayscale' : 'hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      <div className="relative rounded-xl overflow-hidden mb-3 bg-[#fefce8] aspect-[4/3]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🧁
          </div>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[var(--text-main)] font-bold px-4 py-2 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="font-bold text-[var(--text-main)]">{product.name}</h3>
        <span className="font-bold text-[var(--accent)] whitespace-nowrap">
          {product.price_label || `$${product.price}`}
        </span>
      </div>

      <p className="text-sm text-[var(--text-soft)] mb-3">{product.description}</p>

      {product.tag && (
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#fffbeb] border border-[#fde68a] text-[#854d0e]">
            {!isSoldOut && <span className="w-2 h-2 rounded-full bg-green-500" />}
            {product.tag_emoji && <span>{product.tag_emoji}</span>}
            {product.tag}
          </span>
        </div>
      )}

      {!isSoldOut && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-soft)]">
            {product.stock} available
          </span>
          <button
            onClick={() => onOrder?.(product)}
            className="btn-main text-sm py-2 px-4"
          >
            Order
          </button>
        </div>
      )}
    </article>
  );
}
