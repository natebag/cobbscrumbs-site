'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isCartOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCheckoutComplete = () => {
    setShowCheckout(false);
    setIsCartOpen(false);
    clearCart();
  };

  if (showCheckout) {
    return (
      <CheckoutModal
        items={items}
        onClose={() => setShowCheckout(false)}
        onComplete={handleCheckoutComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[var(--bg)] h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[var(--accent-soft)] flex items-center justify-between">
          <h2
            className="text-xl text-[var(--accent)]"
            style={{ fontFamily: 'var(--font-pacifico), cursive' }}
          >
            Your Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-[var(--text-soft)] hover:text-[var(--text-main)] text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-[var(--text-soft)]">Your cart is empty</p>
              <p className="text-sm text-[var(--text-soft)] mt-1">
                Add some goodies from the shop!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="card p-4 flex gap-4"
                >
                  {/* Product image placeholder */}
                  <div className="w-16 h-16 bg-[var(--accent-soft)] rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {item.product.tag_emoji || '🧁'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-main)] truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-[var(--accent)] font-semibold">
                      {item.product.price_label || `$${item.product.price}`}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-[var(--accent-soft)] text-[var(--text-main)] font-bold hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-[var(--accent-soft)] text-[var(--text-main)] font-bold hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-red-400 hover:text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--accent-soft)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--text-soft)]">Estimated Total:</span>
              <span className="text-xl font-bold text-[var(--text-main)]">
                ${total.toFixed(2)}
              </span>
            </div>
            <button onClick={handleCheckout} className="btn-main w-full justify-center">
              Continue to Order
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 text-sm text-[var(--text-soft)] hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
