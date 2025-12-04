import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import { isDemoMode, DEMO_SITE_CONTENT } from '@/lib/demo-data';
import { SiteContent } from '@/lib/types';

export const dynamic = 'force-dynamic';

// In-memory store for demo mode
let demoContent = { ...DEMO_SITE_CONTENT };

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo mode
  if (isDemoMode()) {
    return NextResponse.json(demoContent);
  }

  try {
    const supabaseAdmin = createServerClient();
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('content_key, content_value');

    if (error) throw error;

    // Convert array of key-value pairs to object
    const content: Partial<SiteContent> = {};
    for (const row of data || []) {
      content[row.content_key as keyof SiteContent] = row.content_value;
    }

    // Fill in any missing values with defaults
    const fullContent: SiteContent = {
      site_title: content.site_title || DEMO_SITE_CONTENT.site_title,
      tagline: content.tagline || DEMO_SITE_CONTENT.tagline,
      hero_heading: content.hero_heading || DEMO_SITE_CONTENT.hero_heading,
      hero_description: content.hero_description || DEMO_SITE_CONTENT.hero_description,
      hero_note: content.hero_note || DEMO_SITE_CONTENT.hero_note,
      about_title: content.about_title || DEMO_SITE_CONTENT.about_title,
      about_text: content.about_text || DEMO_SITE_CONTENT.about_text,
      about_instagram: content.about_instagram || DEMO_SITE_CONTENT.about_instagram,
      instagram_handle: content.instagram_handle || DEMO_SITE_CONTENT.instagram_handle,
      whatsapp_number: content.whatsapp_number || DEMO_SITE_CONTENT.whatsapp_number,
    };

    return NextResponse.json(fullContent);
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates: Partial<SiteContent> = await request.json();

    // Demo mode - update in-memory store
    if (isDemoMode()) {
      demoContent = { ...demoContent, ...updates };
      return NextResponse.json(demoContent);
    }

    const supabaseAdmin = createServerClient();

    // Update each field that was provided
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        const { error } = await supabaseAdmin
          .from('site_content')
          .upsert(
            { content_key: key, content_value: value },
            { onConflict: 'content_key' }
          );

        if (error) throw error;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating site content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
