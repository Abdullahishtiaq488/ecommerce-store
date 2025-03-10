import { updateWishlist } from "@/lib/actions/userActions";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return new NextResponse("Product Id required", { status: 400 });
    }

    const userId = "someUserId"; // Replace with the actual user ID or fetch it as needed

    const updatedUser = await updateWishlist(userId, productId);
    
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.error("[wishlist_POST_API]", err);
    
    if (err instanceof Error) {
      if (err.message === "Unauthorized") {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      if (err.message === "User not found") {
        return new NextResponse("User not found", { status: 404 });
      }
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
