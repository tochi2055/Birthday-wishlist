// Email service utilities for sending notifications
interface EmailData {
  to: string
  subject: string
  html: string
  from?: string
}

interface ReservationEmailData {
  guestName: string
  guestEmail: string
  items: Array<{
    title: string
  }>
  includeWine: boolean
  includeFlowers: boolean
  message?: string
}

interface DonationEmailData {
  guestName: string
  guestEmail: string
  message?: string
}

interface DonationAdminEmailData {
  guestName: string
  guestEmail: string
  guestPhone?: string
  message?: string
}

// Email templates
export const generateReservationConfirmationEmail = (data: ReservationEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Gift Reservation Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ec4899; }
        .addon { background: #fef3f4; padding: 10px; margin: 5px 0; border-radius: 6px; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Gift Reservation Confirmed!</h1>
          <p>Thank you for making Sarah's birthday special</p>
        </div>
        <div class="content">
          <h2>Hello ${data.guestName}!</h2>
          <p>Your gift reservation has been confirmed. Here are the details:</p>
          
          <h3>Reserved Items:</h3>
          ${data.items
            .map(
              (item) => `
            <div class="item">
              <strong>${item.title}</strong>
            </div>
          `,
            )
            .join("")}
          
          ${data.includeWine ? '<div class="addon">🍷 Wine Selection</div>' : ""}
          ${data.includeFlowers ? '<div class="addon">🌸 Fresh Flowers</div>' : ""}
          
          ${
            data.message
              ? `
            <h3>Your Message:</h3>
            <p style="font-style: italic; background: white; padding: 15px; border-radius: 8px;">"${data.message}"</p>
          `
              : ""
          }
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Your gifts are now reserved and won't be available to other guests</li>
            <li>You'll receive a reminder email closer to the birthday</li>
            <li>If you have any questions, just reply to this email</li>
          </ul>
          
          <p>Thank you for being part of Sarah's special day! 🎂</p>
        </div>
        <div class="footer">
          <p>Made with ❤️ for birthdays</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const generateAdminNotificationEmail = (data: ReservationEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Gift Reservation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .guest-info { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .item { background: #fef3f4; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .addon { background: #f3f4f6; padding: 10px; margin: 5px 0; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎁 New Gift Reservation</h1>
          <p>Someone just reserved gifts for Sarah's birthday!</p>
        </div>
        <div class="content">
          <div class="guest-info">
            <h3>Guest Information:</h3>
            <p><strong>Name:</strong> ${data.guestName}</p>
            <p><strong>Email:</strong> ${data.guestEmail}</p>
          </div>
          
          <h3>Reserved Items:</h3>
          ${data.items
            .map(
              (item) => `
            <div class="item">
              <strong>${item.title}</strong>
            </div>
          `,
            )
            .join("")}
          
          ${data.includeWine ? '<div class="addon">🍷 Wine Selection</div>' : ""}
          ${data.includeFlowers ? '<div class="addon">🌸 Fresh Flowers</div>' : ""}
          
          ${
            data.message
              ? `
            <h3>Guest Message:</h3>
            <p style="font-style: italic; background: white; padding: 15px; border-radius: 8px;">"${data.message}"</p>
          `
              : ""
          }
          
          <p>You can view all reservations in your <a href="/admin/dashboard">admin dashboard</a>.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const generateDonationConfirmationEmail = (data: DonationEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Money Gift Instructions</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .bank-details { background: white; padding: 20px; border-radius: 8px; border: 2px solid #10b981; margin: 20px 0; }
        .important { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💝 Thank You for Your Money Gift!</h1>
          <p>Your contribution means so much to Sarah</p>
        </div>
        <div class="content">
          <h2>Hello ${data.guestName}!</h2>
          <p>Thank you for choosing to contribute a money gift to Sarah's birthday celebration!</p>
          
          <div class="bank-details">
            <h3>🏦 For Belarus Residents:</h3>
            <p><strong>Bank:</strong> Belarusbank</p>
            <p><strong>Account Holder:</strong> Sarah Johnson</p>
            <p><strong>Account Number:</strong> BY86 AKBB 1010 0000 0029 6600 0000</p>
            <p><strong>BIC:</strong> AKBBBY2X</p>
            <p><strong>Reference:</strong> Birthday Gift - ${data.guestName}</p>
          </div>
          
          <div class="bank-details">
            <h3>🌍 For International Transfers:</h3>
            <p><strong>Bank:</strong> Wise (formerly TransferWise)</p>
            <p><strong>Account Holder:</strong> Sarah Johnson</p>
            <p><strong>IBAN:</strong> GB33 BUKB 2020 1555 5555 55</p>
            <p><strong>SWIFT/BIC:</strong> TRWIGB2L</p>
            <p><strong>Reference:</strong> Birthday Gift - ${data.guestName}</p>
          </div>
          
          <div class="important">
            <p><strong>⚠️ Important:</strong> Please include the reference "Birthday Gift - ${data.guestName}" in your transfer so we can identify your donation.</p>
          </div>
          
          ${
            data.message
              ? `
            <h3>Your Message:</h3>
            <p style="font-style: italic; background: white; padding: 15px; border-radius: 8px;">"${data.message}"</p>
          `
              : ""
          }
          
          <p>You can transfer any amount you're comfortable with. Once your transfer is complete, Sarah will be notified. Thank you for making her birthday extra special! 🎂</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const generateDonationAdminNotification = (data: DonationAdminEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Money Gift Request</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .donation-info { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #10b981; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 New Money Gift Request</h1>
          <p>Someone just requested bank transfer instructions!</p>
        </div>
        <div class="content">
          <div class="donation-info">
            <h3>Guest Information:</h3>
            <p><strong>Name:</strong> ${data.guestName}</p>
            <p><strong>Email:</strong> ${data.guestEmail}</p>
            ${data.guestPhone ? `<p><strong>Phone:</strong> ${data.guestPhone}</p>` : ""}
          </div>
          
          ${
            data.message
              ? `
            <h3>Guest Message:</h3>
            <p style="font-style: italic; background: white; padding: 15px; border-radius: 8px;">"${data.message}"</p>
          `
              : ""
          }
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>The guest has been sent bank transfer instructions for both Belarus and international options</li>
            <li>Monitor your bank accounts for incoming transfers</li>
            <li>Reference will be: "Birthday Gift - ${data.guestName}"</li>
          </ul>
          
          <p>You can view all donation requests in your <a href="/admin/dashboard">admin dashboard</a>.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Email sending function (would integrate with actual email service)
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // In a real implementation, this would use SendGrid, Resend, or similar service
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    return response.ok
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}
