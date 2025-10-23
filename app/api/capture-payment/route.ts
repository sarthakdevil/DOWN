import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { paymentId, amount } = await request.json()

    const response = await razorpay.payments.capture(paymentId, amount * 100, "INR")


    return NextResponse.json({ success: true, payment: response })
  } catch (error) {
    console.error("Payment capture failed:", error)
    return NextResponse.json({ success: false, error: "Failed to capture payment" }, { status: 500 })
  }
}
