// "use client";

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Gift,
//   Heart,
//   Wine,
//   Flower2,
//   Check,
//   Loader2,
//   DollarSign,
//   LogIn,
// } from "lucide-react";
// import { AILetterGenerator } from "@/components/ai-letter-generator";
// import { useRouter } from "next/navigation";
// import { useWishlist } from "@/lib/wishlist-context";
// import { ThemeToggle } from "@/components/theme-toggle";
// import { MoneyDonationModal } from "@/components/money-donation-modal";
// import { toast } from "sonner";

// export default function BirthdayWishlist() {
//   const router = useRouter();
//   const { wishlistItems, celebrantSettings, reserveItem } = useWishlist();

//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const [includeWine, setIncludeWine] = useState(false);
//   const [includeFlowers, setIncludeFlowers] = useState(false);
//   const [showReservationForm, setShowReservationForm] = useState(false);
//   const [showMoneyDonationForm, setShowMoneyDonationForm] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [guestInfo, setGuestInfo] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const groupedItems = wishlistItems.reduce(
//     (acc, item) => {
//       if (!acc[item.category || "Uncategorized"]) {
//         acc[item.category || "Uncategorized"] = [];
//       }
//       acc[item.category || "Uncategorized"].push(item);
//       return acc;
//     },
//     {} as Record<string, typeof wishlistItems>
//   );

//   const toggleItemSelection = (itemId: string) => {
//     setSelectedItems((prev) =>
//       prev.includes(itemId)
//         ? prev.filter((id) => id !== itemId)
//         : [...prev, itemId]
//     );
//   };

//   const handleReservation = async () => {
//     setIsSubmitting(true);

//     try {
//       const selectedItemsData = wishlistItems.filter((item) =>
//         selectedItems.includes(item.id)
//       );

//       const response = await fetch("/api/reserve-gifts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           guestName: guestInfo.name,
//           guestEmail: guestInfo.email,
//           guestPhone: guestInfo.phone,
//           message: guestInfo.message,
//           selectedItems: selectedItemsData,
//           includeWine,
//           includeFlowers,
//           celebrantId: celebrantSettings.celebrantId,
//         }),
//       });

//       if (response.ok) {
//         selectedItems.forEach((itemId) => {
//           reserveItem(itemId, 1);
//         });

//         setSelectedItems([]);
//         setIncludeWine(false);
//         setIncludeFlowers(false);
//         setGuestInfo({ name: "", email: "", phone: "", message: "" });
//         setShowReservationForm(false);

//         toast.success(
//           "🎉 Thank you! Your gifts have been reserved and confirmation emails have been sent."
//         );
//       } else {
//         toast.error(
//           "Sorry, there was an error processing your reservation. Please try again."
//         );
//       }
//     } catch (error) {
//       console.error("Reservation error:", error);
//       toast.error(
//         "Sorry, there was an error processing your reservation. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleMoneyDonation = async (donationData: any) => {
//     setIsSubmitting(true);

//     try {
//       const response = await fetch("/api/donate-money", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           guestName: donationData.name,
//           guestEmail: donationData.email,
//           guestPhone: "",
//           message: donationData.message,
//           amount: donationData.amount,
//           transferType: donationData.transferType,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to process donation");
//       }

//       toast.success(
//         "✅ Thank you! Bank transfer instructions have been sent to your email."
//       );
//       setShowMoneyDonationForm(false);
//     } catch (error) {
//       console.error("Money donation error:", error);
//       toast.error(
//         "Sorry, there was an error processing your donation request. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const selectedItemsData = wishlistItems.filter((item) =>
//     selectedItems.includes(item.id)
//   );

//   return (
//     <div className="min-h-screen relative">
//       <div
//         className="absolute inset-0 bg-cover-responsive"
//         style={{
//           backgroundImage: `url('${celebrantSettings.backgroundImage}')`,
//         }}
//       >
//         <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
//       </div>

//       <div className="absolute top-4 left-4 z-20 flex gap-2">
//         <Button
//           onClick={() => router.push("/admin/login")}
//           className="bg-white/90 hover:bg-white text-gray-900 border border-white/20 backdrop-blur-sm dark:bg-gray-900/90 dark:hover:bg-gray-900 dark:text-white dark:border-gray-700/20"
//           variant="outline"
//         >
//           <LogIn className="w-4 h-4 mr-2" />
//           Celebrant Login
//         </Button>
//       </div>

