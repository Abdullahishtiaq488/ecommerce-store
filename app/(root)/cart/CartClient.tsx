"use client";

import Empty from "@/components/Empty";
import useCart from "@/lib/hooks/useCart";
import { MinusCircle, PlusCircle, Trash, ShoppingBag, RefreshCw, ChevronLeft, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CartClientProps {
    cartItems: CartItem[];
    createCheckoutSession: (cartItems: CartItem[]) => Promise<any>;
    user: UserType | null;
}

const CartClient = ({ cartItems: initialCartItems = [], createCheckoutSession, user }: CartClientProps) => {
    const router = useRouter();
    const cart = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [removingItemId, setRemovingItemId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialize cart with server-provided items
    useEffect(() => {
        try {
            if (initialCartItems && Array.isArray(initialCartItems) && initialCartItems.length > 0) {
                // Make sure each cart item has all required fields before setting
                const validCartItems = initialCartItems.filter(item =>
                    item && item.item && item.item._id && typeof item.quantity === 'number'
                );
                cart.setCartItems(validCartItems);
            }
        } catch (err) {
            console.error("Error initializing cart:", err);
            setError("Failed to load cart items");
        }
    }, []);

    const total = cart.cartItems.reduce(
        (acc, cartItem) => acc + (cartItem.item?.price || 0) * cartItem.quantity,
        0
    );
    const totalRounded = parseFloat(total.toFixed(2));
    const itemCount = cart.cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleCheckout = async () => {
        try {
            if (!user) {
                router.push("/sign-in");
                return;
            }

            if (cart.cartItems.length === 0) {
                setError("Your cart is empty");
                return;
            }

            setIsLoading(true);
            setError(null);

            const response = await createCheckoutSession(cart.cartItems);

            if (response?.url) {
                window.location.href = response.url;
            } else {
                throw new Error("Invalid checkout response");
            }
        } catch (err) {
            console.error("[CHECKOUT_CLIENT]", err);
            setError(err instanceof Error ? err.message : "Failed to process checkout");
            setIsLoading(false);
        }
    };

    const handleRemoveItem = (productId: string) => {
        try {
            if (!productId) return;

            setRemovingItemId(productId);

            // Delay actual removal to allow animation to complete
            setTimeout(() => {
                cart.removeItem(productId);
                setRemovingItemId(null);
            }, 300);
        } catch (err) {
            console.error("Error removing item:", err);
            setError("Failed to remove item");
            setRemovingItemId(null);
        }
    };

    const handleQuantityChange = (productId: string, type: 'increase' | 'decrease') => {
        try {
            if (!productId) return;

            if (type === 'increase') {
                cart.increaseQuantity(productId);
            } else {
                cart.decreaseQuantity(productId);
            }
        } catch (err) {
            console.error("Error updating quantity:", err);
            setError("Failed to update quantity");
        }
    };

    if (error) {
        return (
            <div className="py-8 px-4">
                <div className="max-w-2xl mx-auto bg-red-50 p-6 rounded-lg border border-red-100">
                    <div className="flex items-center mb-4">
                        <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                        <h3 className="text-heading4-bold text-red-700">Error</h3>
                    </div>
                    <p className="text-body-medium text-red-600 mb-4">{error}</p>
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={() => setError(null)}
                            className="px-4 py-2 bg-red-1 text-white rounded-md hover:bg-red-600 transition-colors mr-2"
                        >
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart.cartItems || cart.cartItems.length === 0) {
        return (
            <div className="py-10 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <h2 className="text-heading3-bold mb-2">Your cart is empty</h2>
                    <p className="text-body-medium text-gray-500 mb-8">
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-1 hover:bg-red-600 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-8 py-8 max-lg:flex-col">
            {/* Loading overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                        <RefreshCw className="h-6 w-6 text-red-1 animate-spin" />
                        <p className="text-body-bold">Processing your order...</p>
                    </div>
                </div>
            )}

            <div className="w-2/3 max-lg:w-full">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-heading3-bold">
                        Shopping Cart <span className="text-body-medium text-gray-500">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    </h1>
                    <Link
                        href="/"
                        className="flex items-center text-gray-600 hover:text-red-1 text-sm font-medium"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Continue Shopping
                    </Link>
                </div>

                <div className="rounded-lg bg-white shadow-sm overflow-hidden">
                    {cart.cartItems.map((cartItem, index) => (
                        <div
                            key={`${cartItem.item?._id || index}`}
                            className={`w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-gray-50 px-4 py-4 items-center max-sm:items-start justify-between border-b last:border-b-0 transition-all duration-300 ${removingItemId === cartItem.item?._id ? 'opacity-0 scale-95 h-0 py-0 border-0 my-0' : 'opacity-100 scale-100'
                                }`}
                        >
                            {cartItem.item && (
                                <>
                                    <div className="flex items-center">
                                        <Link href={`/products/${cartItem.item._id}`}>
                                            <Image
                                                src={cartItem.item.media?.[0] || '/placeholder.jpg'}
                                                width={80}
                                                height={80}
                                                className="rounded-lg w-24 h-24 object-cover"
                                                alt={cartItem.item.title || 'Product'}
                                            />
                                        </Link>
                                        <div className="flex flex-col gap-2 ml-4">
                                            <Link
                                                href={`/products/${cartItem.item._id}`}
                                                className="text-body-bold hover:text-red-1 transition-colors"
                                            >
                                                {cartItem.item.title || 'Product'}
                                            </Link>
                                            {cartItem.color && (
                                                <p className="text-small-medium text-gray-500">Color: {cartItem.color}</p>
                                            )}
                                            {cartItem.size && (
                                                <p className="text-small-medium text-gray-500">Size: {cartItem.size}</p>
                                            )}
                                            <p className="text-small-medium font-semibold">${cartItem.item.price?.toFixed(2) || '0.00'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-center">
                                        <button
                                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            onClick={() => handleQuantityChange(cartItem.item._id, 'decrease')}
                                            aria-label="Decrease quantity"
                                            disabled={cartItem.quantity <= 1}
                                        >
                                            <MinusCircle
                                                className={`${cartItem.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:text-red-1 cursor-pointer text-gray-500'}`}
                                                size={20}
                                            />
                                        </button>
                                        <p className="text-body-bold min-w-[24px] text-center">{cartItem.quantity}</p>
                                        <button
                                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            onClick={() => handleQuantityChange(cartItem.item._id, 'increase')}
                                            aria-label="Increase quantity"
                                        >
                                            <PlusCircle className="hover:text-red-1 cursor-pointer text-gray-500" size={20} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <p className="text-body-bold min-w-[70px] text-right">
                                            ${((cartItem.item.price || 0) * cartItem.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-2"
                                            onClick={() => handleRemoveItem(cartItem.item._id)}
                                            aria-label="Remove item"
                                        >
                                            <Trash className="hover:text-red-1 cursor-pointer text-gray-500" size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-1/3 max-lg:w-full sticky top-4 h-fit">
                <div className="flex flex-col gap-6 bg-gray-50 rounded-lg px-6 py-6 shadow-sm">
                    <h2 className="text-heading4-bold border-b border-gray-200 pb-4">
                        Order Summary
                    </h2>

                    <div className="space-y-4">
                        <div className="flex justify-between text-body-medium">
                            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                            <span>${totalRounded.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-body-medium">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>

                        <div className="flex justify-between text-body-medium">
                            <span>Taxes</span>
                            <span>Calculated at checkout</span>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-2"></div>

                        <div className="flex justify-between text-body-bold">
                            <span>Estimated Total</span>
                            <span>${totalRounded.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        className="border rounded-md text-body-bold bg-red-1 text-white py-3 w-full hover:bg-red-600 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        onClick={handleCheckout}
                        disabled={isLoading || cart.cartItems.length === 0}
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Proceed to Checkout'
                        )}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-2">
                        Secure checkout powered by Stripe. By proceeding, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartClient; 