"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getProductDetails } from "@/lib/actions/actions";
import ProductCard from "@/components/ProductCard";

const Wishlist = () => {
  const { user, isLoaded: isUserLoaded } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null);
  const [wishlist, setWishlist] = useState<ProductType[]>([]);

  // Fetch user data with proper error handling
  const getUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users", {
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch user data: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setSignedInUser(data);
      } else {
        throw new Error(data.message || "Failed to fetch user data");
      }
    } catch (err) {
      console.error("[WISHLIST_GET_USER]", err);
      setError("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data when component mounts and user is loaded
  useEffect(() => {
    if (isUserLoaded) {
      if (user) {
        getUser();
      } else {
        setLoading(false);
      }
    }
  }, [user, isUserLoaded]);

  // Fetch wishlist products with proper error handling
  const getWishlist = async () => {
    try {
      setLoading(true);

      if (!signedInUser || !Array.isArray(signedInUser.wishlist) || signedInUser.wishlist.length === 0) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      // Use Promise.all to fetch all products in parallel
      const wishlistProducts = await Promise.all(
        signedInUser.wishlist.map(async (productId) => {
          try {
            return await getProductDetails(productId);
          } catch (err) {
            console.error(`[WISHLIST_GET_PRODUCT] Failed to fetch product ${productId}:`, err);
            return null;
          }
        })
      );

      // Filter out any null products (failed fetches)
      setWishlist(wishlistProducts.filter(Boolean));
    } catch (err) {
      console.error("[WISHLIST_GET_PRODUCTS]", err);
      setError("Failed to load wishlist products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Update user data when wishlist changes
  const updateSignedInUser = (updatedUser: UserType) => {
    setSignedInUser(updatedUser);
  };

  // Fetch wishlist products when user data changes
  useEffect(() => {
    if (signedInUser) {
      getWishlist();
    }
  }, [signedInUser]);

  // Show login prompt if user is not logged in
  if (isUserLoaded && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-10">
        <div className="text-center max-w-md">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h1 className="text-heading3-bold mb-4">Your Wishlist</h1>
          <p className="text-body-normal text-gray-500 mb-8">
            Please sign in to view and manage your wishlist items.
          </p>
          <Link href="/sign-in" className="bg-black text-white py-2 px-4 rounded-md inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Show error message if there was an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-10">
        <div className="text-center max-w-md">
          <h1 className="text-heading3-bold mb-4">Something went wrong</h1>
          <p className="text-body-normal text-gray-500 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="px-10 py-5 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-10 py-5">
      <p className="text-heading3-bold my-10">Your Wishlist</p>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Heart className="h-16 w-16 text-gray-300 mb-6" />
          <h2 className="text-heading4-medium mb-2">Your wishlist is empty</h2>
          <p className="text-body-normal text-gray-500 mb-8 text-center max-w-md">
            Items added to your wishlist will appear here. Start exploring our products to find items you love.
          </p>
          <Link href="/" className="bg-black text-white py-2 px-4 rounded-md flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-16">
          {wishlist.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              updateSignedInUser={updateSignedInUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;