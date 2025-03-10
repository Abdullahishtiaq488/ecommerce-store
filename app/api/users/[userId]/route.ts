import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler for fetching a user by their Clerk ID
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  try {
    // Authenticate user
    const { userId: authUserId } = await auth();

    if (!authUserId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Get userId from params
    const { userId } = params;

    // Connect to database
    await connectToDB();

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

    // Return user data
    return NextResponse.json(
      { 
        success: true,
        wishlist: user.wishlist,
        _id: user._id,
        clerkId: user.clerkId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[USER_GET_BY_ID]", error);
    
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