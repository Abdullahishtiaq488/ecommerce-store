"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";

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
          // Filter out invalid items
          const validItems = Array.isArray(items) 
            ? items.filter(item => isValidCartItem(item))
            : [];
            
          set({ cartItems: validItems });
        } catch (error) {
          console.error('[CART_SET_ITEMS_ERROR]', error);
          set({ cartItems: [] });
        }
      },
      
      addItem: (data) => {
        try {
          if (!isValidCartItem(data)) {
            console.error('[CART_ADD_ITEM_ERROR] Invalid cart item', data);
            return;
          }
          
          const currentItems = get().cartItems;
          
          // Check if the item already exists in the cart
          const existingItemIndex = currentItems.findIndex(item => 
            isSameVariant(item, data)
          );
          
          if (existingItemIndex !== -1) {
            // If item exists, increase quantity
            const updatedItems = [...currentItems];
            updatedItems[existingItemIndex].quantity += data.quantity;
            set({ cartItems: updatedItems });
            toast.success('Item quantity updated in cart');
          } else {
            // If item doesn't exist, add it
            set({ cartItems: [...currentItems, data] });
            toast.success('Item added to cart');
          }
        } catch (error) {
          console.error('[CART_ADD_ITEM_ERROR]', error);
          toast.error('Failed to add item to cart');
        }
      },
      
      removeItem: (id, color, size) => {
        try {
          if (!id) return;
          
          const currentItems = get().cartItems;
          const updatedItems = currentItems.filter(item => 
            !(item.item._id === id && item.color === color && item.size === size)
          );
          
          set({ cartItems: updatedItems });
          toast.success('Item removed from cart');
        } catch (error) {
          console.error('[CART_REMOVE_ITEM_ERROR]', error);
          toast.error('Failed to remove item from cart');
        }
      },
      
      increaseQuantity: (id, color, size) => {
        try {
          if (!id) return;
          
          const currentItems = get().cartItems;
          const itemIndex = currentItems.findIndex(item => 
            item.item._id === id && item.color === color && item.size === size
          );
          
          if (itemIndex !== -1) {
            const updatedItems = [...currentItems];
            updatedItems[itemIndex].quantity += 1;
            set({ cartItems: updatedItems });
          }
        } catch (error) {
          console.error('[CART_INCREASE_QUANTITY_ERROR]', error);
        }
      },
      
      decreaseQuantity: (id, color, size) => {
        try {
          if (!id) return;
          
          const currentItems = get().cartItems;
          const itemIndex = currentItems.findIndex(item => 
            item.item._id === id && item.color === color && item.size === size
          );
          
          if (itemIndex !== -1) {
            const updatedItems = [...currentItems];
            
            if (updatedItems[itemIndex].quantity === 1) {
              // If quantity is 1, remove the item
              updatedItems.splice(itemIndex, 1);
              toast.success('Item removed from cart');
            } else {
              // Otherwise decrease quantity
              updatedItems[itemIndex].quantity -= 1;
            }
            
            set({ cartItems: updatedItems });
          }
        } catch (error) {
          console.error('[CART_DECREASE_QUANTITY_ERROR]', error);
        }
      },
      
      clearCart: () => {
        try {
          set({ cartItems: [] });
          toast.success('Cart cleared');
        } catch (error) {
          console.error('[CART_CLEAR_ERROR]', error);
        }
      },
    }),
    {
      name: 'shopping-cart',
      skipHydration: true,
    }
  )
);

export default useCart; 