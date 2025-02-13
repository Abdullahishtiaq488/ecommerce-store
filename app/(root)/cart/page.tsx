// app/(root)/cart/page.tsx
"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

// Create a loading component
const LoadingCart: FC = () => (
  <div className="flex justify-center items-center min-h-screen">
    <p className="text-body-bold">Loading cart...</p>
  </div>
);

// Use dynamic import with proper type assertion
const CartContent = dynamic(
  () => import('./cart-content'),
  {
    loading: () => <LoadingCart />,
    ssr: false
  }
);

const CartPage: FC = () => {
  return <CartContent />;
};

export default CartPage;