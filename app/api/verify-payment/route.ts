import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for server routes
)

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id,cartItems, customerInfo } = await request.json()

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")


    // Store payment details in database
    const { data: paymentRecord, error } = await supabase
      .from("payments")
      .insert([
        {
          razorpay_order_id,
          razorpay_payment_id,
          total_amount: cartItems.reduce((sum: number, item: any) => sum + item.price, 0),
          currency: 'INR',
          payment_status: 'completed',
          plan_ids: JSON.stringify(cartItems.map((item: any) => item.id)),
          plan_titles: JSON.stringify(cartItems.map((item: any) => item.title)),
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
      ])
      .select("id")
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to store payment" }, { status: 500 })
    }

    console.log("Payment verified and stored:", {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      recordId: paymentRecord.id,
    })

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: paymentRecord.id,
    })
  } catch (error) {
    console.error("Payment verification failed:", error)
    return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 500 })
  }
}
