import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

export interface UploadResult {
  url: string
  path: string
}

export async function uploadImage(file: File, path: string): Promise<UploadResult> {
  try {
    if (!storage) {
      throw new Error("Firebase Storage is not initialized. Please check your Firebase configuration.")
    }

    // Create a unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const fullPath = `${path}/${filename}`

    // Create storage reference
    const storageRef = ref(storage, fullPath)

    // Upload file with metadata to help with CORS
    const metadata = {
      contentType: file.type,
      customMetadata: {
        "uploaded-by": "wishlist-app",
        "upload-timestamp": timestamp.toString(),
      },
    }

    const snapshot = await uploadBytes(storageRef, file, metadata)

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    return {
      url: downloadURL,
      path: fullPath,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to upload image: ${error.message}`)
    }
    throw new Error("Failed to upload image due to unknown error")
  }
}

export async function deleteImage(path: string): Promise<void> {
  try {
    if (!storage) {
      throw new Error("Firebase Storage is not initialized. Please check your Firebase configuration.")
    }

    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    console.error("Error deleting image:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to delete image: ${error.message}`)
    }
    throw new Error("Failed to delete image due to unknown error")
  }
}
