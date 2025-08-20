import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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
    const paymentRecord = await sql`
      INSERT INTO payments (
        razorpay_order_id,
        razorpay_payment_id,
        amount,
        currency,
        status,
        cart_items,
        customer_info,
        created_at
      ) VALUES (
        ${razorpay_order_id},
        ${razorpay_payment_id},
        ${cartItems.reduce((sum: number, item: any) => sum + item.price, 0)},
        'INR',
        'completed',
        ${JSON.stringify(cartItems)},
        ${JSON.stringify(customerInfo)},
        NOW()
      ) RETURNING id
    `

    console.log("Payment verified and stored:", {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      recordId: paymentRecord[0].id,
    })

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: paymentRecord[0].id,
    })
  } catch (error) {
    console.error("Payment verification failed:", error)
    return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 500 })
  }
}
