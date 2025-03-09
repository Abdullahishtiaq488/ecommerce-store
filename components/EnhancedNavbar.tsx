"use client";

import useCart from "@/lib/hooks/useCart";
import { UserButton, useUser } from "@clerk/nextjs";
import {
    CircleUserRound,
    Menu,
    Search,
    ShoppingCart,
    X,
    Home,
    Heart,
    Package,
    Tag,
    Info,
    Phone,
    ChevronDown,
    ChevronRight,
    User,
    ShoppingBag
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { siteConfig } from "@/lib/config/site";

// Define the collection type for better type safety
interface NavbarProps {
    collections: CollectionType[];
}

const EnhancedNavbar: React.FC<NavbarProps> = ({ collections }) => {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const cart = useCart();

    const [dropdownMenu, setDropdownMenu] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
    const [expandedCollections, setExpandedCollections] = useState<boolean>(false);
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
                        className="px-4 py-2 bg-red-1 text-white rounded-md"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Sidebar with no overlay effect */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 bottom-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto ${dropdownMenu ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Sidebar Header with Logo and Close Button */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <Link href="/" onClick={() => setDropdownMenu(false)}>
                        <Image src="/logo.png" alt="logo" width={120} height={45} className="object-contain" />
                    </Link>
                    <button
                        onClick={toggleMenu}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* User Profile Section */}
                
                {/* Main Navigation */}
                <div className="p-5">
                    <Link
                        href="/"
                        className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors mb-2"
                        onClick={() => setDropdownMenu(false)}
                    >
                        <Home className="h-5 w-5 mr-3 text-gray-500" />
                        <span className="font-medium">Home</span>
                    </Link>

                    {/* Collections Dropdown */}
                    <div className="mb-2">
                        <button
                            className="w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={() => setExpandedCollections(!expandedCollections)}
                        >
                            <div className="flex items-center">
                                <ShoppingBag className="h-5 w-5 mr-3 text-gray-500" />
                                <span className="font-medium">Shop Collections</span>
                            </div>
                            {expandedCollections ? (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                        </button>

                        {expandedCollections && collections && collections.length > 0 && (
                            <div className="ml-8 mt-1 space-y-1 border-l-2  border-gray-100 pl-3">
                                {collections.map((collection) => (
                                    <Link
                                        key={collection._id}
                                        href={`/collections/${collection._id}`}
                                        className="flex items-center p-2 text-gray-600 hover:text-red-1 transition-colors"
                                        onClick={() => setDropdownMenu(false)}
                                    >
                                        <span>{collection.title}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-1 mb-4">
                        <Link
                            href="/wishlist"
                            className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={() => setDropdownMenu(false)}
                        >
                            <Heart className="h-5 w-5 mr-3 text-gray-500" />
                            <span>Wishlist</span>
                        </Link>

                        <Link
                            href="/cart"
                            className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={() => setDropdownMenu(false)}
                        >
                            <div className="flex items-center">
                                <ShoppingCart className="h-5 w-5 mr-3 text-gray-500" />
                                <span>Shopping Cart</span>
                            </div>
                            {cart.cartItems.length > 0 && (
                                <span className="bg-red-1 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.cartItems.length}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/sale"
                            className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={() => setDropdownMenu(false)}
                        >
                            <Tag className="h-5 w-5 mr-3 text-gray-500" />
                            <span>Sale</span>
                        </Link>
                    </div>
                </div>

                {/* Information Links */}
                <div className="p-5 border-t border-gray-100">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Information</h3>
                    <div className="space-y-1">
                        <Link
                            href="/about"
                            className="flex items-center p-2 text-gray-600 hover:text-red-1 transition-colors"
                            onClick={() => setDropdownMenu(false)}
                        >
                            <Info className="h-4 w-4 mr-3 text-gray-500" />
                            <span className="text-sm">About Us</span>
                        </Link>

                        <Link
                            href="/contact"
                            className="flex items-center p-2 text-gray-600 hover:text-red-1 transition-colors"
                            onClick={() => setDropdownMenu(false)}
                        >
                            <Phone className="h-4 w-4 mr-3 text-gray-500" />
                            <span className="text-sm">Contact Us</span>
                        </Link>

                        {siteConfig.navigation.customerService.map((link, index) => (
                            !['About Us', 'Contact Us'].includes(link.name) && (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="flex items-center p-2 text-gray-600 hover:text-red-1 transition-colors"
                                    onClick={() => setDropdownMenu(false)}
                                >
                                    <ChevronRight className="h-4 w-4 mr-3 text-gray-500" />
                                    <span className="text-sm">{link.name}</span>
                                </Link>
                            )
                        ))}
                    </div>
                </div>
                {isLoaded && user ? (
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                <UserButton afterSignOutUrl="/sign-in" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">{user.emailAddresses[0]?.emailAddress}</p>
                            </div>
                        </div>


                    </div>
                ) : (
                    <div className="p-5 border-b border-gray-100">
                        <Link
                            href="/sign-in"
                            className="flex items-center justify-center w-full p-2 bg-red-1 text-white rounded-md hover:bg-red-600 transition-colors"
                            onClick={() => setDropdownMenu(false)}
                        >
                            <User className="h-4 w-4 mr-2" />
                            Sign In / Register
                        </Link>
                    </div>
                )}

            </div>

            {/* Subtle backdrop blur with light tinting */}
            {dropdownMenu && (
                <div
                    className="fixed inset-0 backdrop-blur-[2px] z-20 transition-all duration-300"
                    onClick={toggleMenu}
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                ></div>
            )}
        </>
    );
};

export default EnhancedNavbar; 