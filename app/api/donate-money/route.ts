import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, generateDonationConfirmationEmail, generateDonationAdminNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const donationData = await request.json()

    const { guestName, guestEmail, guestPhone, message } = donationData

    console.log("💾 Saving donation request to database:", donationData)

    const donorEmailHtml = generateDonationConfirmationEmail({
      guestName,
      guestEmail,
      message,
    })

    await sendEmail({
      to: guestEmail,
      subject: "💝 Bank Transfer Instructions for Your Money Gift",
      html: donorEmailHtml,
    })

    const adminEmailHtml = generateDonationAdminNotification({
      guestName,
      guestEmail,
      guestPhone,
      message,
    })

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@birthdaywishlist.com",
      subject: `💰 New Money Gift Request from ${guestName}`,
      html: adminEmailHtml,
    })

    const corsHeaders = {
      "Access-Control-Allow-Origin": process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    }

    return NextResponse.json(
      {
        success: true,
        message: "Donation request processed and emails sent!",
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("Donation API error:", error)
    return NextResponse.json(
      { error: "Failed to process donation request" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  })
}
