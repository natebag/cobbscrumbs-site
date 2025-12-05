'use client';

import { useState } from 'react';
import { CartItem } from '@/lib/cart-context';

interface CheckoutModalProps {
  items: CartItem[];
  onClose: () => void;
  onComplete: () => void;
}

const WHATSAPP_NUMBER = '12269244889';
const INSTAGRAM_HANDLE = 'cobbscrumbs';

export default function CheckoutModal({ items, onClose, onComplete }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'text',
    allergies: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build order details string
    const orderDetails = items
      .map((item) => `${item.quantity}x ${item.product.name}`)
      .join(', ');

    // Build the message for optional sharing
    const itemsList = items
      .map(
        (item) =>
          `${item.quantity}x ${item.product.name} (${item.product.price_label || '$' + item.product.price})`
      )
      .join('\n');

    const message =
      `Hi Emily! I'd like to order:\n\n` +
      `${itemsList}\n\n` +
      `Estimated Total: $${total.toFixed(2)}\n\n` +
      `Name: ${formData.name}\n` +
      (formData.phone ? `Phone: ${formData.phone}\n` : '') +
      (formData.email ? `Email: ${formData.email}\n` : '') +
      (formData.allergies ? `Allergies/Dietary: ${formData.allergies}\n` : '') +
      (formData.notes ? `Notes: ${formData.notes}\n` : '') +
      `\nPreferred contact: ${formData.preferredContact}`;

    setOrderMessage(message);

    // Save to database
    try {
      const response = await fetch('/api/orders', {
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

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('Something went wrong. Please try again or contact Emily directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`,
      '_blank'
    );
  };

  const openInstagram = () => {
    window.open(`https://instagram.com/${INSTAGRAM_HANDLE}`, '_blank');
  };

  const openEmail = () => {
    window.open(
      `mailto:?subject=Cobb's Crumbs Order&body=${encodeURIComponent(orderMessage)}`,
      '_blank'
    );
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="card p-6 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
            Order Submitted!
          </h3>
          <p className="text-[var(--text-soft)] mb-6">
            Emily has received your order for {items.length} item{items.length !== 1 ? 's' : ''} and
            will get back to you soon via <strong>{formData.preferredContact}</strong>.
          </p>

          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-[var(--text-soft)]">
              Want to reach out directly?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={openWhatsApp}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                💬 WhatsApp
              </button>
              <button
                onClick={openInstagram}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-pink-500 text-white hover:bg-pink-600 transition-colors"
              >
                📸 Instagram
              </button>
              <button
                onClick={openEmail}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                ✉️ Email
              </button>
            </div>
          </div>

          <button onClick={onComplete} className="btn-main w-full">
            Done
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
              Complete Your Order
            </h3>
            <p className="text-[var(--text-soft)] text-sm">
              {items.length} item{items.length !== 1 ? 's' : ''} &bull; ${total.toFixed(2)} estimated
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-soft)] hover:text-[var(--text-main)] text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-[var(--accent-soft)] rounded-xl p-3 mb-4">
          <p className="text-xs font-semibold text-[var(--text-soft)] mb-2">ORDER SUMMARY</p>
          <div className="space-y-1">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.product.name}
                </span>
                <span className="text-[var(--text-soft)]">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
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
                Phone (optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Your number"
              />
            </div>
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
              <option value="text">Text Message</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram DM</option>
              <option value="email">Email</option>
            </select>
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
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-main flex-1 justify-center"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>

          <p className="text-xs text-center text-[var(--text-soft)]">
            Your order will be saved and Emily will contact you via your preferred method.
          </p>
        </form>
      </div>
    </div>
  );
}
