import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, from = "noreply@birthdaywishlist.com" } = await request.json()

    const corsHeaders = {
      "Access-Control-Allow-Origin": process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)

      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || from,
        to,
        subject,
        html,
      })

      if (error) {
        console.error("Email sending error:", error)
        return NextResponse.json(
          { error: "Failed to send email", details: error },
          {
            status: 500,
            headers: corsHeaders,
          },
        )
      }

      return NextResponse.json({ success: true, data }, { headers: corsHeaders })
    }

    // Fallback to demo mode if no API key
    console.log("📧 Email would be sent:", { to, subject, from })
    console.log("📧 Email content preview:", html.substring(0, 200) + "...")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully (demo mode - add RESEND_API_KEY to enable real emails)",
        id: `demo_${Date.now()}`,
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
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
