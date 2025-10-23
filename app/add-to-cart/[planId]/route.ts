import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { planId: string } }
) {
  try {
    const planId = params.planId;

    if (!planId) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Fetch plan details from Supabase
    const { data: plan, error: fetchError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (fetchError || !plan) {
      console.error('Plan not found:', fetchError);
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Create cart item
    const cartItem = {
      id: plan.id,
      title: plan.title,
      price: plan.price,
      icon: "/logo.jpg",
      category: plan.period || "Plan",
      href: plan.google_form_url,
      quantity: 1,
    };

    // Redirect to cart with plan data in URL parameters
    const cartUrl = new URL('/cart', request.url);
    cartUrl.searchParams.append('addPlan', JSON.stringify(cartItem));

    return NextResponse.redirect(cartUrl);

  } catch (error) {
    console.error('Error in add-to-cart API:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
