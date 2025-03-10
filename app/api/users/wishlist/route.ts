import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";
import { revalidateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for adding/removing products from a user's wishlist
 * This is a toggle operation - if the product is already in the wishlist, it will be removed
 */
export const POST = async (req: NextRequest) => {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDB();

    // Parse request body
    const body = await req.json();
    const { productId } = body;

    // Validate productId
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Ensure wishlist is an array
    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }

    // Check if product is already in wishlist
    const isFavorite = user.wishlist.includes(productId);
    let action;

    // Toggle product in wishlist
    if (isFavorite) {
      user.wishlist = user.wishlist.filter(
        (id: string) => id !== productId
      );
      action = "removed";
    } else {
      user.wishlist.push(productId);
      action = "added";
    }

    // Save user
    await user.save();

    // Revalidate user data cache
    revalidateTag('userData');

    // Return updated user with proper format
    return NextResponse.json(
      { 
        success: true, 
        message: `Product ${action} from wishlist`,
        action,
        wishlist: user.wishlist,
        user: {
          _id: user._id,
          clerkId: user.clerkId,
          wishlist: user.wishlist,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Internal server error" 
      },
      { status: 500 }
    );
  }
}