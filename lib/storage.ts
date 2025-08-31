export interface UploadResult {
  url: string
  path: string
}

/**
 * Uploads an image to Cloudinary
 * @param file - The file to upload
 * @param path - A folder path to organize images in Cloudinary
 * @returns {UploadResult} with the public URL and the generated path
 */
export async function uploadImage(file: File, path: string): Promise<UploadResult> {
  try {
    if (!file) {
      throw new Error("No file provided for upload.")
    }

    // Create a unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    // Cloudinary stores files in folders via the `folder` param
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "<your_unsigned_preset>")
    formData.append("folder", path) // equivalent of Firebase "path"

    const res = await fetch(`https://api.cloudinary.com/v1_1/<your_cloud_name>/image/upload`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Cloudinary upload failed: ${errorText}`)
    }

    const data = await res.json()

    return {
      url: data.secure_url,
      path: data.public_id, // acts like Firebase storage path
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to upload image: ${error.message}`)
    }
    throw new Error("Failed to upload image due to unknown error")
  }
}

/**
 * Deletes an image from Cloudinary by public_id
 * @param path - The Cloudinary public_id (from uploadImage)
 */
export async function deleteImage(path: string): Promise<void> {
  try {
    if (!path) {
      throw new Error("No image path provided for deletion.")
    }

    // ⚠️ Cloudinary deletions require a signed request (for security).
    // For client-only apps, you’ll need a backend endpoint that signs requests
    // and calls Cloudinary's Admin API.
    // Here we throw a reminder instead of silently failing.
    throw new Error(
      "deleteImage requires a backend API route to securely call Cloudinary's Admin API."
    )
  } catch (error) {
    console.error("Error deleting image:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to delete image: ${error.message}`)
    }
    throw new Error("Failed to delete image due to unknown error")
  }
}
