import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  // Create Supabase client inside function to avoid build-time issues
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const plan_ids = formData.get('plan_ids') as string;
    const plan_titles = formData.get('plan_titles') as string;
    const total_amount = parseInt(formData.get('total_amount') as string);
    const payment_status = formData.get('payment_status') as string || 'pending';
    const screenshot = formData.get('screenshot') as File;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Upload screenshot to Supabase storage if provided
    if (screenshot && screenshot.size > 0) {
      try {
        // Generate unique filename
        const timestamp = Date.now();
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `payment_${timestamp}_${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Convert File to ArrayBuffer
        const arrayBuffer = await screenshot.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('images')
          .upload(fileName, buffer, {
            contentType: screenshot.type,
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      } catch (uploadError) {
        console.error('Failed to upload screenshot:', uploadError);
        return NextResponse.json(
          { error: "Failed to upload screenshot" },
          { status: 500 }
        );
      }
    }

    // Parse plan_ids if it's a string
    const parsedPlanIds = typeof plan_ids === 'string' ? JSON.parse(plan_ids) : plan_ids;

    // Verify plan IDs
    if (!parsedPlanIds || !Array.isArray(parsedPlanIds) || parsedPlanIds.length === 0) {
      return NextResponse.json({ error: "Invalid plan IDs" }, { status: 400 });
    }

    // Fetch plans to verify
    const plansResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/getplans`);
    if (!plansResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
    }
    const plansData = await plansResponse.json();
    const allPlans = plansData.plans || [];

    // Verify each plan ID exists and calculate total
    let calculatedAmount = 0;
    for (const planId of parsedPlanIds) {
      const plan = allPlans.find((p: any) => p.id === planId);
      if (!plan) {
        return NextResponse.json({ error: `Invalid plan ID: ${planId}` }, { status: 400 });
      }
      calculatedAmount += plan.price;
    }

    // Verify amount matches (skip for free plans)
    if (total_amount > 0 && calculatedAmount !== total_amount) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Insert into payments_v2 table
    const { data: result, error } = await supabase
      .from("payments_v2")
      .insert([
        {
          name,
          email,
          phone,
          link: imageUrl,
          plan_ids,
          plan_titles,
          total_amount,
          payment_status,
        },
      ])
      .select("id, created_at")
      .single();

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Payment application submitted successfully!",
      applicationId: result.id,
      createdAt: result.created_at,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint
export async function GET(request: NextRequest) {
  // Create Supabase client inside function to avoid build-time issues
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const limit = Number.parseInt(searchParams.get("limit") || "50");

    let query = supabase.from("payments_v2").select("*").order("created_at", { ascending: false });

    if (email) {
      query = query.eq("email", email);
    } else {
      query = query.limit(limit);
    }

    const { data: result, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      payments: result,
      count: result?.length ?? 0,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
