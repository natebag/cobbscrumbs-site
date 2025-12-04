import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createSession, setSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Demo password for local testing without Supabase
const DEMO_PASSWORD = 'demo';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    // Check for demo mode (when Supabase isn't configured)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isDemo = !supabaseUrl || supabaseUrl.includes('placeholder');

    if (isDemo) {
      // Demo mode - use simple password
      if (password !== DEMO_PASSWORD) {
        return NextResponse.json({ error: 'Invalid password. Try "demo" for demo mode!' }, { status: 401 });
      }
    } else {
      // Production mode - check database
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'admin_password')
        .single();

      if (error) {
        console.error('Failed to fetch admin password:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
      }

      if (password !== data?.setting_value) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
    }

    // Create session
    const token = await createSession();
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
