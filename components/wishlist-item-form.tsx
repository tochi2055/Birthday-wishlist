"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Loader2 } from "lucide-react"
import type { WishlistItem } from "@/lib/types"
import { uploadImage, deleteImage } from "@/lib/storage"
import { toast } from "sonner";

interface WishlistItemFormProps {
  item?: WishlistItem
  onSave: (itemData: Partial<WishlistItem>) => void
  onCancel: () => void
}

export function WishlistItemForm({ item, onSave, onCancel }: WishlistItemFormProps) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    quantity: item?.quantity || 1,
    image: item?.image || "",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(item?.image || null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const result = await uploadImage(file, "wishlist-items")
        setImagePreview(result.url)
        setFormData({ ...formData, image: result.url })
        setUploadedImagePath(result.path)
      } catch (error) {
        console.error("Upload failed:", error)
        toast.error("Failed to upload image. Please try again.")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleRemoveImage = async () => {
    if (uploadedImagePath) {
      try {
        await deleteImage(uploadedImagePath)
      } catch (error) {
        console.error("Failed to delete image:", error)
      }
    }
    setImagePreview(null)
    setFormData({ ...formData, image: "" })
    setUploadedImagePath(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter item title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the item"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">Item Image</Label>
        <div className="space-y-3">
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Image URL or upload file"
              disabled={isUploading}
            />
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button type="button" variant="outline" size="sm" disabled={isUploading}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-pink-600 hover:bg-pink-700" disabled={isUploading}>
          {item ? "Update Item" : "Add Item"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 bg-transparent"
          disabled={isUploading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
