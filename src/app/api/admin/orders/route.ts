import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import { isDemoMode, DEMO_ORDERS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo mode - return fake orders
  if (isDemoMode()) {
    return NextResponse.json(DEMO_ORDERS);
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo mode - pretend to update
  if (isDemoMode()) {
    const body = await request.json();
    const order = DEMO_ORDERS.find(o => o.id === body.id);
    return NextResponse.json({
      ...order,
      status: body.status,
      updated_at: new Date().toISOString(),
    });
  }

  try {
    const { id, status } = await request.json();

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
