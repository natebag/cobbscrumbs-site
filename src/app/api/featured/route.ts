import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isDemoMode, DEMO_FEATURED } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Demo mode - return fake featured items
  if (isDemoMode()) {
    return NextResponse.json(DEMO_FEATURED.filter(f => f.is_visible));
  }

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('featured_items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to fetch featured items:', error);
    return NextResponse.json({ error: 'Failed to fetch featured items' }, { status: 500 });
  }
}
