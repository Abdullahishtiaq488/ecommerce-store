"use client";

import useCart from "@/lib/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import {
    MinusCircle,
    PlusCircle,
    Trash2,
    ShoppingBag,
    ChevronLeft,
    ArrowRight,
    AlertCircle,
    Loader2,
    Shield
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const CartClient = () => {
    const router = useRouter();
    const { user, isLoaded: isUserLoaded } = useUser();
    const cart = useCart();

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isCartLoaded, setIsCartLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Calculate totals
    const subtotal = cart.cartItems.reduce(
        (acc, cartItem) => acc + (cartItem.item?.price || 0) * cartItem.quantity,
        0
    );
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shipping + tax;

    // Format currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    // On component mount
    useEffect(() => {
        // Add a delay to ensure cart is properly initialized from localStorage
        const timer = setTimeout(() => {
            setIsCartLoaded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Customer info for checkout
    const customer = {
        clerkId: user?.id,
        email: user?.emailAddresses?.[0]?.emailAddress,
        name: user?.fullName,
    };

    const handleCheckout = async () => {
        if (!user) {
            toast.error("Please sign in to checkout");
            router.push("/sign-in");
            return;
        }

        if (cart.cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        try {
            setIsCheckingOut(true);
            setHasError(false);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cartItems: cart.cartItems,
                    customer
                }),
            });

            if (!res.ok) {
                throw new Error("Checkout failed");
            }

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL received");
            }
        } catch (err) {
            console.error("[CHECKOUT_ERROR]", err);
            setHasError(true);
            toast.error("Failed to process checkout. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    // Show loading skeleton
    if (!isUserLoaded || !isCartLoaded) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-red-1 animate-spin mb-4" />
                <p className="text-gray-500">Loading your cart...</p>
            </div>
        );
    }

    // Show empty cart
    if (isCartLoaded && cart.cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet.</p>
                <Link
                    href="/"
                    className="bg-red-1 text-white py-3 px-8 rounded-md hover:bg-red-600 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">

                {/* Cart Items - Left Section */}
                <div className="lg:col-span-7">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                        <span className="text-sm text-gray-600">{cart.cartItems.length} {cart.cartItems.length === 1 ? 'Item' : 'Items'}</span>
                    </div>

                    <div className="border rounded-lg overflow-hidden shadow-sm">
                        {cart.cartItems.map((item) => (
                            <div key={`${item.item._id}-${item.color || 'default'}-${item.size || 'default'}`}
                                className="flex border-b last:border-b-0 p-4 hover:bg-gray-50 transition-colors">

                                {/* Product Image */}
                                <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                                    {item.item.media?.[0] ? (
                                        <Image
                                            src={item.item.media[0]}
                                            alt={item.item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="ml-4 flex-1">
                                    <h3 className="text-base font-medium text-gray-800 mb-1">
                                        {item.item.title}
                                    </h3>

                                    <div className="flex text-sm text-gray-500 mb-2">
                                        {item.color && (
                                            <div className="mr-4 flex items-center">
                                                <span className="mr-1">Color:</span>
                                                <span className="font-medium">{item.color}</span>
                                            </div>
                                        )}

                                        {item.size && (
                                            <div className="flex items-center">
                                                <span className="mr-1">Size:</span>
                                                <span className="font-medium">{item.size}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border rounded-md">
                                            <button
                                                onClick={() => cart.decreaseQuantity(item.item._id, item.color, item.size)}
                                                className="p-1 text-gray-500 hover:text-red-1 transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <MinusCircle className="h-5 w-5" />
                                            </button>

                                            <span className="px-2 py-1 min-w-[2rem] text-center">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => cart.increaseQuantity(item.item._id, item.color, item.size)}
                                                className="p-1 text-gray-500 hover:text-red-1 transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <PlusCircle className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="font-medium">
                                                {formatPrice(item.item.price * item.quantity)}
                                            </span>

                                            <button
                                                onClick={() => cart.removeItem(item.item._id, item.color, item.size)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Link
                            href="/"
                            className="inline-flex items-center text-gray-600 hover:text-red-1 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Order Summary - Right Section */}
                <div className="lg:col-span-5 mt-10 lg:mt-0">
                    <div className="bg-gray-50 rounded-lg border p-6 shadow-sm">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between text-base">
                                <p>Subtotal</p>
                                <p>{formatPrice(subtotal)}</p>
                            </div>

                            <div className="flex justify-between text-base">
                                <p>Shipping</p>
                                <p>{shipping === 0 ? "Free" : formatPrice(shipping)}</p>
                            </div>

                            <div className="flex justify-between text-base">
                                <p>Tax</p>
                                <p>{formatPrice(tax)}</p>
                            </div>

                            <div className="border-t pt-4 flex justify-between text-lg font-medium">
                                <p>Total</p>
                                <p>{formatPrice(total)}</p>
                            </div>
                        </div>

                        {shipping === 0 && (
                            <div className="mt-4 p-3 bg-green-50 rounded-md text-green-800 text-sm flex items-start">
                                <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
                                <p>You've qualified for free shipping!</p>
                            </div>
                        )}

                        {hasError && (
                            <div className="mt-4 p-3 bg-red-50 rounded-md text-red-800 text-sm flex items-start">
                                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                <p>There was an error during checkout. Please try again.</p>
                            </div>
                        )}

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut || cart.cartItems.length === 0}
                            className={`w-full mt-6 flex items-center justify-center py-3 px-4 rounded-md ${isCheckingOut || cart.cartItems.length === 0
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-red-1 hover:bg-red-600"
                                } text-white transition-colors`}
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Proceed to Checkout
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </>
                            )}
                        </button>

                        <div className="mt-4 text-center text-sm text-gray-500">
                            <p>We accept all major credit cards and PayPal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartClient; 