import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import { isDemoMode, DEMO_PRODUCTS, DEMO_ORDERS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo mode - return fake stats
  if (isDemoMode()) {
    const pendingOrders = DEMO_ORDERS.filter(o => o.status === 'pending').length;
    const totalProducts = DEMO_PRODUCTS.length;
    const availableProducts = DEMO_PRODUCTS.filter(p => p.stock > 0 && p.is_available).length;
    const soldOutProducts = DEMO_PRODUCTS.filter(p => p.stock <= 0 || !p.is_available).length;

    return NextResponse.json({
      pendingOrders,
      totalProducts,
      availableProducts,
      soldOutProducts,
    });
  }

  try {
    const supabase = createServerClient();

    // Get pending orders count
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get products stats
    const { data: products } = await supabase.from('products').select('stock, is_available');

    const totalProducts = products?.length || 0;
    const availableProducts =
      products?.filter((p) => p.stock > 0 && p.is_available).length || 0;
    const soldOutProducts =
      products?.filter((p) => p.stock <= 0 || !p.is_available).length || 0;

    return NextResponse.json({
      pendingOrders: pendingOrders || 0,
      totalProducts,
      availableProducts,
      soldOutProducts,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
