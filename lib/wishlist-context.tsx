"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { WishlistItem } from "./types"

interface CelebrantSettings {
  name: string
  age?: number
  profileImage?: string
  backgroundImage?: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  celebrantSettings: CelebrantSettings
  addItem: (item: Omit<WishlistItem, "id" | "createdAt" | "updatedAt">) => void
  updateItem: (id: string, updates: Partial<WishlistItem>) => void
  deleteItem: (id: string) => void
  updateCelebrantSettings: (settings: Partial<CelebrantSettings>) => void
  reserveItem: (id: string, quantity?: number) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const defaultWishlistItems: WishlistItem[] = [
  // Beauty & Skincare
  {
    id: "1",
    title: "Perfume",
    description: "Elegant fragrance for special occasions",
    image: "/elegant-perfume-bottle.png",
    quantity: 1,
    reserved: 0,
    category: "Beauty & Skincare",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "CeraVe Care Package",
    description: "Complete skincare routine with moisturizer and cleanser",
    image: "/cerave-skincare-products.png",
    quantity: 1,
    reserved: 0,
    category: "Beauty & Skincare",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Oriflame Care Package",
    description: "Premium beauty and skincare collection",
    image: "/oriflame-beauty-products.png",
    quantity: 1,
    reserved: 0,
    category: "Beauty & Skincare",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Johnson Baby Oil + Lip Gloss",
    description: "Gentle baby oil with beautiful lip gloss set",
    image: "/johnson-baby-oil-and-lip-gloss.png",
    quantity: 1,
    reserved: 0,
    category: "Beauty & Skincare",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Electronics & Tech
  {
    id: "5",
    title: "Headset",
    description: "High-quality audio headset for music and calls",
    image: "/modern-wireless-headset.png",
    quantity: 1,
    reserved: 0,
    category: "Electronics & Tech",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "Digital Camera",
    description: "Capture beautiful memories with this digital camera",
    image: "/compact-digital-camera.png",
    quantity: 1,
    reserved: 0,
    category: "Electronics & Tech",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    title: "iPhone 12 Cases",
    description: "Stylish protective cases for iPhone 12",
    image: "/iphone-12-protective-cases.png",
    quantity: 3,
    reserved: 0,
    category: "Electronics & Tech",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Fashion & Accessories
  {
    id: "8",
    title: "Vintage Bag",
    description: "Classic vintage-style handbag",
    image: "/vintage-leather-handbag.png",
    quantity: 1,
    reserved: 0,
    category: "Fashion & Accessories",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    title: "Jewelries",
    description: "Beautiful jewelry pieces for special occasions",
    image: "/elegant-jewelry-set.png",
    quantity: 2,
    reserved: 0,
    category: "Fashion & Accessories",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    title: "Black Baggy Jeans",
    description: "Comfortable and stylish black baggy jeans",
    image: "/black-baggy-jeans.png",
    quantity: 1,
    reserved: 0,
    category: "Fashion & Accessories",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "11",
    title: "Puffer Jacket",
    description: "Warm and stylish puffer jacket for winter",
    image: "/stylish-puffer-jacket.png",
    quantity: 1,
    reserved: 0,
    category: "Fashion & Accessories",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Footwear
  {
    id: "12",
    title: "New Balance 530",
    description: "Classic New Balance 530 sneakers",
    image: "/new-balance-530-sneakers.png",
    quantity: 1,
    reserved: 0,
    category: "Footwear",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "13",
    title: "Kitten Heels",
    description: "Elegant low-heel shoes for any occasion",
    image: "/elegant-kitten-heel-shoes.png",
    quantity: 1,
    reserved: 0,
    category: "Footwear",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "14",
    title: "Winter Boots",
    description: "Warm and comfortable boots for winter weather",
    image: "/stylish-winter-boots.png",
    quantity: 1,
    reserved: 0,
    category: "Footwear",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "15",
    title: "Flat Mary Janes",
    description: "Classic flat Mary Jane shoes",
    image: "/flat-mary-jane-shoes.png",
    quantity: 1,
    reserved: 0,
    category: "Footwear",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Medical/Professional
  {
    id: "16",
    title: "Lab Coat",
    description: "Professional white lab coat",
    image: "/white-medical-lab-coat.png",
    quantity: 1,
    reserved: 0,
    category: "Medical/Professional",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "17",
    title: "Medical Crocs",
    description: "Comfortable medical professional shoes",
    image: "/placeholder.svg?height=300&width=300",
    quantity: 1,
    reserved: 0,
    category: "Medical/Professional",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "18",
    title: "Stethoscope",
    description: "Professional medical stethoscope",
    image: "/placeholder.svg?height=300&width=300",
    quantity: 1,
    reserved: 0,
    category: "Medical/Professional",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Health & Wellness
  {
    id: "19",
    title: "Manicure/Pedicure Appointment",
    description: "Relaxing nail care treatment at a professional salon",
    image: "/placeholder.svg?height=300&width=300",
    quantity: 1,
    reserved: 0,
    category: "Health & Wellness",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "20",
    title: "Spa Appointment",
    description: "Luxurious spa day for ultimate relaxation",
    image: "/placeholder.svg?height=300&width=300",
    quantity: 1,
    reserved: 0,
    category: "Health & Wellness",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Travel
  {
    id: "21",
    title: "Train Ticket to Any City in Belarus",
    description: "Explore Belarus with a train ticket to your chosen destination",
    image: "/placeholder.svg?height=300&width=300",
    quantity: 1,
    reserved: 0,
    category: "Travel",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Additional Items
  {
    id: "22",
    title: "Vintage Wine Collection",
    description: "A selection of fine wines from Bordeaux region",
    image: "/wine-bottles.png",
    quantity: 2,
    reserved: 0,
    category: "Food & Beverages",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "23",
    title: "Fresh Flower Bouquet",
    description: "Beautiful mixed seasonal flowers",
    image: "/vibrant-flower-bouquet.png",
    quantity: 3,
    reserved: 1,
    category: "Gifts & Flowers",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const defaultCelebrantSettings: CelebrantSettings = {
  name: "Sarah",
  age: 23,
  profileImage: "/placeholder.svg?key=8yjv9",
  backgroundImage: "/happy-birthday-celebration-background.png",
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(defaultWishlistItems)
  const [celebrantSettings, setCelebrantSettings] = useState<CelebrantSettings>(defaultCelebrantSettings)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem("wishlistItems")
    const savedSettings = localStorage.getItem("celebrantSettings")

    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems)
        // Convert date strings back to Date objects
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))
        setWishlistItems(itemsWithDates)
      } catch (error) {
        console.error("Failed to parse saved wishlist items:", error)
      }
    }

    if (savedSettings) {
      try {
        setCelebrantSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to parse saved celebrant settings:", error)
      }
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  useEffect(() => {
    localStorage.setItem("celebrantSettings", JSON.stringify(celebrantSettings))
  }, [celebrantSettings])

  const addItem = (itemData: Omit<WishlistItem, "id" | "createdAt" | "updatedAt">) => {
    const newItem: WishlistItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setWishlistItems((prev) => [...prev, newItem])
  }

  const updateItem = (id: string, updates: Partial<WishlistItem>) => {
    setWishlistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item)),
    )
  }

  const deleteItem = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateCelebrantSettings = (settings: Partial<CelebrantSettings>) => {
    setCelebrantSettings((prev) => ({ ...prev, ...settings }))
  }

  const reserveItem = (id: string, quantity = 1) => {
    setWishlistItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, reserved: Math.min(item.reserved + quantity, item.quantity), updatedAt: new Date() }
          : item,
      ),
    )
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        celebrantSettings,
        addItem,
        updateItem,
        deleteItem,
        updateCelebrantSettings,
        reserveItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
