'use server';

import { cache } from 'react';
import { revalidateTag } from 'next/cache';

// Centralized error handling function
const handleFetchError = (operation: string, error: any) => {
  console.error(`[${operation}_ERROR]`, error);
  throw new Error(`Failed to fetch ${operation.toLowerCase()}`);
};

// Cache collections data with tags for revalidation
export const getCollections = cache(async () => {
  try {
    const collections = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
      cache: 'force-cache',
      next: { tags: ['collections'] }
    });
    
    if (!collections.ok) {
      throw new Error(`HTTP error! Status: ${collections.status}`);
    }
    
    return collections.json();
  } catch (error) {
    handleFetchError('COLLECTIONS', error);
  }
});

// Cache collection details with tags for revalidation
export const getCollectionDetails = cache(async (collectionId: string) => {
  try {
    const collection = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionId}`, {
      cache: 'force-cache',
      next: { tags: [`collection-${collectionId}`, 'collections'] }
    });
    
    if (!collection.ok) {
      throw new Error(`HTTP error! Status: ${collection.status}`);
    }
    
    return collection.json();
  } catch (error) {
    handleFetchError(`COLLECTION_${collectionId}`, error);
  }
});

// Cache products data with tags for revalidation
export const getProducts = cache(async () => {
  try {
    const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: 'force-cache',
      next: { tags: ['products'] }
    });
    
    if (!products.ok) {
      throw new Error(`HTTP error! Status: ${products.status}`);
    }
    
    return products.json();
  } catch (error) {
    handleFetchError('PRODUCTS', error);
  }
});

// Cache product details with tags for revalidation
export const getProductDetails = cache(async (productId: string) => {
  try {
    const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
      cache: 'force-cache',
      next: { tags: [`product-${productId}`, 'products'] }
    });
    
    if (!product.ok) {
      throw new Error(`HTTP error! Status: ${product.status}`);
    }
    
    return product.json();
  } catch (error) {
    handleFetchError(`PRODUCT_${productId}`, error);
  }
});

// Search products - no caching for search results
export const getSearchedProducts = async (query: string) => {
  try {
    const searchedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/${query}`, {
      cache: 'no-store' // Don't cache search results
    });
    
    if (!searchedProducts.ok) {
      throw new Error(`HTTP error! Status: ${searchedProducts.status}`);
    }
    
    return searchedProducts.json();
  } catch (error) {
    handleFetchError(`SEARCH_${query}`, error);
  }
};

// Cache orders with tags for revalidation
export const getOrders = cache(async (customerId: string) => {
  try {
    const orders = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/customers/${customerId}`, {
      cache: 'force-cache',
      next: { tags: [`orders-${customerId}`, 'orders'] }
    });
    
    if (!orders.ok) {
      throw new Error(`HTTP error! Status: ${orders.status}`);
    }
    
    return orders.json();
  } catch (error) {
    handleFetchError(`ORDERS_${customerId}`, error);
  }
});

// Cache related products with tags for revalidation
export const getRelatedProducts = cache(async (productId: string) => {
  try {
    const relatedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`, {
      cache: 'force-cache',
      next: { tags: [`related-${productId}`, 'products'] }
    });
    
    if (!relatedProducts.ok) {
      throw new Error(`HTTP error! Status: ${relatedProducts.status}`);
    }
    
    return relatedProducts.json();
  } catch (error) {
    handleFetchError(`RELATED_PRODUCTS_${productId}`, error);
  }
});

// Function to revalidate all product-related data
export async function revalidateProductsData() {
  revalidateTag('products');
}

// Function to revalidate all collection-related data
export async function revalidateCollectionsData() {
  revalidateTag('collections');
}

// Function to revalidate all order-related data
export async function revalidateOrdersData() {
  revalidateTag('orders');
}

// Function to revalidate specific product data
export async function revalidateProductData(productId: string) {
  revalidateTag(`product-${productId}`);
}

// Function to revalidate specific collection data
export async function revalidateCollectionData(collectionId: string) {
  revalidateTag(`collection-${collectionId}`);
}