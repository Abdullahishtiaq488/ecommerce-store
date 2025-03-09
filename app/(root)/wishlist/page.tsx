import Container from "@/components/Container";
import Hero from "@/components/Hero";
import { getCurrentUser, updateWishlist } from "@/lib/actions/userActions";
import { getProducts } from "@/lib/actions/actions";
import EnhancedWishlistClient from "./EnhancedWishlistClient";
import { redirect } from "next/navigation";

const WishlistPage = async () => {
  try {
    // Fetch user and products in parallel
    const [userData, productsData] = await Promise.all([
      getCurrentUser(),
      getProducts()
    ]);

    // If user is not authenticated, redirect to sign-in
    if (!userData) {
      redirect("/sign-in");
    }

    // Ensure wishlist is an array
    const userWishlist = Array.isArray(userData.wishlist) ? userData.wishlist : [];

    // Make sure products is an array
    const allProducts = Array.isArray(productsData) ? productsData : [];

    // Filter products to only include those in the user's wishlist
    const wishlistProducts = allProducts.filter(product =>
      userWishlist.includes(product._id)
    );

    // Serialize the data to prevent any Next.js serialization issues
    const serializedProducts = JSON.parse(JSON.stringify(wishlistProducts));
    const serializedUser = JSON.parse(JSON.stringify(userData));

    // Function to remove an item from the wishlist
    const removeFromWishlist = async (productId: string) => {
      "use server";

      if (!userData || !userData.clerkId) {
        throw new Error("User not authenticated");
      }

      try {
        await updateWishlist(userData.clerkId, productId);
        return { success: true };
      } catch (error) {
        console.error("[REMOVE_WISHLIST_ERROR]", error);
        throw new Error("Failed to remove item from wishlist");
      }
    };

    return (
      <div className="bg-gray-50 min-h-screen">
        <EnhancedWishlistClient
          wishlisted={serializedProducts}
          user={serializedUser}
          removeFromWishlist={removeFromWishlist}
        />
      </div>
    );
  } catch (error) {
    console.error("Wishlist page error:", error);

    // Return a fallback UI in case of error
    return (
      <div className="bg-gray-50 min-h-screen">
        <Container>
          <div className="py-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to load wishlist</h1>
            <p className="text-gray-600">
              We encountered an error while loading your wishlist. Please try again later.
            </p>
          </div>
        </Container>
      </div>
    );
  }
};

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default WishlistPage;