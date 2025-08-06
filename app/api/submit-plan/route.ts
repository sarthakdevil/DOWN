import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Extract form data
    const {
      planId,
      planTitle,
      planPrice,
      name,
      instagramId,
      email,
      phone,
      gender,
      interestedIn,
      relationshipStyle,
      idealFirstMeeting,
      loveLanguage,
      partyVibe,
      flirtingStyle,
      toxicTrait,
      bollywoodCharacter,
      greenFlag,
      perfectDate,
      pitchYourself,
      agreeToTerms,
      agreeToPrivacy,
      salary,
      paymentMethod,
      paymentId,
      paymentStatus,
      order_id,
      timestamp
    } = data

    // Validate required fields
    if (!name || !instagramId || !email || !phone || !gender || !interestedIn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!agreeToTerms || !agreeToPrivacy) {
      return NextResponse.json({ error: "Must agree to terms and privacy policy" }, { status: 400 })
    }

    // Validate Razorpay payment
    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 })
    }

    if (!order_id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Insert into database
    const result = await sql`
      INSERT INTO plan_applications (
        plan_id, plan_title, plan_price, name, instagram_id, email, phone,
        gender, interested_in, relationship_style, ideal_first_meeting, love_language,
        party_vibe, flirting_style, toxic_trait, bollywood_character, green_flag,
        perfect_date, pitch_yourself, agree_to_terms, agree_to_privacy, 
        salary, payment_method, payment_id, payment_status, order_id, status, created_at
      ) VALUES (
        ${planId}, ${planTitle}, ${planPrice}, ${name}, ${instagramId}, ${email}, ${phone},
        ${gender}, ${interestedIn}, ${relationshipStyle}, ${idealFirstMeeting}, ${loveLanguage},
        ${partyVibe}, ${flirtingStyle}, ${toxicTrait}, ${bollywoodCharacter}, ${greenFlag},
        ${perfectDate}, ${pitchYourself}, ${agreeToTerms}, ${agreeToPrivacy},
        ${salary || null}, ${paymentMethod || 'razorpay'}, ${paymentId}, 
        ${paymentStatus || 'completed'}, ${order_id}, 'pending',
        ${timestamp || new Date().toISOString()}
      ) RETURNING id, created_at
    `

    // Log successful submission
    console.log('Plan application saved successfully:', {
      id: result[0].id,
      email: email,
      planTitle: planTitle,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      orderId: order_id,
      paymentId: paymentId,
      createdAt: result[0].created_at
    })

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! We'll contact you within 24 hours.",
      applicationId: result[0].id,
      paymentId: paymentId,
      orderId: order_id
    })
  } catch (error) {
    console.error("Error submitting plan application:", error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
        return NextResponse.json(
          { error: "Application with this email already exists" }, 
          { status: 409 }
        )
      }
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: "Database schema mismatch. Please contact support." }, 
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to retrieve applications (for admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const paymentId = searchParams.get('paymentId')
    const orderId = searchParams.get('orderId')
    const limit = searchParams.get('limit') || '50'
    
    let result
    
    if (email) {
      result = await sql`
        SELECT * FROM plan_applications 
        WHERE email = ${email} 
        ORDER BY created_at DESC
      `
    } else if (paymentId) {
      result = await sql`
        SELECT * FROM plan_applications 
        WHERE payment_id = ${paymentId} 
        ORDER BY created_at DESC
      `
    } else if (orderId) {
      result = await sql`
        SELECT * FROM plan_applications 
        WHERE order_id = ${orderId} 
        ORDER BY created_at DESC
      `
    } else {
      result = await sql`
        SELECT * FROM plan_applications 
        ORDER BY created_at DESC 
        LIMIT ${parseInt(limit)}
      `
    }
    
    return NextResponse.json({
      success: true,
      applications: result,
      count: result.length
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