//       <div className="absolute top-4 right-4 z-20">
//         <ThemeToggle />
//       </div>

//       <div className="relative z-10 container mx-auto px-4 py-8">
//         <div className="text-center mb-8">
//           <div className="flex flex-col items-center gap-6">
//             <div className="relative">
//               <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl dark:border-gray-200">
//                 <img
//                   src={celebrantSettings.profileImage || "/placeholder.svg"}
//                   alt="Birthday Celebrant"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white rounded-full p-2">
//                 <Gift className="w-4 h-4" />
//               </div>
//             </div>

//             <div className="text-white text-center">
//               <h1 className="font-bold mb-2 text-balance font-caveat text-5xl">
//                 {celebrantSettings.name}'s Birthday Wishlist
//               </h1>
//               <p className="text-white/90 text-pretty font-caveat text-2xl">
//                 Help make this birthday extra special!
//               </p>
//               {celebrantSettings.age && (
//                 <p className="text-white/80 mt-1 font-caveat text-xl">
//                   Turning {celebrantSettings.age}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="space-y-8 mb-8">
//           {Object.entries(groupedItems).map(([category, items]) => (
//             <div key={category}>
//               <div className="flex items-center gap-3 mb-4">
//                 <h2 className="text-2xl font-bold text-white">{category}</h2>
//                 <Badge
//                   variant="secondary"
//                   className="bg-white/20 text-white border-white/30 dark:bg-white/30 dark:text-white"
//                 >
//                   {items.length} items
//                 </Badge>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {items.map((item) => (
//                   <Card
//                     key={item.id}
//                     className="bg-white/95 backdrop-blur-sm hover:bg-white/100 transition-all duration-200 dark:bg-gray-900/95 dark:hover:bg-gray-900/100"
//                   >
//                     <CardHeader className="pb-3">
//                       <div className="aspect-square rounded-lg overflow-hidden mb-3">
//                         <img
//                           src={item.image || "/placeholder.svg"}
//                           alt={item.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <CardTitle className="text-lg">{item.title}</CardTitle>
//                       <CardDescription>{item.description}</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="flex items-center justify-between mb-4">
//                         <Badge
//                           variant={
//                             item.quantity > item.reserved
//                               ? "default"
//                               : "secondary"
//                           }
//                         >
//                           {item.quantity - item.reserved} available
//                         </Badge>
//                       </div>
//                       <Button
//                         onClick={() => toggleItemSelection(item.id)}
//                         className={`w-full ${
//                           selectedItems.includes(item.id)
//                             ? "bg-pink-600 hover:bg-pink-700"
//                             : "bg-primary hover:bg-primary/90"
//                         }`}
//                         disabled={item.quantity <= item.reserved}
//                       >
//                         <Heart
//                           className={`w-4 h-4 mr-2 ${selectedItems.includes(item.id) ? "fill-current" : ""}`}
//                         />
//                         {selectedItems.includes(item.id)
//                           ? "Selected"
//                           : item.quantity <= item.reserved
//                             ? "Reserved"
//                             : "Select Gift"}
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <Card className="bg-purple-50/95 backdrop-blur-sm border-purple-200 dark:bg-purple-900/95 dark:border-purple-800">
//             <CardContent className="p-6 text-center">
//               <Wine className="w-8 h-8 text-purple-600 mx-auto mb-3 dark:text-purple-400" />
//               <h3 className="font-semibold text-purple-800 mb-2 dark:text-purple-200 font-caveat text-lg">
//                 Wine Selection
//               </h3>
//               <p className="text-sm text-purple-600 mb-4 dark:text-purple-300">
//                 Add a bottle of wine to any gift
//               </p>
//               <Button
//                 variant="outline"
//                 className={`border-purple-300 text-purple-700 hover:bg-purple-100 bg-transparent dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-800 ${
//                   includeWine ? "bg-purple-100 dark:bg-purple-800" : ""
//                 }`}
//                 onClick={() => setIncludeWine(!includeWine)}
//               >
//                 {includeWine ? <Check className="w-4 h-4 mr-2" /> : null}
//                 {includeWine ? "Added" : "Add Wine"}
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="bg-pink-50/95 backdrop-blur-sm border-pink-200 dark:bg-pink-900/95 dark:border-pink-800">
//             <CardContent className="p-6 text-center">
//               <Flower2 className="w-8 h-8 text-pink-600 mx-auto mb-3 dark:text-pink-400" />
//               <h3 className="font-semibold text-pink-800 mb-2 dark:text-pink-200 font-caveat text-lg">
//                 Fresh Flowers
//               </h3>
//               <p className="text-sm text-pink-600 mb-4 dark:text-pink-300">
//                 Beautiful bouquet to accompany your gift
//               </p>
//               <Button
//                 variant="outline"
//                 className={`border-pink-300 text-pink-700 hover:bg-pink-100 bg-transparent dark:border-pink-600 dark:text-pink-300 dark:hover:bg-pink-800 ${
//                   includeFlowers ? "bg-pink-100 dark:bg-pink-800" : ""
//                 }`}
//                 onClick={() => setIncludeFlowers(!includeFlowers)}
//               >
//                 {includeFlowers ? <Check className="w-4 h-4 mr-2" /> : null}
//                 {includeFlowers ? "Added" : "Add Flowers"}
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="bg-green-50/95 backdrop-blur-sm border-green-200 dark:bg-green-900/95 dark:border-green-800">
//             <CardContent className="p-6 text-center">
//               <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3 dark:text-green-400" />
//               <h3 className="font-semibold text-green-800 mb-2 dark:text-green-200 font-caveat text-lg">
//                 Money Gift
//               </h3>
//               <p className="text-sm text-green-600 mb-4 dark:text-green-300">
//                 Contribute with a monetary gift via bank transfer
//               </p>
//               <Button
//                 variant="outline"
//                 className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800"
//                 onClick={() => setShowMoneyDonationForm(true)}
//               >
//                 <DollarSign className="w-4 h-4 mr-2" />
//                 Donate Money
//               </Button>
//             </CardContent>
//           </Card>
//         </div> */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           {celebrantSettings.enableWineSelection && (
//             <Card className="bg-purple-50/95 backdrop-blur-sm border-purple-200 dark:bg-purple-900/95 dark:border-purple-800">
//               <CardContent className="p-6 text-center">
//                 <Wine className="w-8 h-8 text-purple-600 mx-auto mb-3 dark:text-purple-400" />
//                 <h3 className="font-semibold text-purple-800 mb-2 dark:text-purple-200 font-caveat text-lg">
//                   Wine Selection
//                 </h3>
//                 <p className="text-sm text-purple-600 mb-4 dark:text-purple-300">
//                   Add a bottle of wine to any gift
//                 </p>
//                 <Button
//                   variant="outline"
//                   className={`border-purple-300 text-purple-700 hover:bg-purple-100 bg-transparent dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-800 ${
//                     includeWine ? "bg-purple-100 dark:bg-purple-800" : ""
//                   }`}
//                   onClick={() => setIncludeWine(!includeWine)}
//                 >
//                   {includeWine ? <Check className="w-4 h-4 mr-2" /> : null}
//                   {includeWine ? "Added" : "Add Wine"}
//                 </Button>
//               </CardContent>
//             </Card>
//           )}

