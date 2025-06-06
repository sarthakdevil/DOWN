import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form data
    const planId = formData.get("planId") as string
    const planTitle = formData.get("planTitle") as string
    const planPrice = Number.parseInt(formData.get("planPrice") as string)
    const name = formData.get("name") as string
    const instagramId = formData.get("instagramId") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const gender = formData.get("gender") as string
    const interestedIn = formData.get("interestedIn") as string
    const relationshipStyle = formData.get("relationshipStyle") as string
    const idealFirstMeeting = formData.get("idealFirstMeeting") as string
    const loveLanguage = formData.get("loveLanguage") as string
    const partyVibe = formData.get("partyVibe") as string
    const flirtingStyle = formData.get("flirtingStyle") as string
    const toxicTrait = formData.get("toxicTrait") as string
    const bollywoodCharacter = formData.get("bollywoodCharacter") as string
    const greenFlag = formData.get("greenFlag") as string
    const perfectDate = formData.get("perfectDate") as string
    const pitchYourself = formData.get("pitchYourself") as string
    const agreeToTerms = formData.get("agreeToTerms") === "true"
    const agreeToPrivacy = formData.get("agreeToPrivacy") === "true"
    const paymentScreenshot = formData.get("paymentScreenshot") as File

    // Validate required fields
    if (!name || !instagramId || !email || !phone || !gender || !interestedIn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!agreeToTerms || !agreeToPrivacy) {
      return NextResponse.json({ error: "Must agree to terms and privacy policy" }, { status: 400 })
    }

    if (!paymentScreenshot) {
      return NextResponse.json({ error: "Payment screenshot is required" }, { status: 400 })
    }

    // Convert file to buffer for database storage
    const fileBuffer = await paymentScreenshot.arrayBuffer()
    const fileData = Buffer.from(fileBuffer)

    // Generate filename for reference
    const paymentScreenshotUrl = `payment_screenshots/${Date.now()}_${paymentScreenshot.name}`

    // Insert into database
    const result = await sql`
      INSERT INTO plan_applications (
        plan_id, plan_title, plan_price, name, instagram_id, email, phone,
        gender, interested_in, relationship_style, ideal_first_meeting, love_language,
        party_vibe, flirting_style, toxic_trait, bollywood_character, green_flag,
        perfect_date, pitch_yourself, payment_screenshot_url, payment_screenshot_data,
        agree_to_terms, agree_to_privacy, status
      ) VALUES (
        ${planId}, ${planTitle}, ${planPrice}, ${name}, ${instagramId}, ${email}, ${phone},
        ${gender}, ${interestedIn}, ${relationshipStyle}, ${idealFirstMeeting}, ${loveLanguage},
        ${partyVibe}, ${flirtingStyle}, ${toxicTrait}, ${bollywoodCharacter}, ${greenFlag},
        ${perfectDate}, ${pitchYourself}, ${paymentScreenshotUrl}, ${fileData},
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
