'use server';

import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { cache } from 'react';

// Define user type for better type safety
type SafeUser = {
  _id: string;
  clerkId: string;
  wishlist: string[];
  [key: string]: any;
};

// Cache user data with React cache
export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("[GET_CURRENT_USER] No userId found in auth");
      return null;
    }

    await connectToDB();

    let user = await User.findOne({ clerkId: userId });

    // When the user sign-in for the 1st time, immediately create a new user
    if (!user) {
      user = await User.create({ 
        clerkId: userId,
        wishlist: [] // Ensure wishlist is always initialized as an array
      });
      await user.save();
    }

    // Ensure wishlist exists and is an array
    if (!user.wishlist) {
      user.wishlist = [];
      await user.save();
    }

    // Convert Mongoose document to plain object for serialization
    const safeUser = JSON.parse(JSON.stringify(user));
    return safeUser;
  } catch (err) {
    console.error("[GET_CURRENT_USER_ERROR]", err);
    throw new Error("Failed to fetch current user");
  }
});

// Update user wishlist
export async function updateWishlist(productId: string): Promise<SafeUser> {
  try {
    if (!productId || typeof productId !== 'string') {
      throw new Error("Invalid product ID");
    }

    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    await connectToDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    // Ensure wishlist exists and is an array
    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }

    const isLiked = user.wishlist.includes(productId);

    if (isLiked) {
      // Dislike - remove item from wishlist
      user.wishlist = user.wishlist.filter((id: string) => id !== productId);
    } else {
      // Like - add item to wishlist
      user.wishlist.push(productId);
    }

    await user.save();
    
    // Revalidate the user data cache
    revalidateTag('user-data');
    
    // Convert Mongoose document to plain object for serialization
    const safeUser = JSON.parse(JSON.stringify(user));
    return safeUser;
  } catch (err) {
    console.error("[UPDATE_WISHLIST_ERROR]", err);
    throw err instanceof Error 
      ? err 
      : new Error("Failed to update wishlist");
  }
} 