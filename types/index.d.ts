// Product Type Definition
export interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
  cost?: number;
  discountedPrice?: number;
  category: string;
  subcategory?: string;
  collections?: string[];
  tags?: string[];
  media: string[];
  sizes?: string[];
  colors: string[];
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

// User Type Definition
export interface UserType {
  _id: string;
  clerkId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  wishlist: string[];
  orders?: string[];
  addresses?: {
    id: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

// Cart Item Type Definition
interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string;
  size?: string;
}

// Collection Type Definition
interface CollectionType {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  products?: string[];
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Order Type Definition
interface OrderType {
  _id: string;
  userId: string;
  orderNumber: string;
  items: {
    productId: string;
    title: string;
    color?: string;
    size?: string;
    price: number;
    quantity: number;
    subtotal: number;
    sku?: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: {
    type: string;
    last4?: string;
  };
  trackingNumber?: string;
  trackingURL?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 