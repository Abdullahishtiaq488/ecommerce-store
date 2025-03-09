"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  addItem: (item: ProductType, color?: string, size?: string) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
}

// Helper function to validate product item
const isValidProduct = (item: any): item is ProductType => {
  return (
    item &&
    typeof item === 'object' &&
    typeof item._id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.price === 'number'
  );
};

// Helper function to validate cart item
const isValidCartItem = (item: any): item is CartItem => {
  return (
    item &&
    typeof item === 'object' &&
    isValidProduct(item.item) &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );
};

const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      setCartItems: (items) => {
        try {
          // Validate and filter items
          const validItems = Array.isArray(items) 
            ? items.filter(item => isValidCartItem(item))
            : [];
            
          set({ cartItems: validItems });
        } catch (error) {
          console.error("Error in setCartItems:", error);
          // Fallback to empty array if there's an error
          set({ cartItems: [] });
        }
      },
      
      addItem: (item, color, size) => {
        try {
          if (!isValidProduct(item)) {
            console.error("Invalid product:", item);
            return;
          }
          
          const { cartItems } = get();
          
          // Check if the item is already in the cart with the same color and size
          const existingItemIndex = cartItems.findIndex(
            (cartItem) => 
              cartItem.item._id === item._id && 
              cartItem.color === color &&
              cartItem.size === size
          );
          
          if (existingItemIndex !== -1) {
            // If the item exists, increase its quantity
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity += 1;
            set({ cartItems: updatedCartItems });
          } else {
            // If the item doesn't exist, add it to the cart
            set({ 
              cartItems: [
                ...cartItems, 
                { item, quantity: 1, color, size }
              ] 
            });
          }
        } catch (error) {
          console.error("Error in addItem:", error);
        }
      },
      
      removeItem: (id) => {
        try {
          if (!id || typeof id !== 'string') {
            console.error("Invalid ID for removeItem:", id);
            return;
          }
          
          const { cartItems } = get();
          set({
            cartItems: cartItems.filter((item) => item.item._id !== id),
          });
        } catch (error) {
          console.error("Error in removeItem:", error);
        }
      },
      
      increaseQuantity: (id) => {
        try {
          if (!id || typeof id !== 'string') {
            console.error("Invalid ID for increaseQuantity:", id);
            return;
          }
          
          const { cartItems } = get();
          
          const updatedCartItems = cartItems.map((item) => {
            if (item.item._id === id) {
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          });
          
          set({ cartItems: updatedCartItems });
        } catch (error) {
          console.error("Error in increaseQuantity:", error);
        }
      },
      
      decreaseQuantity: (id) => {
        try {
          if (!id || typeof id !== 'string') {
            console.error("Invalid ID for decreaseQuantity:", id);
            return;
          }
          
          const { cartItems } = get();
          
          const updatedCartItems = cartItems.map((item) => {
            if (item.item._id === id) {
              return { 
                ...item, 
                quantity: item.quantity > 1 ? item.quantity - 1 : 1 
              };
            }
            return item;
          });
          
          set({ cartItems: updatedCartItems });
        } catch (error) {
          console.error("Error in decreaseQuantity:", error);
        }
      },
      
      clearCart: () => {
        try {
          set({ cartItems: [] });
        } catch (error) {
          console.error("Error in clearCart:", error);
        }
      },
    }),
    {
      name: "cart-storage", // Name for the persistance store
    }
  )
);

export default useCart; 