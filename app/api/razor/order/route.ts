import { type NextRequest, NextResponse } from "next/server"
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()

    const options = {
      amount: amount * 100, // amount in paise (INR) – e.g., ₹100 = 10000
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    
    console.log('Razorpay order created:', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    })
    
    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order creation failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}