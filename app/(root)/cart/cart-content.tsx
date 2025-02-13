// app/(root)/cart/cart-content.tsx
"use client";

import useCart from "@/lib/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import { MinusCircle, PlusCircle, Trash } from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FC } from 'react';

interface CartItem {
  item: {
    _id: string;
    title: string;
    price: number;
    media: string[];
  };
  quantity: number;
  color?: string;
  size?: string;
}

const CartContent: FC = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const cart = useCart();

  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  const totalRounded = parseFloat(total.toFixed(2));

  const customer = user ? {
    clerkId: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: user.fullName,
  } : null;

  const handleCheckout = async () => {
    try {
      if (!user) {
        router.push("/sign-in");
        return;
      }

      if (!customer?.email) {
        console.error("User email not available");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cartItems: cart.cartItems, 
          customer 
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL received");
      }
    } catch (err) {
      console.error("[checkout_POST]", err);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-body-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
      <div className="w-2/3 max-lg:w-full">
        <p className="text-heading3-bold">Shopping Cart</p>
        <hr className="my-6" />

        {cart.cartItems.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-body-bold">Your cart is empty</p>
            <button
              onClick={() => router.push("/")}
              className="border rounded-lg text-body-bold bg-black text-white py-3 px-6 hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            {cart.cartItems.map((cartItem, index) => (
              <div 
                key={`${cartItem.item._id}-${index}`} 
                className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
              >
                <div className="flex items-center">
                  <Image
                    src={cartItem.item.media[0] || "/placeholder.svg"}
                    width={100}
                    height={100}
                    className="rounded-lg w-32 h-32 object-cover"
                    alt={cartItem.item.title}
                  />
                  <div className="flex flex-col gap-3 ml-4">
                    <p className="text-body-bold">{cartItem.item.title}</p>
                    {cartItem.color && (
                      <p className="text-small-medium">Color: {cartItem.color}</p>
                    )}
                    {cartItem.size && (
                      <p className="text-small-medium">Size: {cartItem.size}</p>
                    )}
                    <p className="text-small-medium">
                      ${cartItem.item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <button
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                    aria-label="Decrease quantity"
                  >
                    <MinusCircle />
                  </button>
                  <p className="text-body-bold">{cartItem.quantity}</p>
                  <button
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.increaseQuantity(cartItem.item._id)}
                    aria-label="Increase quantity"
                  >
                    <PlusCircle />
                  </button>
                </div>

                <button
                  className="hover:text-red-1 cursor-pointer"
                  onClick={() => cart.removeItem(cartItem.item._id)}
                  aria-label="Remove item"
                >
                  <Trash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5 h-fit">
        <p className="text-heading4-bold pb-4">
          Summary{" "}
          <span>{`(${cart.cartItems.length} ${
            cart.cartItems.length === 1 ? "item" : "items"
          })`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span>${totalRounded.toFixed(2)}</span>
        </div>
        <button
          className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCheckout}
          disabled={cart.cartItems.length === 0}
        >
          {user ? "Proceed to Checkout" : "Sign in to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default CartContent;