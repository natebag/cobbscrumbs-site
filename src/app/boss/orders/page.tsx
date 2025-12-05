'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import { Order, OrderStatus, Product } from '@/lib/types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/boss');
        } else {
          fetchData();
        }
      });
  }, [router]);

  async function fetchData() {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/products'),
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  }

  // Calculate estimated total from order_details string like "2x Product Name, 1x Other Product"
  function calculateEstimatedTotal(orderDetails: string): number | null {
    if (!products.length) return null;

    let total = 0;
    let foundAny = false;

    // Split by comma and process each item
    const items = orderDetails.split(',').map((s) => s.trim());

    for (const item of items) {
      // Match pattern like "2x Product Name" or "1x Product Name"
      const match = item.match(/^(\d+)x\s+(.+)$/i);
      if (match) {
        const quantity = parseInt(match[1], 10);
        const productName = match[2].trim();

        // Find product by name (case-insensitive partial match)
        const product = products.find(
          (p) => p.name.toLowerCase() === productName.toLowerCase() ||
                 productName.toLowerCase().includes(p.name.toLowerCase()) ||
                 p.name.toLowerCase().includes(productName.toLowerCase())
        );

        if (product) {
          total += product.price * quantity;
          foundAny = true;
        }
      }
    }

    return foundAny ? total : null;
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-body">
        <div className="text-4xl animate-bounce">📦</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-body">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <AdminNav />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)]">Orders</h1>
            <p className="text-[var(--text-soft)]">
              Manage customer order requests
            </p>
          </div>

          <div className="flex gap-2">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  filter === s
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-soft)] hover:bg-[var(--accent-soft)]'
                }`}
              >
                {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
              No orders yet
            </h3>
            <p className="text-[var(--text-soft)]">
              When customers place orders, they&apos;ll show up here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const estimatedTotal = calculateEstimatedTotal(order.order_details);

              return (
                <div key={order.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-[var(--text-main)]">
                          {order.customer_name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            STATUS_CONFIG[order.status].bg
                          } ${STATUS_CONFIG[order.status].color}`}
                        >
                          {STATUS_CONFIG[order.status].label}
                        </span>
                        {estimatedTotal !== null && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--accent)] text-white">
                            ~${estimatedTotal.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-soft)]">
                        {formatDate(order.created_at)} &bull; Prefers {order.preferred_contact}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="px-3 py-1.5 rounded-full text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-full text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-[var(--bg)] rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-semibold text-[var(--text-soft)] uppercase">
                        Order Details
                      </h4>
                      {estimatedTotal !== null && (
                        <span className="text-sm font-bold text-[var(--accent)]">
                          Est. ${estimatedTotal.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--text-main)]">{order.order_details}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    {order.customer_email && (
                      <div>
                        <span className="text-[var(--text-soft)]">Email:</span>{' '}
                        <a
                          href={`mailto:${order.customer_email}`}
                          className="text-[var(--accent)] hover:underline"
                        >
                          {order.customer_email}
                        </a>
                      </div>
                    )}
                    {order.customer_phone && (
                      <div>
                        <span className="text-[var(--text-soft)]">Phone:</span>{' '}
                        <a
                          href={`tel:${order.customer_phone}`}
                          className="text-[var(--accent)] hover:underline"
                        >
                          {order.customer_phone}
                        </a>
                      </div>
                    )}
                    {order.allergies && (
                      <div className="sm:col-span-2">
                        <span className="text-[var(--text-soft)]">Allergies:</span>{' '}
                        <span className="text-red-600 font-medium">{order.allergies}</span>
                      </div>
                    )}
                  </div>

                  {order.notes && (
                    <div className="mt-3 pt-3 border-t border-[var(--accent-soft)]">
                      <span className="text-xs font-semibold text-[var(--text-soft)] uppercase">
                        Notes:
                      </span>{' '}
                      <span className="text-[var(--text-main)]">{order.notes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
