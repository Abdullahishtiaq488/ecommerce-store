"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { ProductType } from "@/types";

interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartStore {
  cartItems: CartItem[];
  
  // Methods
  setCartItems: (items: CartItem[]) => void;
  addItem: (data: CartItem) => void;
  removeItem: (id: string, color?: string, size?: string) => void;
  increaseQuantity: (id: string, color?: string, size?: string) => void;
  decreaseQuantity: (id: string, color?: string, size?: string) => void;
  clearCart: () => void;
}

// Helper to check if a product is valid
const isValidProduct = (product: any): product is ProductType => {
  return product && typeof product === 'object' && typeof product._id === 'string';
};

// Helper to check if a cart item is valid
const isValidCartItem = (item: any): item is CartItem => {
  return (
    item && 
    typeof item === 'object' && 
    typeof item.quantity === 'number' && 
    item.quantity > 0 &&
    isValidProduct(item.item)
  );
};

// Helper to check if two cart items are the same variant (same product, color and size)
const isSameVariant = (item1: CartItem, item2: CartItem): boolean => {
  return (
    item1.item._id === item2.item._id &&
    item1.color === item2.color &&
    item1.size === item2.size
  );
};

// Find a cart item by id, color and size
const findCartItem = (
  items: CartItem[], 
  id: string, 
  color?: string, 
  size?: string
): CartItem | undefined => {
  return items.find(item => 
    item.item._id === id && 
    item.color === color && 
    item.size === size
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
            ? items.filter(isValidCartItem)
            : [];
          
          set({ cartItems: validItems });
        } catch (error) {
          console.error("[SET_CART_ITEMS_ERROR]", error);
          set({ cartItems: [] });
        }
      },
      
      addItem: (data) => {
        try {
          if (!isValidCartItem(data)) {
            throw new Error("Invalid cart item");
          }
          
          const currentItems = get().cartItems;
          const existingItem = currentItems.find(item => isSameVariant(item, data));
          
          if (existingItem) {
            // If item already exists, increase quantity
            return set({
              cartItems: currentItems.map(item => 
                isSameVariant(item, data)
                  ? { ...item, quantity: item.quantity + data.quantity }
                  : item
              )
            });
          }
          
          // If item doesn't exist, add it
          set({ cartItems: [...currentItems, data] });
          toast.success("Item added to cart");
        } catch (error) {
          console.error("[ADD_CART_ITEM_ERROR]", error);
          toast.error("Failed to add item to cart");
        }
      },
      
      removeItem: (id, color, size) => {
        try {
          const currentItems = get().cartItems;
          set({ 
            cartItems: currentItems.filter(item => 
              !(item.item._id === id && 
                item.color === color && 
                item.size === size)
            ) 
          });
          toast.success("Item removed from cart");
        } catch (error) {
          console.error("[REMOVE_CART_ITEM_ERROR]", error);
          toast.error("Failed to remove item from cart");
        }
      },
      
      increaseQuantity: (id, color, size) => {
        try {
          const currentItems = get().cartItems;
          const itemToUpdate = findCartItem(currentItems, id, color, size);
          
          if (!itemToUpdate) {
            throw new Error("Item not found in cart");
          }
          
          set({
            cartItems: currentItems.map(item => 
              item === itemToUpdate
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } catch (error) {
          console.error("[INCREASE_QUANTITY_ERROR]", error);
          toast.error("Failed to update quantity");
        }
      },
      
      decreaseQuantity: (id, color, size) => {
        try {
          const currentItems = get().cartItems;
          const itemToUpdate = findCartItem(currentItems, id, color, size);
          
          if (!itemToUpdate) {
            throw new Error("Item not found in cart");
          }
          
          if (itemToUpdate.quantity === 1) {
            // If quantity is 1, remove the item
            return get().removeItem(id, color, size);
          }
          
          // Otherwise decrease quantity
          set({
            cartItems: currentItems.map(item => 
              item === itemToUpdate
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          });
        } catch (error) {
          console.error("[DECREASE_QUANTITY_ERROR]", error);
          toast.error("Failed to update quantity");
        }
      },
      
      clearCart: () => {
        try {
          set({ cartItems: [] });
          toast.success("Cart cleared");
        } catch (error) {
          console.error("[CLEAR_CART_ERROR]", error);
          toast.error("Failed to clear cart");
        }
      },
    }),
    {
      name: "cart-storage",
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
    }
  )
);

export default useCart; 