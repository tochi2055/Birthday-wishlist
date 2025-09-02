"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Gift, DollarSign, Download, Mail, Eye, Settings, LogOut, Wine, Flower2 } from "lucide-react"
import type { Reservation, MoneyDonation } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

function AdminDashboardContent() {
  const { logout, user } = useAuth()
  const router = useRouter()

  const [reservations] = useState<Reservation[]>([
    {
      id: "1",
      itemId: "1",
      guestName: "John Smith",
      guestEmail: "john@example.com",
      guestPhone: "+1 (555) 123-4567",
      quantity: 1,
      includeWine: true,
      includeFlowers: false,
      message: "Happy birthday Sarah! Hope you love the wine collection.",
      createdAt: new Date("2024-01-15T10:30:00"),
    },
    {
      id: "2",
      itemId: "2",
      guestName: "Emily Johnson",
      guestEmail: "emily@example.com",
      quantity: 1,
      includeWine: false,
      includeFlowers: true,
      message: "Wishing you the most wonderful birthday!",
      createdAt: new Date("2024-01-14T15:45:00"),
    },
    {
      id: "3",
      itemId: "3",
      guestName: "Michael Brown",
      guestEmail: "michael@example.com",
      guestPhone: "+1 (555) 987-6543",
      quantity: 1,
      includeWine: false,
      includeFlowers: false,
      message: "Perfect for your morning coffee routine!",
      createdAt: new Date("2024-01-13T09:15:00"),
    },
  ])

  const [donations] = useState<MoneyDonation[]>([
    {
      id: "1",
      guestName: "David Wilson",
      guestEmail: "david@example.com",
      amount: 100,
      currency: "USD",
      transferType: "international",
      message: "Have an amazing birthday celebration!",
      createdAt: new Date("2024-01-16T14:20:00"),
    },
    {
      id: "2",
      guestName: "Anna Petrov",
      guestEmail: "anna@example.com",
      amount: 75,
      currency: "USD",
      transferType: "belarus",
      message: "Many happy returns of the day!",
      createdAt: new Date("2024-01-12T11:30:00"),
    },
  ])

  const wishlistItems = [
    { id: "1", title: "Vintage Wine Collection", reserved: 1, total: 2 },
    { id: "2", title: "Fresh Flower Bouquet", reserved: 1, total: 3 },
    { id: "3", title: "Artisan Coffee Set", reserved: 1, total: 1 },
  ]

  const totalReservations = reservations.length
  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0)
  const totalGuests = new Set([...reservations.map((r) => r.guestEmail), ...donations.map((d) => d.guestEmail)]).size
  const wineAddOns = reservations.filter((r) => r.includeWine).length
  const flowerAddOns = reservations.filter((r) => r.includeFlowers).length

  const itemReservationData = wishlistItems.map((item) => ({
    name: item.title.split(" ").slice(0, 2).join(" "),
    reserved: item.reserved,
    available: item.total - item.reserved,
  }))

  const donationData = [
    { name: "Belarus", value: donations.filter((d) => d.transferType === "belarus").length },
    { name: "International", value: donations.filter((d) => d.transferType === "international").length },
  ]

  const COLORS = ["#8b5cf6", "#ec4899"]

  const exportData = () => {
    const data = {
      reservations,
      donations,
      summary: {
        totalReservations,
        totalDonations,
        totalGuests,
        wineAddOns,
        flowerAddOns,
      },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `birthday-wishlist-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleViewPublicPage = () => {
    window.open("/", "_blank")
  }

  const handleGoToWishlistManagement = () => {
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        {/* <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome {user?.displayName} - Monitor  {user?.displayName}'s birthday wishlist activity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleGoToWishlistManagement}>
              <Settings className="w-4 h-4" />
              Manage Items
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleViewPublicPage}>
              <Eye className="w-4 h-4" />
              View Public Page
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={exportData}>
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div> */}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{totalGuests}</div>
                  <p className="text-sm text-gray-600">Total Guests</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{totalReservations}</div>
                  <p className="text-sm text-gray-600">Gift Reservations</p>
                </div>
                <Gift className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">${totalDonations}</div>
                  <p className="text-sm text-gray-600">Money Donations</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{wineAddOns}</div>
                  <p className="text-sm text-gray-600">Wine Add-ons</p>
                </div>
                <Wine className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-pink-600">{flowerAddOns}</div>
                  <p className="text-sm text-gray-600">Flower Add-ons</p>
                </div>
                <Flower2 className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Item Reservations</CardTitle>
              <CardDescription>Reserved vs Available items</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={itemReservationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reserved" fill="#ec4899" name="Reserved" />
                  <Bar dataKey="available" fill="#e5e7eb" name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation Types</CardTitle>
              <CardDescription>Belarus vs International transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {donationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <Tabs defaultValue="reservations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reservations">Gift Reservations</TabsTrigger>
            <TabsTrigger value="donations">Money Donations</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Gift Reservations</CardTitle>
                <CardDescription>All gift reservations with guest details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Add-ons</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => {
                      const item = wishlistItems.find((i) => i.id === reservation.itemId)
                      return (
                        <TableRow key={reservation.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{reservation.guestName}</div>
                              <div className="text-sm text-gray-500">{reservation.guestEmail}</div>
                              {reservation.guestPhone && (
                                <div className="text-sm text-gray-500">{reservation.guestPhone}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item?.title}</div>
                              <div className="text-sm text-gray-500">Qty: {reservation.quantity}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {reservation.includeWine && (
                                <Badge variant="outline" className="text-purple-600 border-purple-200">
                                  Wine
                                </Badge>
                              )}
                              {reservation.includeFlowers && (
                                <Badge variant="outline" className="text-pink-600 border-pink-200">
                                  Flowers
                                </Badge>
                              )}
                              {!reservation.includeWine && !reservation.includeFlowers && (
                                <span className="text-gray-400 text-sm">None</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={reservation.message}>
                              {reservation.message || "No message"}
                            </div>
                          </TableCell>
                          <TableCell>{reservation.createdAt.toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Money Donations</CardTitle>
                <CardDescription>All monetary contributions via bank transfer</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transfer Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{donation.guestName}</div>
                            <div className="text-sm text-gray-500">{donation.guestEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-green-600">
                            ${donation.amount} {donation.currency}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={donation.transferType === "belarus" ? "default" : "secondary"}>
                            {donation.transferType === "belarus" ? "Belarus" : "International"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={donation.message}>
                            {donation.message || "No message"}
                          </div>
                        </TableCell>
                        <TableCell>{donation.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            Pending
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest reservations and donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...reservations, ...donations]
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .slice(0, 10)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          {"itemId" in activity ? (
                            <Gift className="w-5 h-5 text-pink-600" />
                          ) : (
                            <DollarSign className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.guestName}</div>
                          <div className="text-sm text-gray-600">
                            {"itemId" in activity
                              ? `Reserved a gift${activity.includeWine ? " with wine" : ""}${activity.includeFlowers ? " with flowers" : ""}`
                              : `Donated $${activity.amount} via ${activity.transferType} transfer`}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{activity.createdAt.toLocaleDateString()}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
