import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import { isDemoMode, DEMO_FEATURED } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo mode - return all featured items (including hidden)
  if (isDemoMode()) {
    return NextResponse.json(DEMO_FEATURED);
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('featured_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to fetch featured items:', error);
    return NextResponse.json({ error: 'Failed to fetch featured items' }, { status: 500 });
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
      id: `featured-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  try {
    const body = await request.json();

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('featured_items')
      .insert([
        {
          emoji: body.emoji || '✨',
          title: body.title,
          description: body.description || '',
          sort_order: body.sort_order || 0,
          is_visible: body.is_visible ?? true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to create featured item:', error);
    return NextResponse.json({ error: 'Failed to create featured item' }, { status: 500 });
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
      .from('featured_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update featured item:', error);
    return NextResponse.json({ error: 'Failed to update featured item' }, { status: 500 });
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
      return NextResponse.json({ error: 'Featured item ID required' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from('featured_items').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete featured item:', error);
    return NextResponse.json({ error: 'Failed to delete featured item' }, { status: 500 });
  }
}
