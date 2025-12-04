import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import { isDemoMode, DEMO_PRODUCTS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo mode - return fake products
  if (isDemoMode()) {
    return NextResponse.json(DEMO_PRODUCTS);
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo mode - pretend to create
  if (isDemoMode()) {
    const body = await request.json();
    return NextResponse.json({
      id: `demo-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  try {
    const body = await request.json();

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: body.name,
          description: body.description || '',
          price: body.price,
          price_label: body.price_label || null,
          image_url: body.image_url || null,
          stock: body.stock || 0,
          is_available: body.is_available ?? true,
          tag: body.tag || null,
          tag_emoji: body.tag_emoji || null,
          sort_order: body.sort_order || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
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
    return NextResponse.json({
      ...body,
      updated_at: new Date().toISOString(),
    });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo mode - pretend to delete
  if (isDemoMode()) {
    return NextResponse.json({ success: true });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
