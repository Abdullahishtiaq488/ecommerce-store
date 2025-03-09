'use server';

import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { cache } from 'react';

// Define type for user with safer wishlist typing
export type SafeUser = {
  _id: string;
  clerkId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  wishlist: string[];
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Gets the current authenticated user data from the database.
 * Ensures wishlist is always an array.
 */
export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  try {
    // Check if user is authenticated
    const { userId } = auth();
    
    if (!userId) {
      console.log("[GET_CURRENT_USER] No userId found in auth");
      return null;
    }
    
    await connectToDB();
    
    // Find user in database
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      console.log(`[GET_CURRENT_USER] No user found for clerk ID: ${userId}`);
      return null;
    }
    
    // Ensure wishlist is always an array
    const safeUser: SafeUser = {
      ...user.toObject(),
      wishlist: Array.isArray(user.wishlist) ? user.wishlist : [],
    };
    
    return safeUser;
  } catch (err) {
    console.error("[GET_CURRENT_USER_ERROR]", err);
    throw new Error("Failed to fetch current user");
  }
});

/**
 * Updates the user's wishlist by adding or removing a product ID.
 * If the product ID is already in the wishlist, it will be removed (toggle behavior).
 */
export const updateWishlist = async (clerkId: string, productId: string) => {
  try {
    if (!clerkId || !productId) {
      throw new Error("Missing required parameters: clerkId or productId");
    }
    
    await connectToDB();
    
    // First, get the current user
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      throw new Error(`User with clerkId ${clerkId} not found`);
    }
    
    // Ensure user.wishlist is an array
    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }
    
    // Check if the product is already in the wishlist
    const productIndex = user.wishlist.indexOf(productId);
    
    if (productIndex === -1) {
      // If product is not in wishlist, add it
      user.wishlist.push(productId);
    } else {
      // If product is already in wishlist, remove it
      user.wishlist.splice(productIndex, 1);
    }
    
    // Save the updated user
    await user.save();
    
    // Revalidate user data
    revalidateTag('userData');
    
    return {
      success: true,
      wishlist: user.wishlist,
      added: productIndex === -1, // true if added, false if removed
    };
  } catch (err) {
    console.error("[UPDATE_WISHLIST_ERROR]", err);
    throw new Error(`Failed to update wishlist: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

/**
 * Gets user's wishlist items
 */
export const getUserWishlist = cache(async (userId: string): Promise<string[]> => {
  try {
    if (!userId) {
      throw new Error("Missing required parameter: userId");
    }
    
    await connectToDB();
    
    const user = await User.findOne({ clerkId: userId }).select('wishlist');
    
    if (!user) {
      return [];
    }
    
    // Ensure wishlist is an array
    return Array.isArray(user.wishlist) ? user.wishlist : [];
  } catch (err) {
    console.error("[GET_USER_WISHLIST_ERROR]", err);
    throw new Error("Failed to fetch user wishlist");
  }
}); 