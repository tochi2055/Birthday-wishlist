"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, Settings, LogOut, Upload, User, Camera } from "lucide-react"
import type { WishlistItem } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { WishlistItemForm } from "@/components/wishlist-item-form"
import { uploadImage } from "@/lib/storage"
import { toast } from "sonner";

function AdminDashboardContent() {
  const { logout, user } = useAuth()
  const { wishlistItems, addItem, updateItem, deleteItem, celebrantSettings, updateCelebrantSettings } = useWishlist()
  const router = useRouter()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null)

  const [settingsData, setSettingsData] = useState({
    name: celebrantSettings.name,
    age: celebrantSettings.age || "",
    profileImage: celebrantSettings.profileImage || "",
    backgroundImage: celebrantSettings.backgroundImage || "",
  })

  const [isUploadingProfile, setIsUploadingProfile] = useState(false)
  const [isUploadingBackground, setIsUploadingBackground] = useState(false)

  const handleSaveNewItem = (itemData: Partial<WishlistItem>) => {
    addItem({
      title: itemData.title!,
      description: itemData.description || "",
      image: itemData.image || "",
      quantity: itemData.quantity || 1,
      category: itemData.category || "",
      reserved: 0,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditItem = (item: WishlistItem) => {
    setEditingItem(item)
  }

  const handleSaveEditedItem = (itemData: Partial<WishlistItem>) => {
    if (!editingItem) return

    updateItem(editingItem.id, {
      title: itemData.title!,
      description: itemData.description || "",
      image: itemData.image || "",
      quantity: itemData.quantity || 1,
      category: itemData.category || "",
    })
    setEditingItem(null)
  }

  const handleDeleteItem = (itemId: string) => {
    deleteItem(itemId)
  }

  const handleSaveSettings = () => {
    updateCelebrantSettings({
      name: settingsData.name,
      age: settingsData.age ? Number.parseInt(settingsData.age.toString()) : undefined,
      profileImage: settingsData.profileImage,
      backgroundImage: settingsData.backgroundImage,
    })
    setIsSettingsDialogOpen(false)
  }

  const handlePhotoUpload = async (type: "profile" | "background") => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        if (type === "profile") {
          setIsUploadingProfile(true)
        } else {
          setIsUploadingBackground(true)
        }

        try { console.log("Uploading image...")
          const result = await uploadImage(file, `celebrant/${type}`)
          if (type === "profile") {
            setSettingsData((prev) => ({ ...prev, profileImage: result.url }))
          } else {
            setSettingsData((prev) => ({ ...prev, backgroundImage: result.url }))
          }
        } catch (error) {
          console.error("Upload failed:", error)
          toast.error("Failed to upload image. Please try again.")
        } finally {
          if (type === "profile") {
            setIsUploadingProfile(false)
          } else {
            setIsUploadingBackground(false)
          }
        }
      }
    }
    input.click()
  }

  const totalItems = wishlistItems.length
  const totalReserved = wishlistItems.reduce((sum, item) => sum + item.reserved, 0)
  const totalAvailable = wishlistItems.reduce((sum, item) => sum + (item.quantity - item.reserved), 0)

  const itemsByCategory = wishlistItems.reduce(
    (acc, item) => {
      const category = item.category || "Uncategorized"
      if (!acc[category]) acc[category] = []
      acc[category].push(item)
      return acc
    },
    {} as Record<string, WishlistItem[]>,
  )

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/admin/login")
    } catch (error) {
      toast.error("Logout failed. Please try again.")
      console.error("Logout failed:", error)
    }
  }

  const handleViewPublicPage = () => {
    window.open("/", "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white font-caveat text-4xl">
              Wishlist Management
            </h1>
            <p className="text-gray-600 mt-1 dark:text-gray-300 font-caveat text-lg">
              Welcome {user?.email} - Manage {celebrantSettings.name}'s birthday wishlist
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleViewPublicPage}>
              <Eye className="w-4 h-4" />
              View Public Page
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setIsSettingsDialogOpen(true)}>
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{totalAvailable}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">{totalReserved}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reserved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">
                {totalItems > 0 ? Math.round((totalReserved / totalItems) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-pink-600 hover:bg-pink-700">
                <Plus className="w-4 h-4" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Wishlist Item</DialogTitle>
                <DialogDescription>Create a new item for the birthday wishlist.</DialogDescription>
              </DialogHeader>
              <WishlistItemForm onSave={handleSaveNewItem} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-8">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 dark:text-gray-200">
                {category}
                <Badge variant="secondary">{items.length} items</Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
                        {item.image ? (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Upload className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription className="mt-1">{item.description}</CardDescription>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-end mb-3">
                        <div className="flex gap-2">
                          <Badge variant="outline">{item.quantity} total</Badge>
                          <Badge variant={item.reserved > 0 ? "default" : "secondary"}>{item.reserved} reserved</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-pink-600 h-2 rounded-full transition-all"
                          style={{ width: `${(item.reserved / item.quantity) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2 dark:text-gray-400">
                        {item.quantity - item.reserved} of {item.quantity} available
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Wishlist Item</DialogTitle>
              <DialogDescription>Update the details of this wishlist item.</DialogDescription>
            </DialogHeader>
            {editingItem && (
              <WishlistItemForm
                item={editingItem}
                onSave={handleSaveEditedItem}
                onCancel={() => setEditingItem(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Celebrant Settings
              </DialogTitle>
              <DialogDescription>Update the celebrant's profile information and photos.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                    {settingsData.profileImage ? (
                      <img
                        src={settingsData.profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePhotoUpload("profile")}
                      className="gap-2"
                      disabled={isUploadingProfile}
                    >
                      <Camera className="w-4 h-4" />
                      {isUploadingProfile ? "Uploading..." : "Upload Photo"}
                    </Button>
                    <Input
                      placeholder="Or paste image URL"
                      value={settingsData.profileImage}
                      onChange={(e) => setSettingsData((prev) => ({ ...prev, profileImage: e.target.value }))}
                      className="text-xs"
                      disabled={isUploadingProfile}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Background Image</Label>
                <div className="space-y-2">
                  <div className="w-full h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                    {settingsData.backgroundImage ? (
                      <img
                        src={settingsData.backgroundImage || "/placeholder.svg"}
                        alt="Background"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePhotoUpload("background")}
                      className="gap-2"
                      disabled={isUploadingBackground}
                    >
                      <Upload className="w-4 h-4" />
                      {isUploadingBackground ? "Uploading..." : "Upload Background"}
                    </Button>
                  </div>
                  <Input
                    placeholder="Or paste background image URL"
                    value={settingsData.backgroundImage}
                    onChange={(e) => setSettingsData((prev) => ({ ...prev, backgroundImage: e.target.value }))}
                    className="text-sm"
                    disabled={isUploadingBackground}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="celebrant-name">Celebrant Name</Label>
                  <Input
                    id="celebrant-name"
                    value={settingsData.name}
                    onChange={(e) => setSettingsData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter celebrant's name"
                  />
                </div>
                <div>
                  <Label htmlFor="celebrant-age">Age (optional)</Label>
                  <Input
                    id="celebrant-age"
                    type="number"
                    min="1"
                    max="150"
                    value={settingsData.age}
                    onChange={(e) => setSettingsData((prev) => ({ ...prev, age: e.target.value }))}
                    placeholder="Enter age"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
                <h4 className="font-semibold text-gray-800 mb-3 dark:text-gray-200 font-caveat text-lg">Preview</h4>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg mx-auto">
                    <img
                      src={settingsData.profileImage || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white font-caveat text-xl">
                    {settingsData.name || "Celebrant"}'s Birthday Wishlist
                  </h3>
                  {settingsData.age && (
                    <p className="text-gray-600 dark:text-gray-400 font-caveat text-base">
                      Turning {settingsData.age}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveSettings} className="flex-1 bg-pink-600 hover:bg-pink-700">
                  Save Settings
                </Button>
                <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
