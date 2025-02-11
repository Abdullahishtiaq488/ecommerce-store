import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";
import Carousel from "@/components/Carousel";

import Image from "next/image";

export default function Home() {
  return (
    <>
      <Carousel />
      <Collections />
      <ProductList />
    </>
  );
}

export const dynamic = "force-dynamic";

