// app/(root)/cart/loading.tsx
import type { FC } from 'react';

const Loading: FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-body-bold">Loading cart...</p>
    </div>
  );
};

export default Loading;