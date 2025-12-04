import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isDemoMode, DEMO_PRODUCTS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Demo mode - return fake products for shop
  if (isDemoMode()) {
    return NextResponse.json(DEMO_PRODUCTS);
  }

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
