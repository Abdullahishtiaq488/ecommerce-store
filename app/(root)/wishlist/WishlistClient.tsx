"use client";

import ProductCard from "@/components/ProductCard";
import { useState, useCallback } from "react";
import { Heart, ShoppingBag, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Empty from "@/components/Empty";

interface WishlistClientProps {
    products: ProductType[];
    user: UserType;
}

const WishlistClient = ({ products = [], user }: WishlistClientProps) => {
    const router = useRouter();
    const [signedInUser, setSignedInUser] = useState<UserType>(user);
    const [wishlistProducts, setWishlistProducts] = useState<ProductType[]>(products);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [removedItemId, setRemovedItemId] = useState<string | null>(null);

    // This function will be passed to ProductCard to update the user when items are removed from wishlist
    const updateSignedInUser = useCallback((updatedUser: UserType) => {
        try {
            if (!updatedUser || !Array.isArray(updatedUser.wishlist)) {
                throw new Error("Invalid user data");
            }

            setSignedInUser(updatedUser);

            // Animated removal of product
            if (updatedUser.wishlist.length < signedInUser.wishlist.length) {
                // Find which product was removed
                const removedProduct = signedInUser.wishlist.find(
                    id => !updatedUser.wishlist.includes(id)
                );

                if (removedProduct) {
                    setRemovedItemId(removedProduct);

                    // After animation completes, update the products list
                    setTimeout(() => {
                        setWishlistProducts(prevProducts =>
                            prevProducts.filter(product => updatedUser.wishlist.includes(product._id))
                        );
                        setRemovedItemId(null);
                    }, 300);
                } else {
                    // If we can't identify the removed product, just update the list
                    setWishlistProducts(prevProducts =>
                        prevProducts.filter(product => updatedUser.wishlist.includes(product._id))
                    );
                }
            }

            // Refresh the page to ensure data is in sync
            router.refresh();
        } catch (err) {
            console.error("Error updating wishlist:", err);
            setError("Failed to update wishlist");
        }
    }, [signedInUser, router]);

    // If an error occurred
    if (error) {
        return (
            <Empty
                title="Something went wrong"
                subtitle="We couldn't update your wishlist. Please try again later."
                showReset
                resetLink="/wishlist"
                resetLabel="Reload Page"
            />
        );
    }

    // If user has no wishlist items, show empty state
    if (!wishlistProducts || wishlistProducts.length === 0) {
        return (
            <div className="py-10 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h2 className="text-heading3-bold mb-2">Your wishlist is empty</h2>
                    <p className="text-body-medium text-gray-500 mb-8">
                        Products you like will be saved here so you can easily find them later.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-1 hover:bg-red-600 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-4">
            <h1 className="text-heading3-bold mb-6">
                Your Wishlist <span className="text-body-medium text-gray-500">({wishlistProducts.length} items)</span>
            </h1>

            {isLoading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                        <RefreshCw className="h-6 w-6 text-red-1 animate-spin" />
                        <p className="text-body-bold">Updating your wishlist...</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((product) => (
                    <div
                        key={product._id}
                        className={`transition-opacity duration-300 ${removedItemId === product._id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                            }`}
                    >
                        {product && (
                            <ProductCard
                                product={product}
                                updateSignedInUser={updateSignedInUser}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistClient; 