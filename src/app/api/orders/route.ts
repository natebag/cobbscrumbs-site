import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { isDemoMode, DEMO_ORDERS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

// In-memory store for demo mode orders
const demoOrdersStore = [...DEMO_ORDERS];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Demo mode - store in memory
    if (isDemoMode()) {
      const newOrder = {
        id: `order-${Date.now()}`,
        customer_name: body.customer_name,
        customer_email: body.customer_email || undefined,
        customer_phone: body.customer_phone || undefined,
        preferred_contact: body.preferred_contact || 'whatsapp',
        order_details: body.order_details,
        allergies: body.allergies || undefined,
        notes: body.notes || undefined,
        status: 'pending' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      demoOrdersStore.unshift(newOrder);
      return NextResponse.json(newOrder);
    }

    // Use admin client to bypass RLS for insert
    const supabaseAdmin = createServerClient();

    const { data, error } = await supabaseAdmin.from('orders').insert([
      {
        customer_name: body.customer_name,
        customer_email: body.customer_email || null,
        customer_phone: body.customer_phone || null,
        preferred_contact: body.preferred_contact || 'whatsapp',
        order_details: body.order_details,
        allergies: body.allergies || null,
        notes: body.notes || null,
        status: 'pending',
      },
    ]).select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.[0] || { success: true });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
