import Container from "@/components/Container";
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

    // Filter products to get only those in the user's wishlist
    const wishlistedProducts = productsData.filter((product: ProductType) =>
      userWishlist.includes(product._id)
    );

    // Server action to remove from wishlist
    const removeFromWishlist = async (productId: string) => {
      "use server";

      if (!userData || !userData.clerkId) {
        throw new Error("User not authenticated");
      }

      try {
        await updateWishlist(userData.clerkId, productId);
      } catch (error) {
        console.error("[REMOVE_WISHLIST_ERROR]", error);
        throw new Error("Failed to remove item from wishlist");
      }
    };

    return (
      <Container>
        <EnhancedWishlistClient
          wishlisted={wishlistedProducts}
          user={userData}
          removeFromWishlist={removeFromWishlist}
        />
      </Container>
    );
  } catch (error) {
    console.error("[WISHLIST_PAGE_ERROR]", error);
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p>We couldn't load your wishlist. Please try again later.</p>
        </div>
      </Container>
    );
  }
};

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default WishlistPage;