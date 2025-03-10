"use client"

import { ProductType } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";

interface HeartFavoriteProps {
  product: ProductType;
}

const HeartFavorite = ({ product }: HeartFavoriteProps) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate product
  if (!product || !product._id) {
    return null;
  }

  const getUser = useCallback(async () => {
    try {
      if (!isLoaded || !user) return;

      setIsLoading(true);
      const response = await fetch(`/api/users/${user.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();

      if (userData && Array.isArray(userData.wishlist)) {
        setIsLiked(userData.wishlist.includes(product._id));
      }

      setError(null);
    } catch (err) {
      console.error("[GET_USER_ERROR]", err);
      setError("Failed to check wishlist status");
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, user, product._id]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleLike = async () => {
    try {
      if (!isLoaded) return;

      if (!user) {
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);

      const response = await fetch("/api/users/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update wishlist");
      }

      setIsLiked(!isLiked);
      toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist");
      router.refresh();
    } catch (err) {
      console.error("[WISHLIST_ERROR]", err);
      toast.error("Failed to update wishlist");
      setError("Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse"><Heart className="h-6 w-6 text-gray-300" /></div>;
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className="focus:outline-none"
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-6 w-6 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"}`}
      />
    </button>
  );
};

export default HeartFavorite;
