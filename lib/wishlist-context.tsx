"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { WishlistItem } from "./types";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

interface CelebrantSettings {
  name: string;
  age?: number;
  profileImage?: string;
  backgroundImage?: string;
  celebrantId?: string;
  enableWineSelection?: boolean;
  enableFlowers?: boolean;
  enableMoneyGift?: boolean;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  celebrantSettings: CelebrantSettings;
  addItem: (item: Omit<WishlistItem, "id" | "createdAt" | "updatedAt">) => void;
  updateItem: (id: string, updates: Partial<WishlistItem>) => void;
  deleteItem: (id: string) => void;
  updateCelebrantSettings: (settings: Partial<CelebrantSettings>) => void;
  reserveItem: (id: string, quantity?: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const defaultWishlistItems: WishlistItem[] = [];

const defaultCelebrantSettings: CelebrantSettings = {
  name: "Sarah",
  age: 23,
  profileImage: "/placeholder.svg?key=8yjv9",
  backgroundImage: "/happy-birthday-celebration-background.png",
  enableWineSelection: false,
  enableFlowers: false,
  enableMoneyGift: true,
};

// 🔄 Helper: get pending sync queue from localStorage
const getPendingSync = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem("pendingSync") || "[]");
  } catch {
    return [];
  }
};

// 🔄 Helper: save pending sync queue
const savePendingSync = (queue: any[]) => {
  localStorage.setItem("pendingSync", JSON.stringify(queue));
};

