import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isDemoMode, DEMO_SITE_CONTENT } from '@/lib/demo-data';
import { SiteContent } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Demo mode - return demo content
  if (isDemoMode()) {
    return NextResponse.json(DEMO_SITE_CONTENT);
  }

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content_key, content_value');

    if (error) {
      console.error('Error fetching site content:', error);
      return NextResponse.json(DEMO_SITE_CONTENT);
    }

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
    return NextResponse.json(DEMO_SITE_CONTENT);
  }
}
