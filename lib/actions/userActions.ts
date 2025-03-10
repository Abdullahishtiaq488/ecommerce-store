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
 * Uses React cache for efficient data fetching.
 * Ensures wishlist is always an array.
 */
export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  try {
    // Check if user is authenticated
    const authData = await auth();
    const userId = authData.userId;
    
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
    throw new Error(`Failed to fetch current user: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
});

/**
 * Gets user data by clerk ID.
 * Uses React cache for efficient data fetching.
 */
export const getUserByClerkId = cache(async (clerkId: string): Promise<SafeUser | null> => {
  try {
    if (!clerkId) {
      throw new Error("Clerk ID is required");
    }
    
    await connectToDB();
    
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return null;
    }
    
    // Ensure wishlist is always an array
    const safeUser: SafeUser = {
      ...user.toObject(),
      wishlist: Array.isArray(user.wishlist) ? user.wishlist : [],
    };
    
    return safeUser;
  } catch (err) {
    console.error("[GET_USER_BY_CLERK_ID_ERROR]", err);
    throw new Error(`Failed to fetch user by clerk ID: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
});

/**
 * Updates the user's wishlist by adding or removing a product ID.
 * If the product ID is already in the wishlist, it will be removed (toggle behavior).
 * Revalidates user data cache after update.
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
    let action;
    
    if (productIndex === -1) {
      // If product is not in wishlist, add it
      user.wishlist.push(productId);
      action = "added";
    } else {
      // If product is already in wishlist, remove it
      user.wishlist.splice(productIndex, 1);
      action = "removed";
    }
    
    // Save the updated user
    await user.save();
    
    // Revalidate user data
    revalidateTag('userData');
    
    return {
      success: true,
      wishlist: user.wishlist,
      action,
      message: `Product ${action} ${action === "added" ? "to" : "from"} wishlist`,
    };
  } catch (err) {
    console.error("[UPDATE_WISHLIST_ERROR]", err);
    throw new Error(`Failed to update wishlist: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

/**
 * Gets user's wishlist items
 * Uses React cache for efficient data fetching.
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
    throw new Error(`Failed to fetch user wishlist: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
});

/**
 * Creates a new user if they don't exist
 */
export const createUserIfNotExists = async (clerkId: string, email?: string, firstName?: string, lastName?: string) => {
  try {
    if (!clerkId) {
      throw new Error("Clerk ID is required");
    }
    
    await connectToDB();
    
    // Check if user already exists
    let user = await User.findOne({ clerkId });
    
    // If user doesn't exist, create a new one
    if (!user) {
      user = new User({
        clerkId,
        email,
        firstName,
        lastName,
        wishlist: [],
      });
      
      await user.save();
      
      // Revalidate user data
      revalidateTag('userData');
    }
    
    return user;
  } catch (err) {
    console.error("[CREATE_USER_ERROR]", err);
    throw new Error(`Failed to create user: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}; 