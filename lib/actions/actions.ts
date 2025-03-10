'use server';

import { cache } from 'react';
import { revalidateTag } from 'next/cache';

// Centralized error handling function with more detailed logging
const handleFetchError = (operation: string, error: any) => {
  console.error(`[${operation}_ERROR]`, error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  throw new Error(`Failed to fetch ${operation.toLowerCase()}: ${errorMessage}`);
};

/**
 * Get all collections with proper caching and error handling
 */
export const getCollections = cache(async () => {
  try {
    const collections = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
      cache: 'force-cache',
      next: { 
        tags: ['collections'],
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!collections.ok) {
      throw new Error(`HTTP error! Status: ${collections.status}`);
    }
    
    return collections.json();
  } catch (error) {
    handleFetchError('COLLECTIONS', error);
  }
});

/**
 * Get collection details by ID with proper caching and error handling
 */
export const getCollectionDetails = cache(async (collectionId: string) => {
  try {
    if (!collectionId) {
      throw new Error('Collection ID is required');
    }

    const collection = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionId}`, {
      cache: 'force-cache',
      next: { 
        tags: [`collection-${collectionId}`, 'collections'],
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!collection.ok) {
      throw new Error(`HTTP error! Status: ${collection.status}`);
    }
    
    return collection.json();
  } catch (error) {
    handleFetchError(`COLLECTION_${collectionId}`, error);
  }
});

/**
 * Get all products with proper caching and error handling
 */
export const getProducts = cache(async () => {
  try {
    const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: 'force-cache',
      next: { 
        tags: ['products'],
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!products.ok) {
      throw new Error(`HTTP error! Status: ${products.status}`);
    }
    
    return products.json();
  } catch (error) {
    handleFetchError('PRODUCTS', error);
  }
});

/**
 * Get product details by ID with proper caching and error handling
 */
export const getProductDetails = cache(async (productId: string) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
      cache: 'force-cache',
      next: { 
        tags: [`product-${productId}`, 'products'],
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!product.ok) {
      throw new Error(`HTTP error! Status: ${product.status}`);
    }
    
    return product.json();
  } catch (error) {
    handleFetchError(`PRODUCT_${productId}`, error);
    return null; // Return null to allow graceful handling in components
  }
});

/**
 * Search products - no caching for search results
 */
export const getSearchedProducts = async (query: string) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    const searchedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/${encodeURIComponent(query)}`, {
      cache: 'no-store' // Don't cache search results
    });
    
    if (!searchedProducts.ok) {
      throw new Error(`HTTP error! Status: ${searchedProducts.status}`);
    }
    
    return searchedProducts.json();
  } catch (error) {
    handleFetchError(`SEARCH_${query}`, error);
    return []; // Return empty array to allow graceful handling in components
  }
};

/**
 * Get orders by customer ID with proper caching and error handling
 */
export const getOrders = cache(async (customerId: string) => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    const orders = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/customers/${customerId}`, {
      cache: 'force-cache',
      next: { 
        tags: [`orders-${customerId}`, 'orders'],
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!orders.ok) {
      throw new Error(`HTTP error! Status: ${orders.status}`);
    }
    
    return orders.json();
  } catch (error) {
    handleFetchError(`ORDERS_${customerId}`, error);
    return []; // Return empty array to allow graceful handling in components
  }
});

/**
 * Get related products by product ID with proper caching and error handling
 */
export const getRelatedProducts = cache(async (productId: string) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const relatedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`, {
      cache: 'force-cache',
      next: { 
        tags: [`related-${productId}`, 'products'],
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!relatedProducts.ok) {
      throw new Error(`HTTP error! Status: ${relatedProducts.status}`);
    }
    
    return relatedProducts.json();
  } catch (error) {
    handleFetchError(`RELATED_PRODUCTS_${productId}`, error);
    return []; // Return empty array to allow graceful handling in components
  }
});

/**
 * Revalidation functions for different data types
 */
export async function revalidateProductsData() {
  revalidateTag('products');
}

export async function revalidateCollectionsData() {
  revalidateTag('collections');
}

export async function revalidateOrdersData() {
  revalidateTag('orders');
}

export async function revalidateProductData(productId: string) {
  revalidateTag(`product-${productId}`);
}

export async function revalidateCollectionData(collectionId: string) {
  revalidateTag(`collection-${collectionId}`);
}

export async function revalidateUserData() {
  revalidateTag('userData');
}