"use client";

import ProductCard from "./ProductCard";

interface SearchResultsProps {
    products: ProductType[];
    query: string;
}

const SearchResults = ({ products, query }: SearchResultsProps) => {
    return (
        <div className="px-10 py-5">
            <p className="text-heading3-bold my-10">Search results for {query}</p>

            {(!products || products.length === 0) && (
                <p className="text-center text-gray-500 my-10">No products found matching your search</p>
            )}

            <div className="flex flex-wrap justify-center gap-16">
                {products.map((product: ProductType) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default SearchResults; 