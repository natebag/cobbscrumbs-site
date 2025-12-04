'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';

interface OrderModalProps {
  product: Product | null;
  onClose: () => void;
}

const WHATSAPP_NUMBER = '12269244889';

export default function OrderModal({ product, onClose }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'whatsapp',
    quantity: 1,
    allergies: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderDetails = `${formData.quantity}x ${product.name}`;

    // Save to database
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          preferred_contact: formData.preferredContact,
          order_details: orderDetails,
          allergies: formData.allergies,
          notes: formData.notes,
        }),
      });
    } catch (error) {
      console.error('Failed to save order:', error);
    }

    // Create WhatsApp message
    const message = encodeURIComponent(
      `Hi Emily! I'd like to order:\n\n` +
        `${formData.quantity}x ${product.name} (${product.price_label || '$' + product.price})\n\n` +
        `Name: ${formData.name}\n` +
        (formData.phone ? `Phone: ${formData.phone}\n` : '') +
        (formData.allergies ? `Allergies/Dietary: ${formData.allergies}\n` : '') +
        (formData.notes ? `Notes: ${formData.notes}\n` : '') +
        `\nPreferred contact: ${formData.preferredContact}`
    );

    setIsSubmitting(false);
    setSubmitted(true);

    // Open WhatsApp after a brief delay
    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    }, 500);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="card p-6 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
            Order Request Sent!
          </h3>
          <p className="text-[var(--text-soft)] mb-4">
            WhatsApp should be opening now. If it didn&apos;t, you can message Emily directly
            at her WhatsApp number.
          </p>
          <button onClick={onClose} className="btn-main">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">
              Order {product.name}
            </h3>
            <p className="text-[var(--accent)] font-semibold">
              {product.price_label || `$${product.price}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-soft)] hover:text-[var(--text-main)] text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="What should Emily call you?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Your number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
                Best way to reach you?
              </label>
              <select
                value={formData.preferredContact}
                onChange={(e) =>
                  setFormData({ ...formData, preferredContact: e.target.value })
                }
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram DM</option>
                <option value="text">Text Message</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
              Allergies / Dietary Needs
            </label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="Nut-free, gluten-free, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-soft)] mb-1">
              Notes (dates, themes, special requests)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Needed by Friday, blue theme, it's for a birthday, etc."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-main flex-1 justify-center"
            >
              {isSubmitting ? 'Sending...' : 'Send via WhatsApp'}
            </button>
          </div>

          <p className="text-xs text-center text-[var(--text-soft)]">
            This will save your request and open WhatsApp so you can chat with Emily directly.
          </p>
        </form>
      </div>
    </div>
  );
}
