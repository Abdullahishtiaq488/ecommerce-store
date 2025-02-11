"use client";

import useCart from "@/lib/hooks/useCart";
import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Menu, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();

  const [dropdownMenu, setDropdownMenu] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");


  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search/${query}`);
    }
  };

  const toggleMenu = () => {
    setDropdownMenu(!dropdownMenu);
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

  return (
    <>
      <div className="sticky top-0 md:h-[60px] z-20 py-2 px-4 flex justify-between items-center bg-white shadow-md">
        {/* Toggle Menu Button */}
        <Menu className="cursor-pointer h-6 w-6" onClick={toggleMenu} />

        {/* Centered Logo */}
        <Link href="/" className="flex-grow text-center">
          <Image src="/logo.png" alt="logo" width={130} height={100} className="mx-auto" />
        </Link>

        <div className="relative flex gap-5 items-center">
          {/* Search Bar with HoverCard */}
          <HoverCard>
            <HoverCardTrigger className="cursor-pointer">
              <Search className="h-6 w-6 hover:text-red-1" />
            </HoverCardTrigger>
            <HoverCardContent className="p-3 bg-white border border-gray-200 shadow-lg rounded-lg">
              <div className="flex gap-2 items-center">
                <input
                  className="outline-none w-full max-w-[200px] px-2 py-1 border border-gray-300 rounded-md"
                  placeholder="Search..."
                  value={query}
                  onChange={handleSearchChange}
                />
                <button disabled={!query.trim()} onClick={handleSearch}>
                  <Search className="cursor-pointer h-5 w-5 hover:text-red-1" />
                </button>
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* Cart Icon with Badge */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 text-[11px] font-bold bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center">
              {cart.cartItems.length}
            </span>
          </Link>

          {user ? (
            <UserButton afterSignOutUrl="/sign-in" />
          ) : (
            <Link href="/sign-in">
              <CircleUserRound />
            </Link>
          )}
        </div>
      </div>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 left-0 z-30 h-full bg-white shadow-md transform ${dropdownMenu ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out w-1/4`}
        ref={sidebarRef}
      >
        <div className="flex justify-end p-4">
          <X className="cursor-pointer h-6 w-6 transform transition duration-300 ease-in-out hover:rotate-90" onClick={toggleMenu} />
        </div>
        <div className="flex flex-col items-start gap-2 p-6 uppercase">
          <Link href="/" className="hover:text-red-1" onClick={toggleMenu}>
            Home
          </Link>
          <hr className="border-t-2 my-2 border-black w-full" />

          <Link href={user ? "/wishlist" : "/sign-in"} className="hover:text-red-1" onClick={toggleMenu}>
            Wishlist
          </Link>
          
          <Link href={user ? "/orders" : "/sign-in"} className="hover:text-red-1" onClick={toggleMenu}>
            Orders
          </Link>
          <Link href="/cart" className="hover:text-red-1" onClick={toggleMenu}>
            Cart ({cart.cartItems.length})
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;