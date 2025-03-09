import { getCurrentUser } from "@/lib/actions/userActions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("[users_GET_API]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}