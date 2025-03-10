"use client"

import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";

import { ProductType } from "@/types";

interface HeartFavoriteProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const HeartFavorite = ({ product, updateSignedInUser }: HeartFavoriteProps) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate product
  if (!product || !product._id) {
    return null;
  }

  // Check if product is in user's wishlist
  const checkWishlistStatus = useCallback(async () => {
    try {
      if (!isLoaded || !user) return;

      setIsLoading(true);
      // Use the main users endpoint instead of the ID-specific one
      const response = await fetch(`/api/users`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const userData = await response.json();

      if (userData && userData.success && Array.isArray(userData.wishlist)) {
        setIsLiked(userData.wishlist.includes(product._id));
      }

      setError(null);
    } catch (err) {
      console.error("[HEART_FAVORITE_GET_USER]", err);
      setError("Failed to check wishlist status");
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, user, product._id]);

  // Check wishlist status when component mounts
  useEffect(() => {
    checkWishlistStatus();
  }, [checkWishlistStatus]);

  // Handle adding/removing product from wishlist
  const handleLike = async (e: React.MouseEvent) => {
    try {
      // Prevent event from bubbling up to parent link
      e.preventDefault();
      e.stopPropagation();
      
      if (!isLoaded) return;

      if (!user) {
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);

      // Optimistically update UI
      setIsLiked(!isLiked);
      
      const response = await fetch("/api/users/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!response.ok) {
        // Revert optimistic update if request fails
        setIsLiked(isLiked);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update wishlist");
      }

      const updatedData = await response.json();
      
      // Update parent component if callback is provided
      if (updateSignedInUser && updatedData.user) {
        updateSignedInUser(updatedData.user);
      }
      
      toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist");
      
      // Refresh the page to update the UI
      router.refresh();
    } catch (err) {
      console.error("[WISHLIST_UPDATE_ERROR]", err);
      toast.error("Failed to update wishlist");
      setError("Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className="focus:outline-none"
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <div className="animate-pulse">
          <Heart className="h-6 w-6 text-gray-300" />
        </div>
      ) : (
        <Heart
          className={`h-6 w-6 transition-colors ${
            isLiked 
              ? "fill-red-500 text-red-500" 
              : "text-gray-500 hover:text-red-500"
          }`}
        />
      )}
    </button>
  );
};

export default HeartFavorite;