//           {celebrantSettings.enableFlowers && (
//             <Card className="bg-pink-50/95 backdrop-blur-sm border-pink-200 dark:bg-pink-900/95 dark:border-pink-800">
//               <CardContent className="p-6 text-center">
//                 <Flower2 className="w-8 h-8 text-pink-600 mx-auto mb-3 dark:text-pink-400" />
//                 <h3 className="font-semibold text-pink-800 mb-2 dark:text-pink-200 font-caveat text-lg">
//                   Fresh Flowers
//                 </h3>
//                 <p className="text-sm text-pink-600 mb-4 dark:text-pink-300">
//                   Beautiful bouquet to accompany your gift
//                 </p>
//                 <Button
//                   variant="outline"
//                   className={`border-pink-300 text-pink-700 hover:bg-pink-100 bg-transparent dark:border-pink-600 dark:text-pink-300 dark:hover:bg-pink-800 ${
//                     includeFlowers ? "bg-pink-100 dark:bg-pink-800" : ""
//                   }`}
//                   onClick={() => setIncludeFlowers(!includeFlowers)}
//                 >
//                   {includeFlowers ? <Check className="w-4 h-4 mr-2" /> : null}
//                   {includeFlowers ? "Added" : "Add Flowers"}
//                 </Button>
//               </CardContent>
//             </Card>
//           )}

