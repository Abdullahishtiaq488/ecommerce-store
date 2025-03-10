"use client";

import { ProductType, UserType } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Heart, Loader2, ShoppingBag, ShoppingCart, AlertCircle, Trash2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useCart from "@/lib/hooks/useCart";
import { toast } from "react-hot-toast";

interface WishlistClientProps {
    wishlisted: ProductType[];
    user: UserType | null;
    removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistClient = ({ wishlisted = [], user, removeFromWishlist }: WishlistClientProps) => {
    const router = useRouter();
    const { isLoaded: isUserLoaded } = useUser();
    const cart = useCart();

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [removingIds, setRemovingIds] = useState<Record<string, boolean>>({});
    const [wishlistItems, setWishlistItems] = useState<ProductType[]>([]);

    useEffect(() => {
        // Add a short delay to ensure smooth loading transition
        const timer = setTimeout(() => {
            setWishlistItems(wishlisted || []);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [wishlisted]);

    const handleRemoveFromWishlist = async (productId: string) => {
        try {
            setRemovingIds(prev => ({ ...prev, [productId]: true }));

            await removeFromWishlist(productId);

            // Filter out the removed item locally for immediate UI update
            setWishlistItems(prev => prev.filter(item => item._id !== productId));
            toast.success("Item removed from wishlist");
        } catch (error) {
            console.error("[REMOVE_WISHLIST_ERROR]", error);
            setHasError(true);
            toast.error("Failed to remove item from wishlist");
        } finally {
            setRemovingIds(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleAddToCart = (product: ProductType) => {
        try {
            cart.addItem({
                item: product,
                quantity: 1
            });
            toast.success("Added to cart");
        } catch (error) {
            console.error("[ADD_TO_CART_ERROR]", error);
            toast.error("Failed to add item to cart");
        }
    };

    // Show loading state
    if (isLoading || !isUserLoaded) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-red-1 animate-spin mb-4" />
                <p className="text-gray-500">Loading your wishlist...</p>
            </div>
        );
    }

    // Show empty wishlist
    if (!isLoading && wishlistItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Heart className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    Items added to your wishlist will appear here. Start exploring to find products you love.
                </p>
                <Link
                    href="/"
                    className="bg-red-1 text-white py-3 px-8 rounded-md hover:bg-red-600 transition-colors"
                >
                    Explore Products
                </Link>
            </div>
        );
    }

    // Show error message
    if (hasError) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
                    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h3>
                    <p className="text-red-700 mb-4">
                        We couldn't load your wishlist. Please try again later.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-1 text-white py-2 px-6 rounded-md hover:bg-red-600 transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                <span className="text-sm text-gray-600">{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}</span>
            </div>

            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-600 hover:text-red-1 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Continue Shopping
                </Link>
            </div>

            {hasError && (
                <div className="bg-red-50 p-4 rounded-md text-red-800 text-sm mb-6 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>There was an error updating your wishlist. Some changes may not have been saved.</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map(product => (
                    <div
                        key={product._id}
                        className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Product image */}
                        <div className="relative h-60 bg-gray-100">
                            <Link href={`/products/${product._id}`}>
                                {product.media?.[0] ? (
                                    <Image
                                        src={product.media[0]}
                                        alt={product.title}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ShoppingBag className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}
                            </Link>
                        </div>

                        {/* Product details */}
                        <div className="p-4">
                            <Link href={`/products/${product._id}`}>
                                <h3 className="text-lg font-medium text-gray-800 mb-1 hover:text-red-1 transition-colors">
                                    {product.title}
                                </h3>
                            </Link>

                            <div className="flex items-center justify-between mb-4">
                                <div className="text-base font-semibold text-gray-900">
                                    ${product.price?.toFixed(2)}
                                    {product.discountedPrice && (
                                        <span className="ml-2 text-sm text-gray-500 line-through">
                                            ${product.discountedPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {product.isOnSale && (
                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                        Sale
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {product.collections && product.collections.length > 0 && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {product.collections[0]}
                                    </span>
                                )}

                                {product.category && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {product.category}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex border-t divide-x">
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 py-3 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-red-1 transition-colors"
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                <span>Add to Cart</span>
                            </button>

                            <button
                                onClick={() => handleRemoveFromWishlist(product._id)}
                                disabled={removingIds[product._id]}
                                className="flex-1 py-3 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-red-1 transition-colors"
                            >
                                {removingIds[product._id] ? (
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                ) : (
                                    <Trash2 className="h-5 w-5 mr-2" />
                                )}
                                <span>Remove</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistClient; 