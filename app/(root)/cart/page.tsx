import { Metadata } from "next";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/actions/userActions";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View your shopping cart and proceed to checkout.",
};

const CartPage = async () => {
  try {
    // Fetch current user (if authenticated)
    const user = await getCurrentUser();

    // Return the cart client component
    return (
      <div className="bg-gray-50 min-h-screen">
        <CartClient />
      </div>
    );
  } catch (error) {
    console.error("[CART_PAGE_ERROR]", error);

    // Return a fallback UI with the CartClient
    // The client component will handle rendering appropriate error states
    return (
      <div className="bg-gray-50 min-h-screen">
        <CartClient />
      </div>
    );
  }
};

export default CartPage;