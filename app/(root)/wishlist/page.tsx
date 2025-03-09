import Container from "@/components/Container";
import Empty from "@/components/Empty";
import Hero from "@/components/Hero";
import { getCurrentUser } from "@/lib/actions/userActions";
import { getProducts } from "@/lib/actions/actions";
import WishlistClient from "./WishlistClient";
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

    return (
      <div>
        <Hero title="Wishlist" />
        <Container>
          <WishlistClient
            products={serializedProducts}
            user={serializedUser}
          />
        </Container>
      </div>
    );
  } catch (error) {
    console.error("Wishlist page error:", error);

    // Show a basic error UI
    return (
      <div>
        <Hero title="Wishlist" />
        <Container>
          <Empty
            title="Something went wrong"
            subtitle="We couldn't load your wishlist. Please try again later."
            showReset
            resetLink="/"
          />
        </Container>
      </div>
    );
  }
};

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default WishlistPage;