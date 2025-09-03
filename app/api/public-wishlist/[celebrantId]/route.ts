// import { type NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebase";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { celebrantId: string } }
// ) {
//   try {
//     const { celebrantId } = params;

//     if (!celebrantId) {
//       return NextResponse.json(
//         { error: "Celebrant ID is required" },
//         { status: 400 }
//       );
//     }

//     if (!db) {
//       return NextResponse.json(
//         { error: "Database not available" },
//         { status: 500 }
//       );
//     }

//     // Find the user who owns this celebrant ID
//     // We need to search through all users to find the one with this celebrantId
//     // This is not ideal for performance, but works for the current setup

//     // For now, we'll assume the celebrantId contains the user ID
//     // In a real app, you'd want a separate collection to map celebrantIds to userIds

//     // Try to extract user ID from celebrant ID or search through users
//     // For this implementation, we'll search through all users (not scalable but works)

//     const userData = null;
//     const wishlistItems = [];
//     const celebrantSettings = null;

//     // This is a simplified approach - in production you'd want a better mapping system
//     try {
//       // Try to get data from a specific user if we can determine the user ID
//       // For now, we'll return a placeholder response that works with the existing structure

//       return NextResponse.json({
//         wishlistItems: [],
//         celebrantSettings: {
//           name: "Birthday Celebrant",
//           age: null,
//           profileImage: "/placeholder.svg",
//           backgroundImage: "/happy-birthday-celebration-background.png",
//           celebrantId: celebrantId,
//           enableWineSelection: false,
//           enableFlowers: false,
//           enableMoneyGift: true,
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching public wishlist:", error);
//       return NextResponse.json(
//         { error: "Failed to fetch wishlist data" },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Error in public wishlist API:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET(
  req: Request,
  context: { params: Promise<{ celebrantId: string }> }
) {
  try {
    const { celebrantId } = await context.params;

    if (!celebrantId) {
      return NextResponse.json(
        { error: "Celebrant ID is required" },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      );
    }

    // This searches all users' celebrant settings to find matching celebrantId
    let foundUserId = null;
    let celebrantSettings = null;
    let wishlistItems = [];

    try {
      // Get all users and check their celebrant settings
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;

        // Check if this user has celebrant settings with matching celebrantId
        const celebrantRef = collection(db, "users", userId, "celebrant");
        const celebrantSnapshot = await getDocs(celebrantRef);

        for (const celebrantDoc of celebrantSnapshot.docs) {
          const data = celebrantDoc.data();
          if (data.celebrantId === celebrantId) {
            foundUserId = userId;
            celebrantSettings = data;
            break;
          }
        }

        if (foundUserId) break;
      }

      if (!foundUserId || !celebrantSettings) {
        return NextResponse.json(
          { error: "Celebrant not found" },
          { status: 404 }
        );
      }

      const itemsRef = collection(db, "users", foundUserId, "wishlistItems");
      const itemsSnapshot = await getDocs(itemsRef);

      wishlistItems = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));

      return NextResponse.json({
        wishlistItems,
        celebrantSettings,
      });
    } catch (error) {
      console.error("Error fetching public wishlist:", error);
      return NextResponse.json(
        { error: "Failed to fetch wishlist data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in public wishlist API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
