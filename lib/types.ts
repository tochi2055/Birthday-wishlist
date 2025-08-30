// TypeScript types for the wishlist app
export interface WishlistItem {
  id: string
  title: string
  description: string
  image?: string
  quantity: number
  reserved: number
  category?: string
  createdAt: Date
  updatedAt: Date
}

export interface Reservation {
  id: string
  itemId: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  quantity: number
  includeWine: boolean
  includeFlowers: boolean
  message?: string
  createdAt: Date
}

export interface MoneyDonation {
  id: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  amount: number
  currency: string
  transferType: "belarus" | "international"
  message?: string
  createdAt: Date
}

export interface Celebrant {
  id: string
  name: string
  email: string
  birthday: Date
  profileImage?: string
  backgroundImage?: string
  wishlistTitle?: string
  wishlistDescription?: string
}
