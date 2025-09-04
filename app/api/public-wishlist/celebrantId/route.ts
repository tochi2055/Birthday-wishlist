import { NextResponse } from "next/server";
import { initializeFirebaseAdmin } from "@/lib/firebase-admin";

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

    const db = initializeFirebaseAdmin();
  
    // 🔎 Find celebrant using collectionGroup query
    const celebrantSnapshot = await db
      .collectionGroup("celebrant")
      .where("celebrantId", "==", celebrantId)
      .get();

    if (celebrantSnapshot.empty) {
      return NextResponse.json(
        { error: "Celebrant not found" },
        { status: 404 }
      );
    }

    // Get celebrant data + parent userId
    const celebrantDoc = celebrantSnapshot.docs[0];
    const celebrantSettings = celebrantDoc.data();
    const foundUserId = celebrantDoc.ref.parent.parent?.id;

    if (!foundUserId) {
      console.error(
        " Could not resolve parent user for celebrant:",
        celebrantId
      );
      return NextResponse.json(
        { error: "Internal data error - parent user missing" },
        { status: 500 }
      );
    }


    // Fetch wishlist items for this user
    const itemsSnapshot = await db
      .collection("users")
      .doc(foundUserId)
      .collection("wishlistItems")
      .get();

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
    console.error(" Error fetching public wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist data", details: error.message },
      { status: 500 }
    );
  }
}
