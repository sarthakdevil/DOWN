import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { amount, planIds } = await request.json()

    // Verify plan IDs and amount
    if (!planIds || !Array.isArray(planIds) || planIds.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid plan IDs" }, { status: 400 })
    }

    // Fetch plans from database
    const plansResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/getplans`)
    if (!plansResponse.ok) {
      return NextResponse.json({ success: false, error: "Failed to fetch plans" }, { status: 500 })
    }
    const plansData = await plansResponse.json()
    const allPlans = plansData.plans || []

    // Verify each plan ID exists and calculate total
    let calculatedAmount = 0
    for (const planId of planIds) {
      const plan = allPlans.find((p: any) => p.id === planId)
      if (!plan) {
        return NextResponse.json({ success: false, error: `Invalid plan ID: ${planId}` }, { status: 400 })
      }
      calculatedAmount += plan.price
    }

    // Verify amount matches
    if (calculatedAmount !== amount) {
      return NextResponse.json({ success: false, error: "Amount mismatch" }, { status: 400 })
    }

    const options = {
      amount: amount * 100, // amount in paise (INR) – e.g., ₹100 = 10000
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)


    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Order creation failed:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