const generateCelebrantId = () => {
  return `celebrant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] =
    useState<WishlistItem[]>(defaultWishlistItems);
  const [celebrantSettings, setCelebrantSettings] = useState<CelebrantSettings>(
    defaultCelebrantSettings
  );
  const [user, setUser] = useState<User | null>(null);

  // 🔄 Retry pending sync when online or on mount
  const processPendingSync = async () => {
    const queue = getPendingSync();
    if (queue.length === 0) return;

    const newQueue: any[] = [];

    for (const task of queue) {
      try {
        if (task.type === "add") {
          await setDoc(doc(db, "wishlistItems", task.item.id), {
            ...task.item,
            createdAt: Timestamp.fromDate(new Date(task.item.createdAt)),
            updatedAt: Timestamp.fromDate(new Date(task.item.updatedAt)),
          });
        } else if (task.type === "update") {
          await updateDoc(doc(db, "wishlistItems", task.id), {
            ...task.updates,
            updatedAt: Timestamp.fromDate(new Date(task.updates.updatedAt)),
          });
        } else if (task.type === "delete") {
          await deleteDoc(doc(db, "wishlistItems", task.id));
        } else if (task.type === "settings") {
          await setDoc(doc(db, "celebrant", "settings"), task.settings);
        }
      } catch (err) {
        console.error("Retry failed for task:", task, err);
        newQueue.push(task); // keep in queue if still failing
      }
    }

    savePendingSync(newQueue);

    if (newQueue.length === 0) {
      toast.success("✅ Offline changes synced to server");
    }
  };

  useEffect(() => {
    // Run on mount
    processPendingSync();

    // Run again when online
    window.addEventListener("online", processPendingSync);
    return () => window.removeEventListener("online", processPendingSync);
  }, []);

  // Load from localStorage, then Firestore
  useEffect(() => {
    const savedItems = localStorage.getItem("wishlistItems");
    const savedSettings = localStorage.getItem("celebrantSettings");

    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        setWishlistItems(itemsWithDates);
      } catch {}
    }

    if (savedSettings) {
      try {
         const parsedSettings = JSON.parse(savedSettings);
         if (!parsedSettings.celebrantId) {
           parsedSettings.celebrantId = generateCelebrantId();
         }
        setCelebrantSettings(parsedSettings);
      } catch (error) {
        console.error("Failed to parse saved celebrant settings:", error);
      }
    }
   const unsub = onAuthStateChanged(auth, async (user) => {
     if (!user) return; // not logged in, only localStorage fallback works

     try {
       // ✅ query under user's namespace
       const itemsSnapshot = await getDocs(
         collection(db, "users", user.uid, "wishlistItems")
       );
       const items: WishlistItem[] = itemsSnapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
         createdAt: doc.data().createdAt?.toDate(),
         updatedAt: doc.data().updatedAt?.toDate(),
       })) as WishlistItem[];
       setWishlistItems(items);
       localStorage.setItem("wishlistItems", JSON.stringify(items));

       const settingsRef = doc(db, "users", user.uid, "celebrant", "settings");
       const settingsSnap = await getDoc(settingsRef);
       if (settingsSnap.exists()) {
         const newSettings = settingsSnap.data() as CelebrantSettings;
         setCelebrantSettings(newSettings);
         localStorage.setItem("celebrantSettings", JSON.stringify(newSettings));
       }
     } catch (err) {
       console.error("Fetch error:", err);
       toast.error("Could not sync wishlist with server.");
     }
   });

   return () => unsub();
  
  }, []);

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    localStorage.setItem(
      "celebrantSettings",
      JSON.stringify(celebrantSettings)
    );
  }, [celebrantSettings]);

  // 👤 Listen for login/logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        loadUserData(firebaseUser.uid);
      } else {
        setWishlistItems([]);
        setCelebrantSettings(defaultCelebrantSettings);
      }
    });
    return () => unsub();
  }, []);

  // 🔄 Load user-specific data
  const loadUserData = async (uid: string) => {
    const itemsSnapshot = await getDocs(
      collection(db, "users", uid, "wishlistItems")
    );
    const items: WishlistItem[] = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as WishlistItem[];
    setWishlistItems(items);

    const settingsRef = doc(db, "users", uid, "celebrant", "settings");
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      setCelebrantSettings(settingsSnap.data() as CelebrantSettings);
    }
  };

  // ✍️ When adding/updating, always include `uid`
  const addItem = async (
    itemData: Omit<WishlistItem, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user) return toast.error("You must be logged in to add items");

    const id = Date.now().toString();
    const newItem: WishlistItem = {
      ...itemData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await setDoc(doc(db, "users", user.uid, "wishlistItems", id), {
        ...newItem,
        createdAt: Timestamp.fromDate(newItem.createdAt),
        updatedAt: Timestamp.fromDate(newItem.updatedAt),
      });
      toast.success("Item added");
    } catch (err) {
      console.error("Add item failed, queueing:", err);
      const queue = getPendingSync();
      queue.push({ type: "add", item: newItem });
      savePendingSync(queue);
      toast.error("Failed to add item, changes will sync when online.");
    }

    setWishlistItems((prev) => [...prev, newItem]);
  };

  const updateItem = async (id: string, updates: Partial<WishlistItem>) => {
    if (!user) return toast.error("You must be logged in");

    const updatedAt = new Date();

    try {
      await updateDoc(doc(db, "users", user.uid, "wishlistItems", id), {
        ...updates,
        updatedAt: Timestamp.fromDate(updatedAt),
      });
      toast.success("Item updated");
    } catch (err) {
      console.error("Update item failed, queueing:", err);
      const queue = getPendingSync();
      queue.push({ type: "update", id, updates: { ...updates, updatedAt } });
      savePendingSync(queue);
      toast.error("Failed to update item, changes will sync when online.");
    }

    setWishlistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt } : item
      )
    );
  };

  const deleteItem = async (id: string) => {
    if (!user) return toast.error("You must be logged in");

    try {
      await deleteDoc(doc(db, "users", user.uid, "wishlistItems", id));
      toast.success("Item deleted");
    } catch (err) {
      console.error("Delete item failed, queueing:", err);
      const queue = getPendingSync();
      queue.push({ type: "delete", id });
      savePendingSync(queue);
      toast.error("Failed to delete item, changes will sync when online.");
    }

    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCelebrantSettings = async (
    settings: Partial<CelebrantSettings>
  ) => {
    if (!user) return toast.error("You must be logged in");

    const newSettings = { ...celebrantSettings, ...settings };

    try {
      await setDoc(
        doc(db, "users", user.uid, "celebrant", "settings"),
        newSettings
      );
      toast.success("Settings updated");
    } catch (err) {
      console.error("Update settings failed, queueing:", err);
      const queue = getPendingSync();
      queue.push({ type: "settings", settings: newSettings });
      savePendingSync(queue);
      toast.error("Failed to update settings, changes will sync when online.");
    }

    setCelebrantSettings(newSettings);
  };

  const reserveItem = async (id: string, quantity = 1) => {
    if (!user) return toast.error("You must be logged in");

    const item = wishlistItems.find((i) => i.id === id);
    if (!item) return;

    const newReserved = Math.min(
      (item.reserved || 0) + quantity,
      item.quantity
    );
    const updatedAt = new Date();

    try {
      await updateDoc(doc(db, "users", user.uid, "wishlistItems", id), {
        reserved: newReserved,
        updatedAt: Timestamp.fromDate(updatedAt),
      });
      toast.success("Item reserved");
    } catch (err) {
      console.error("Reserve item failed, queueing:", err);
      const queue = getPendingSync();
      queue.push({
        type: "update",
        id,
        updates: { reserved: newReserved, updatedAt },
      });
      savePendingSync(queue);
      toast.error("Failed to reserve item, changes will sync when online.");
    }

    setWishlistItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, reserved: newReserved, updatedAt } : i
      )
    );
  };

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
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
