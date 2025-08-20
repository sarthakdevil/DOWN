import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Extract form data
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
    } = data

    // Validate required fields
    if (!name || !email || !phone || !razorpay_order_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert into database
    const result = await sql`
      INSERT INTO payments (
        name, email, phone, razorpay_order_id, razorpay_payment_id,
        plan_ids, plan_titles, total_amount, payment_status
      ) VALUES (
        ${name}, ${email}, ${phone}, ${razorpay_order_id}, ${razorpay_payment_id || null},
        ${plan_ids}, ${plan_titles}, ${total_amount}, ${payment_status || "completed"}
      ) RETURNING id, created_at
    `

    console.log("Application saved successfully:", {
      id: result[0].id,
      email: email,
      razorpay_order_id: razorpay_order_id,
      total_amount: total_amount,
      createdAt: result[0].created_at,
    })

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      applicationId: result[0].id,
    })
  } catch (error) {
    console.error("Error submitting application:", error)

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("duplicate key") || error.message.includes("unique constraint")) {
        return NextResponse.json({ error: "Application with this order ID already exists" }, { status: 409 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to retrieve applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const orderId = searchParams.get("orderId")
    const limit = searchParams.get("limit") || "50"

    let result

    if (email) {
      result = await sql`
        SELECT * FROM plan_applications 
        WHERE email = ${email} 
        ORDER BY created_at DESC
      `
    } else if (orderId) {
      result = await sql`
        SELECT * FROM plan_applications 
        WHERE razorpay_order_id = ${orderId} 
        ORDER BY created_at DESC
      `
    } else {
      result = await sql`
        SELECT * FROM plan_applications 
        ORDER BY created_at DESC 
        LIMIT ${Number.parseInt(limit)}
      `
    }

    return NextResponse.json({
      success: true,
      applications: result,
      count: result.length,
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
