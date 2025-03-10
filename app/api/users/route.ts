import { getCurrentUser } from "@/lib/actions/userActions";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler for fetching the current authenticated user
 * Returns user data or an error response
 */
export const GET = async (req: NextRequest) => {
  try {
    // Get current user from server action
    const user = await getCurrentUser();
    
    // If user is not authenticated, return 401
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Return user data with success flag
    return NextResponse.json({
      success: true,
      _id: user._id,
      clerkId: user.clerkId,
      wishlist: Array.isArray(user.wishlist) ? user.wishlist : [],
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, { status: 200 });
  } catch (err) {
    // Log error
    console.error("[USERS_GET_API]", err);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        message: err instanceof Error ? err.message : "Internal server error" 
      },
      { status: 500 }
    );
  }
}