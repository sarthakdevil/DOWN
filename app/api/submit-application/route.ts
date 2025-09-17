import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for server routes
);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      name,
      email,
      phone,
      razorpay_order_id,
      razorpay_payment_id,
      plan_ids,
      plan_titles,
      total_amount,
      payment_status,
    } = data;

    if (!name || !email || !phone || !razorpay_order_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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

    // Insert into plan_applications table
    const { data: result, error } = await supabase
      .from("payments")
      .insert([
        {
          name,
          email,
          phone,
          razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id || null,
          plan_ids,
          plan_titles,
          total_amount,
          payment_status: payment_status || "completed",
        },
      ])
      .select("id, created_at")
      .single();

    if (error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          { error: "Application with this order ID already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      applicationId: result.id,
      createdAt: result.created_at,
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
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const orderId = searchParams.get("orderId");
    const limit = Number.parseInt(searchParams.get("limit") || "50");

    let query = supabase.from("plan_applications").select("*").order("created_at", { ascending: false });

    if (email) {
      query = query.eq("email", email);
    } else if (orderId) {
      query = query.eq("razorpay_order_id", orderId);
    } else {
      query = query.limit(limit);
    }

    const { data: result, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      applications: result,
      count: result?.length ?? 0,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