//           {celebrantSettings.enableMoneyGift && (
//             <Card className="bg-green-50/95 backdrop-blur-sm border-green-200 dark:bg-green-900/95 dark:border-green-800">
//               <CardContent className="p-6 text-center">
//                 <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3 dark:text-green-400" />
//                 <h3 className="font-semibold text-green-800 mb-2 dark:text-green-200 font-caveat text-lg">
//                   Money Gift
//                 </h3>
//                 <p className="text-sm text-green-600 mb-4 dark:text-green-300">
//                   Contribute with a monetary gift via bank transfer
//                 </p>
//                 <Button
//                   variant="outline"
//                   className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800"
//                   onClick={() => setShowMoneyDonationForm(true)}
//                 >
//                   <DollarSign className="w-4 h-4 mr-2" />
//                   Donate Money
//                 </Button>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {selectedItems.length > 0 && (
//           <Card className="bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
//             <CardHeader>
//               <CardTitle className="text-center">Your Selected Gifts</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2 mb-4">
//                 {selectedItemsData.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex justify-between items-center py-2 border-b dark:border-gray-700"
//                   >
//                     <span>{item.title}</span>
//                   </div>
//                 ))}
//                 {includeWine && (
//                   <div className="flex justify-between items-center py-2 border-b text-purple-700 dark:text-purple-300 dark:border-gray-700">
//                     <span>Wine Selection</span>
//                   </div>
//                 )}
//                 {includeFlowers && (
//                   <div className="flex justify-between items-center py-2 border-b text-pink-700 dark:text-pink-300 dark:border-gray-700">
//                     <span>Fresh Flowers</span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex gap-2 mb-4">
//                 <AILetterGenerator
//                   guestName={guestInfo.name}
//                   selectedItems={selectedItemsData}
//                 />
//               </div>

//               <Button
//                 className="w-full bg-pink-600 hover:bg-pink-700 text-white"
//                 onClick={() => setShowReservationForm(true)}
//               >
//                 Reserve Selected Gifts
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       <Dialog open={showReservationForm} onOpenChange={setShowReservationForm}>
//         <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Reserve Your Gifts</DialogTitle>
//             <DialogDescription>
//               Please provide your details to reserve the selected gifts.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="guest-name">Your Name *</Label>
//               <Input
//                 id="guest-name"
//                 value={guestInfo.name}
//                 onChange={(e) =>
//                   setGuestInfo({ ...guestInfo, name: e.target.value })
//                 }
//                 placeholder="Enter your full name"
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="guest-email">Email Address *</Label>
//               <Input
//                 id="guest-email"
//                 type="email"
//                 value={guestInfo.email}
//                 onChange={(e) =>
//                   setGuestInfo({ ...guestInfo, email: e.target.value })
//                 }
//                 placeholder="your.email@example.com"
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="guest-phone">Phone Number (optional)</Label>
//               <Input
//                 id="guest-phone"
//                 value={guestInfo.phone}
//                 onChange={(e) =>
//                   setGuestInfo({ ...guestInfo, phone: e.target.value })
//                 }
//                 placeholder="+234 801 234 5678"
//               />
//             </div>
//             <div>
//               <Label htmlFor="guest-message">Personal Message (optional)</Label>
//               <Textarea
//                 id="guest-message"
//                 value={guestInfo.message}
//                 onChange={(e) =>
//                   setGuestInfo({ ...guestInfo, message: e.target.value })
//                 }
//                 placeholder="Write a birthday message..."
//                 rows={3}
//               />
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-800">
//               <h4 className="font-semibold mb-2">Reservation Summary:</h4>
//               <div className="space-y-1 text-sm">
//                 {selectedItemsData.map((item) => (
//                   <div key={item.id} className="flex justify-between">
//                     <span>{item.title}</span>
//                   </div>
//                 ))}
//                 {includeWine && (
//                   <div className="flex justify-between text-purple-700 dark:text-purple-300">
//                     <span>Wine Selection</span>
//                   </div>
//                 )}
//                 {includeFlowers && (
//                   <div className="flex justify-between text-pink-700 dark:text-pink-300">
//                     <span>Fresh Flowers</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 dark:bg-purple-900/50 dark:border-purple-800">
//               <h4 className="font-semibold text-purple-800 mb-2 dark:text-purple-200">
//                 Add a Personal Touch
//               </h4>
//               <p className="text-sm text-purple-600 mb-3 dark:text-purple-300">
//                 Generate a beautiful AI-written letter to accompany your gift!
//               </p>
//               <AILetterGenerator
//                 guestName={guestInfo.name}
//                 selectedItems={selectedItemsData}
//               />
//             </div>

