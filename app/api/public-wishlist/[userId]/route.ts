import { NextResponse } from "next/server";
import { initializeFirebaseAdmin } from "@/lib/firebase-admin";

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;


    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = initializeFirebaseAdmin();

    const settingsRef = db
      .collection("users")
      .doc(userId)
      .collection("celebrant")
      .doc("settings");
    const settingsSnap = await settingsRef.get();

    if (!settingsSnap.exists) {
      return NextResponse.json(
        { error: "Celebrant not found" },
        { status: 404 }
      );
    }

    const celebrantSettings = settingsSnap.data();

     // Try path 1: users/{userId}/wishlistItems (direct collection under user)
    const itemsSnapshot1 = await db
      .collection("users")
      .doc(userId)
      .collection("wishlistItems")
      .get();

    // Try path 2: users/{userId}/celebrant/wishlistItems/items (subcollection)
    const itemsSnapshot2 = await db
      .collection("users")
      .doc(userId)
      .collection("celebrant")
      .doc("wishlistItems")
      .collection("items")
      .get();


    // Use whichever path has data
    const itemsSnapshot =
      itemsSnapshot1.docs.length > 0 ? itemsSnapshot1 : itemsSnapshot2;

    const wishlistItems = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() ?? null,
      updatedAt: doc.data().updatedAt?.toDate?.() ?? null,
    }));

    return NextResponse.json({
      wishlistItems,
      celebrantSettings,
    });
  } catch (error: any) {
    console.error("Error fetching public wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist data", details: error.message },
      { status: 500 }
    );
  }
}
