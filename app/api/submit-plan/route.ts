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
      paymentScreenshotUrl,
      agreeToTerms,
      agreeToPrivacy,
    } = data

    // Validate required fields
    if (!name || !instagramId || !email || !phone || !gender || !interestedIn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!agreeToTerms || !agreeToPrivacy) {
      return NextResponse.json({ error: "Must agree to terms and privacy policy" }, { status: 400 })
    }

    if (!paymentScreenshotUrl) {
      return NextResponse.json({ error: "Payment screenshot is required" }, { status: 400 })
    }

    // Insert into database
    const result = await sql`
      INSERT INTO plan_applications (
        plan_id, plan_title, plan_price, name, instagram_id, email, phone,
        gender, interested_in, relationship_style, ideal_first_meeting, love_language,
        party_vibe, flirting_style, toxic_trait, bollywood_character, green_flag,
        perfect_date, pitch_yourself, payment_screenshot_url,
        agree_to_terms, agree_to_privacy, status
      ) VALUES (
        ${planId}, ${planTitle}, ${planPrice}, ${name}, ${instagramId}, ${email}, ${phone},
        ${gender}, ${interestedIn}, ${relationshipStyle}, ${idealFirstMeeting}, ${loveLanguage},
        ${partyVibe}, ${flirtingStyle}, ${toxicTrait}, ${bollywoodCharacter}, ${greenFlag},
        ${perfectDate}, ${pitchYourself}, ${paymentScreenshotUrl},
        ${agreeToTerms}, ${agreeToPrivacy}, 'pending'
      ) RETURNING id
    `

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! We'll contact you within 24 hours.",
      applicationId: result[0].id,
    })
  } catch (error) {
    console.error("Error submitting plan application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