//             <div className="flex gap-2 pt-4">
//               <Button
//                 onClick={handleReservation}
//                 className="flex-1 bg-pink-600 hover:bg-pink-700"
//                 disabled={!guestInfo.name || !guestInfo.email || isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   "Confirm Reservation"
//                 )}
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => setShowReservationForm(false)}
//                 className="flex-1"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <MoneyDonationModal
//         isOpen={showMoneyDonationForm}
//         onClose={() => setShowMoneyDonationForm(false)}
//         onSubmit={handleMoneyDonation}
//         isSubmitting={isSubmitting}
//       />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  LogOut,
  Upload,
  User,
  Camera,
  Share,
  Copy,
} from "lucide-react";
import type { WishlistItem } from "@/lib/types";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { WishlistItemForm } from "@/components/wishlist-item-form";
import { uploadImage } from "@/lib/storage";
import { toast } from "sonner";

function AdminDashboardContent() {
  const { logout, user } = useAuth();
  const {
    wishlistItems,
    addItem,
    updateItem,
    deleteItem,
    celebrantSettings,
    updateCelebrantSettings,
  } = useWishlist();
  const router = useRouter();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const [settingsData, setSettingsData] = useState({
    name: celebrantSettings.name,
    age: celebrantSettings.age || "",
    profileImage: celebrantSettings.profileImage || "",
    backgroundImage: celebrantSettings.backgroundImage || "",
    enableWineSelection: celebrantSettings.enableWineSelection ?? false,
    enableFlowers: celebrantSettings.enableFlowers ?? false,
    enableMoneyGift: celebrantSettings.enableMoneyGift ?? true,
  });

  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);

  const handleSaveNewItem = (itemData: Partial<WishlistItem>) => {
    addItem({
      title: itemData.title!,
      description: itemData.description || "",
      image: itemData.image || "",
      quantity: itemData.quantity || 1,
      category: itemData.category || "",
      reserved: 0,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditItem = (item: WishlistItem) => {
    setEditingItem(item);
  };

  const handleSaveEditedItem = (itemData: Partial<WishlistItem>) => {
    if (!editingItem) return;

    updateItem(editingItem.id, {
      title: itemData.title!,
      description: itemData.description || "",
      image: itemData.image || "",
      quantity: itemData.quantity || 1,
      category: itemData.category || "",
    });
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItem(itemId);
  };

  const handleSaveSettings = () => {
    updateCelebrantSettings({
      name: settingsData.name,
      age: settingsData.age
        ? Number.parseInt(settingsData.age.toString())
        : undefined,
      profileImage: settingsData.profileImage,
      backgroundImage: settingsData.backgroundImage,
    });
    setIsSettingsDialogOpen(false);
  };

  const handlePhotoUpload = async (type: "profile" | "background") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (type === "profile") {
          setIsUploadingProfile(true);
        } else {
          setIsUploadingBackground(true);
        }

        try {
          console.log("Uploading image...");
          const result = await uploadImage(file, `celebrant/${type}`);
          if (type === "profile") {
            setSettingsData((prev) => ({ ...prev, profileImage: result.url }));
          } else {
            setSettingsData((prev) => ({
              ...prev,
              backgroundImage: result.url,
            }));
          }
        } catch (error) {
          console.error("Upload failed:", error);
          toast.error("Failed to upload image. Please try again.");
        } finally {
          if (type === "profile") {
            setIsUploadingProfile(false);
          } else {
            setIsUploadingBackground(false);
          }
        }
      }
    };
    input.click();
  };

  const totalItems = wishlistItems.length;
  const totalReserved = wishlistItems.reduce(
    (sum, item) => sum + item.reserved,
    0
  );
  const totalAvailable = wishlistItems.reduce(
    (sum, item) => sum + (item.quantity - item.reserved),
    0
  );

  const itemsByCategory = wishlistItems.reduce(
    (acc, item) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, WishlistItem[]>
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/admin/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout failed:", error);
    }
  };

  const handleViewPublicPage = () => {
    window.open("/", "_blank");
  };

  const handleShareWishlist = () => {
    setShowShareDialog(true);
  };

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/public/${celebrantSettings.celebrantId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link. Please copy manually.");
    }
  };

  const getShareUrl = () => {
    return `${window.location.origin}/public/${celebrantSettings.celebrantId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white font-caveat text-4xl">
              Wishlist Management
            </h1>
            <p className="text-gray-600 mt-1 dark:text-gray-300 font-caveat text-lg">
              Welcome {user?.email} - Manage {celebrantSettings.name}'s birthday
              wishlist
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={handleShareWishlist}
            >
              <Share className="w-4 h-4" />
              Share Wishlist
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={handleViewPublicPage}
            >
              <Eye className="w-4 h-4" />
              View Public Page
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => setIsSettingsDialogOpen(true)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {totalItems}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Items
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {totalAvailable}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">
                {totalReserved}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reserved
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">
                {totalItems > 0
                  ? Math.round((totalReserved / totalItems) * 100)
                  : 0}
                %
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completion
              </p>
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
                <DialogDescription>
                  Create a new item for the birthday wishlist.
                </DialogDescription>
              </DialogHeader>
              <WishlistItemForm
                onSave={handleSaveNewItem}
                onCancel={() => setIsAddDialogOpen(false)}
              />
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
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-shadow"
                  >
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
                          <CardTitle className="text-lg">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {item.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-end mb-3">
                        <div className="flex gap-2">
                          <Badge variant="outline">{item.quantity} total</Badge>
                          <Badge
                            variant={
                              item.reserved > 0 ? "default" : "secondary"
                            }
                          >
                            {item.reserved} reserved
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-pink-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(item.reserved / item.quantity) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2 dark:text-gray-400">
                        {item.quantity - item.reserved} of {item.quantity}{" "}
                        available
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
              <DialogDescription>
                Update the details of this wishlist item.
              </DialogDescription>
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

        <Dialog
          open={isSettingsDialogOpen}
          onOpenChange={setIsSettingsDialogOpen}
        >
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Celebrant Settings
              </DialogTitle>
              <DialogDescription>
                Update the celebrant's profile information and photos.
              </DialogDescription>
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
                      onChange={(e) =>
                        setSettingsData((prev) => ({
                          ...prev,
                          profileImage: e.target.value,
                        }))
                      }
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
                      {isUploadingBackground
                        ? "Uploading..."
                        : "Upload Background"}
                    </Button>
                  </div>
                  <Input
                    placeholder="Or paste background image URL"
                    value={settingsData.backgroundImage}
                    onChange={(e) =>
                      setSettingsData((prev) => ({
                        ...prev,
                        backgroundImage: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setSettingsData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setSettingsData((prev) => ({
                        ...prev,
                        age: e.target.value,
                      }))
                    }
                    placeholder="Enter age"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
                <h4 className="font-semibold text-gray-800 mb-3 dark:text-gray-200 font-caveat text-lg">
                  Preview
                </h4>
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
                <Button
                  onClick={handleSaveSettings}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  Save Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsSettingsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share className="w-5 h-5" />
                Share Your Wishlist
              </DialogTitle>
              <DialogDescription>
                Share this link with friends and family so they can view and
                reserve gifts without needing to log in.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Public Share Link
                </Label>
                <div className="flex gap-2">
                  <Input value={getShareUrl()} readOnly className="text-sm" />
                  <Button
                    onClick={copyShareLink}
                    size="sm"
                    className="gap-2 bg-pink-600 hover:bg-pink-700"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 dark:bg-blue-900/50 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 mb-2 dark:text-blue-200">
                  How it works:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Anyone with this link can view your wishlist</li>
                  <li>• They can reserve gifts without creating an account</li>
                  <li>
                    • You'll receive email notifications for all reservations
                  </li>
                  <li>• The link works on any device</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={copyShareLink}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowShareDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}