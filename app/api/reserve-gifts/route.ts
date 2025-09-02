// import { type NextRequest, NextResponse } from "next/server"
// import { sendEmail, generateReservationConfirmationEmail, generateAdminNotificationEmail } from "@/lib/email"
// import { collection, addDoc, Timestamp } from "firebase/firestore";
// import { db } from "@/lib/firebase";
//   export async function POST(request: NextRequest) {
//     try {
//       const reservationData = await request.json();

//       const {
//         guestName,
//         guestEmail,
//         guestPhone,
//         message,
//         selectedItems,
//         includeWine,
//         includeFlowers,
//       } = reservationData;

//       // ✅ Save to Firestore
//       const docRef = await addDoc(collection(db, "reservations"), {
//         guestName,
//         guestEmail,
//         guestPhone,
//         message,
//         selectedItems,
//         includeWine,
//         includeFlowers,
//         createdAt: Timestamp.now(),
//       });
//       // In a real app, save to Firebase here
//       console.log("💾 Saving reservation to database:", reservationData);

//       // Send confirmation email to guest
//       const guestEmailHtml = generateReservationConfirmationEmail({
//         guestName,
//         guestEmail,
//         items: selectedItems,
//         includeWine,
//         includeFlowers,
//         message,
//       });

//       await sendEmail({
//         to: guestEmail,
//         subject: "🎉 Your Gift Reservation is Confirmed!",
//         html: guestEmailHtml,
//       });

//       // Send notification email to admin
//       const adminEmailHtml = generateAdminNotificationEmail({
//         guestName,
//         guestEmail,
//         items: selectedItems,
//         includeWine,
//         includeFlowers,
//         message,
//       });

//       await sendEmail({
//         to: process.env.ADMIN_EMAIL || "admin@birthdaywishlist.com",
//         subject: `🎁 New Gift Reservation from ${guestName}`,
//         html: adminEmailHtml,
//       });

//       const corsHeaders = {
//         "Access-Control-Allow-Origin":
//           process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",
//         "Access-Control-Allow-Methods": "POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//         "Access-Control-Allow-Credentials": "true",
//       };

//       return NextResponse.json(
//         {
//           success: true,
//           message: "Reservation confirmed and emails sent!",
//         },
//         { headers: corsHeaders }
//       );
//     } catch (error) {
//       console.error("Reservation API error:", error)
//       return NextResponse.json(
//         { error: "Failed to process reservation" },
//         {
//           status: 500,
//           headers: {
//             "Access-Control-Allow-Origin": process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",
//             "Access-Control-Allow-Methods": "POST, OPTIONS",
//             "Access-Control-Allow-Headers": "Content-Type, Authorization",
//             "Access-Control-Allow-Credentials": "true",
//           },
//         },
//       )
//     }
//   }

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",
//       "Access-Control-Allow-Methods": "POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       "Access-Control-Allow-Credentials": "true",
//     },
//   })
// }


import { type NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  generateReservationConfirmationEmail,
  generateAdminNotificationEmail,
} from "@/lib/email";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const reservationData = await request.json();

    const {
      guestName,
      guestEmail,
      guestPhone,
      message,
      selectedItems,
      includeWine,
      includeFlowers,
      celebrantId,
    } = reservationData;

    if (!celebrantId) {
      throw new Error("Celebrant ID is required");
    }

    const docRef = await addDoc(
      collection(db, "users", celebrantId, "reservations"),
      {
        guestName,
        guestEmail,
        guestPhone,
        message,
        selectedItems,
        includeWine,
        includeFlowers,
        celebrantId,
        createdAt: Timestamp.now(),
      }
    );

    console.log("✅ Reservation saved to Firebase with ID:", docRef.id);

    // Send confirmation email to guest
    const guestEmailHtml = generateReservationConfirmationEmail({
      guestName,
      guestEmail,
      items: selectedItems,
      includeWine,
      includeFlowers,
      message,
    });

    await sendEmail({
      to: guestEmail,
      subject: "🎉 Your Gift Reservation is Confirmed!",
      html: guestEmailHtml,
    });

    // Send notification email to admin
    const adminEmailHtml = generateAdminNotificationEmail({
      guestName,
      guestEmail,
      items: selectedItems,
      includeWine,
      includeFlowers,
      message,
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@birthdaywishlist.com",
      subject: `🎁 New Gift Reservation from ${guestName}`,
      html: adminEmailHtml,
    });

    const corsHeaders = {
      "Access-Control-Allow-Origin":
        process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    };

    return NextResponse.json(
      {
        success: true,
        message: "Reservation confirmed and emails sent!",
        reservationId: docRef.id,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Reservation API error:", error);
    return NextResponse.json(
      { error: "Failed to process reservation" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin":
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000"
              : "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin":
        process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
