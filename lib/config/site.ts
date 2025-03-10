/**
 * Site configuration
 * This file contains centralized configuration for the site
 */

export const siteConfig = {
  name: "Fashion Store",
  description: "Premium Fashion Store - Discover the latest trends in clothing and accessories",
  url: "https://fashionstore.com",
  ogImage: "https://fashionstore.com/og-image.jpg",
  
  // Contact information
  contact: {
    address: "123 Fashion Street, Style Avenue, New York, NY 10001",
    phone: "+1 (234) 567-8900",
    email: "info@fashionstore.com",
    hours: {
      weekdays: "Monday - Friday: 9AM - 8PM",
      weekend: "Saturday - Sunday: 10AM - 6PM"
    }
  },
  
  // Social media links
  social: {
    instagram: "https://instagram.com/fashionstore",
    facebook: "https://facebook.com/fashionstore",
    twitter: "https://twitter.com/fashionstore",
    youtube: "https://youtube.com/fashionstore"
  },
  
  // Navigation links
  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "Wishlist", href: "/wishlist" },
      { name: "Orders", href: "/orders" },
      { name: "Sale", href: "/sale" },
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" }
    ],
    customerService: [
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Shipping & Returns", href: "/shipping" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Conditions", href: "/terms" }
    ]
  }
}; 