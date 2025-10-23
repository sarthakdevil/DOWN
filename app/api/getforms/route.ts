import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { planIds } = await request.json();

    if (!planIds || !Array.isArray(planIds)) {
      return NextResponse.json({ error: 'Plan IDs are required' }, { status: 400 });
    }

    const { data: forms, error } = await supabase
      .from('plans')
      .select('id, google_form_url')
      .in('id', planIds);

    if (error) throw error;

    return NextResponse.json({ forms });
  } catch (error) {
    console.error('Error fetching form URLs:', error);
    return NextResponse.json({ error: 'Failed to fetch form URLs' }, { status: 500 });
  }
}