"use client";

import useCart from "@/lib/hooks/useCart";
import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Menu, Search, ShoppingCart, X, Home, Heart, Package, Tag, Info, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

// Define the category type for better type safety
interface Category {
  name: string;
  href: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const cart = useCart();

  const [dropdownMenu, setDropdownMenu] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search/${query}`);
      setShowSearchInput(false);
    }
  };

  const toggleMenu = () => {
    setDropdownMenu(!dropdownMenu);
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    // Focus the input when it appears
    if (!showSearchInput) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Handle search on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setDropdownMenu(false);
      }
    };

    if (dropdownMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownMenu]);

  // Categories for the sidebar menu
  const categories: Category[] = [
    { name: "Men's Clothing", href: "/collections/mens-clothing" },
    { name: "Women's Clothing", href: "/collections/womens-clothing" },
    { name: "Accessories", href: "/collections/accessories" },
    { name: "Footwear", href: "/collections/footwear" },
    { name: "New Arrivals", href: "/collections/new-arrivals" },
    { name: "Sale", href: "/collections/sale" },
  ];

  return (
    <>
      <div className="sticky top-0 h-16 md:h-[60px] z-20 py-2 px-4 flex items-center bg-white shadow-md">
        {/* Left: Menu Button */}
        <div className="flex items-center">
          <Menu className="cursor-pointer h-6 w-6" onClick={toggleMenu} />
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={130} height={50} className="object-contain" />
          </Link>
        </div>

        {/* Right: Search, Cart, User */}
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <button onClick={toggleSearchInput} className="cursor-pointer">
            <Search className="h-5 w-5 hover:text-red-1" />
          </button>

          {/* Cart Icon with Badge */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cart.cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center">
                {cart.cartItems.length}
              </span>
            )}
          </Link>

          {/* Fixed width container for user button to prevent layout shift */}
          <div className="w-8 h-8 flex items-center justify-center">
            {isLoaded ? (
              user ? (
                <UserButton afterSignOutUrl="/sign-in" />
              ) : (
                <Link href="/sign-in">
                  <CircleUserRound className="h-5 w-5" />
                </Link>
              )
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse"></div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Input (Slide Down) */}
      <div
        className={`w-full bg-white shadow-md transition-all duration-300 overflow-hidden ${showSearchInput ? 'max-h-16 py-2 px-4' : 'max-h-0 py-0 px-4'
          }`}
      >
        <div className="flex items-center gap-2">
          <input
            ref={searchInputRef}
            className="flex-1 outline-hidden px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search products..."
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className="bg-black text-white px-4 py-2 rounded-md disabled:bg-gray-400"
          >
            Search
          </button>
          <button onClick={toggleSearchInput} className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Improved Sliding Menu */}
      <div
        className={`fixed top-0 left-0 z-30 h-full bg-white shadow-xl transform ${dropdownMenu ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out w-[280px] sm:w-[320px] overflow-y-auto`}
        ref={sidebarRef}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            {isLoaded && user ? (
              <>
                <div className="w-8 h-8">
                  <UserButton afterSignOutUrl="/sign-in" />
                </div>
                <div className="text-sm font-medium">
                  {user.firstName ? `Hi, ${user.firstName}` : 'Welcome'}
                </div>
              </>
            ) : (
              <Link href="/sign-in" className="flex items-center gap-2 text-sm font-medium" onClick={toggleMenu}>
                <CircleUserRound className="h-5 w-5" />
                Sign In / Register
              </Link>
            )}
          </div>
          <X
            className="cursor-pointer h-6 w-6 transform transition duration-300 ease-in-out hover:rotate-90"
            onClick={toggleMenu}
          />
        </div>

        {/* Menu Content */}
        <div className="p-4">
          {/* Quick Links */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Links</h3>
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                onClick={toggleMenu}
              >
                <Home className="h-4 w-4" />
                <span className="text-sm">Home</span>
              </Link>
              <Link
                href={user ? "/wishlist" : "/sign-in"}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                onClick={toggleMenu}
              >
                <Heart className="h-4 w-4" />
                <span className="text-sm">Wishlist</span>
              </Link>
              <Link
                href={user ? "/orders" : "/sign-in"}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                onClick={toggleMenu}
              >
                <Package className="h-4 w-4" />
                <span className="text-sm">Orders</span>
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                onClick={toggleMenu}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="text-sm">Cart ({cart.cartItems.length})</span>
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Shop By Category</h3>
            <div className="flex flex-col space-y-1">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Info Links */}
          <div className="border-t pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Information</h3>
            <div className="flex flex-col space-y-1">
              <Link
                href="/about"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                onClick={toggleMenu}
              >
                <Info className="h-4 w-4" />
                <span className="text-sm">About Us</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                onClick={toggleMenu}
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;