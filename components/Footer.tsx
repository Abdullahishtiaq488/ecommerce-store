"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Mail,
    Phone,
    MapPin,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    Send,
    Clock,
    ChevronRight
} from 'lucide-react';
import bgImage from '../public/vintage-collection.jpg';
import { siteConfig } from '@/lib/config/site';

interface FooterProps {
    collections: CollectionType[];
}

const Footer = ({ collections }: FooterProps) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={bgImage}
                    alt="Footer Background"
                    fill
                    priority
                    quality={100}
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/90"></div>
            </div>

            {/* Newsletter Section */}
            <div className="relative z-10 border-b border-gray-800">
                <div className="container mx-auto px-6 py-14 md:py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-heading3-bold md:text-heading2-bold mb-3 text-white tracking-tight">
                            Join Our Community
                        </h2>
                        <p className="text-base-medium md:text-body-medium text-grey-2 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                            Subscribe to receive exclusive offers, early access to new collections, and style inspiration delivered to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                            <div className="relative w-full">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full px-4 py-3 rounded-md bg-white/5 backdrop-blur-sm border border-gray-700 text-white placeholder-grey-2 focus:outline-none focus:border-red-1 transition-all"
                                />
                            </div>
                            <button className="w-full sm:w-auto px-6 py-3 bg-red-1 text-white hover:bg-red-600 rounded-md font-medium flex items-center justify-center gap-2 transition-all">
                                Subscribe <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="relative z-10">
                <div className="container mx-auto px-6 py-14 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                        {/* Column 1: About */}
                        <div>
                            <div className="mb-6 md:mb-8">
                                <Image
                                    src="/logo.png"
                                    alt="Store Logo"
                                    width={150}
                                    height={60}
                                    className="object-contain bg-white p-2 rounded-md"
                                />
                            </div>
                            <p className="text-small-medium md:text-base-medium text-grey-1 mb-6 leading-relaxed">
                                Discover the perfect blend of style and comfort with our curated collection of premium garments. We believe fashion should be an expression of your unique personality.
                            </p>
                            <div className="flex space-x-4">
                                <a href={siteConfig.social.instagram} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-1 transition-all" aria-label="Instagram">
                                    <Instagram size={16} className="text-white" />
                                </a>
                                <a href={siteConfig.social.facebook} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-1 transition-all" aria-label="Facebook">
                                    <Facebook size={16} className="text-white" />
                                </a>
                                <a href={siteConfig.social.twitter} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-1 transition-all" aria-label="Twitter">
                                    <Twitter size={16} className="text-white" />
                                </a>
                                <a href={siteConfig.social.youtube} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-1 transition-all" aria-label="YouTube">
                                    <Youtube size={16} className="text-white" />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Shop */}
                        <div>
                            <h3 className="text-heading4-bold mb-4 md:mb-5 text-white tracking-tight">
                                Shop Collections
                            </h3>
                            <ul className="space-y-2.5">
                                {collections && collections.length > 0 ? (
                                    collections.map((collection) => (
                                        <li key={collection._id}>
                                            <Link href={`/collections/${collection._id}`} className="text-grey-1 hover:text-white flex items-center group">
                                                <ChevronRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-red-1" />
                                                <span className="text-small-medium border-b border-transparent group-hover:border-red-1 pb-0.5 transition-all">{collection.title}</span>
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <li>
                                        <span className="text-grey-1 text-small-medium">No collections available</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Column 3: Quick Links */}
                        <div>
                            <h3 className="text-heading4-bold mb-4 md:mb-5 text-white tracking-tight">
                                Customer Service
                            </h3>
                            <ul className="space-y-2.5">
                                {siteConfig.navigation.customerService.map((link, index) => (
                                    <li key={index}>
                                        <Link href={link.href} className="text-grey-1 hover:text-white flex items-center group">
                                            <ChevronRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-red-1" />
                                            <span className="text-small-medium border-b border-transparent group-hover:border-red-1 pb-0.5 transition-all">{link.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Contact */}
                        <div>
                            <h3 className="text-heading4-bold mb-4 md:mb-5 text-white tracking-tight">
                                Contact Us
                            </h3>
                            <ul className="space-y-3.5">
                                <li className="flex items-start">
                                    <MapPin className="mr-3 text-red-1 flex-shrink-0 mt-0.5" size={16} />
                                    <span className="text-grey-1 text-small-medium">
                                        {siteConfig.contact.address}
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <Phone className="mr-3 text-red-1 flex-shrink-0" size={16} />
                                    <a href={`tel:${siteConfig.contact.phone}`} className="text-grey-1 hover:text-white text-small-medium border-b border-transparent hover:border-red-1 transition-all">
                                        {siteConfig.contact.phone}
                                    </a>
                                </li>
                                <li className="flex items-center">
                                    <Mail className="mr-3 text-red-1 flex-shrink-0" size={16} />
                                    <a href={`mailto:${siteConfig.contact.email}`} className="text-grey-1 hover:text-white text-small-medium border-b border-transparent hover:border-red-1 transition-all">
                                        {siteConfig.contact.email}
                                    </a>
                                </li>
                                <li className="flex items-start">
                                    <Clock className="mr-3 text-red-1 flex-shrink-0 mt-0.5" size={16} />
                                    <div className="text-grey-1 text-small-medium">
                                        <p className="mb-1">{siteConfig.contact.hours.weekdays}</p>
                                        <p>{siteConfig.contact.hours.weekend}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 border-t border-gray-800">
                <div className="container mx-auto px-6 py-5">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-3 md:mb-0 flex items-center">
                            <p className="text-grey-2 text-small-medium">
                                We accept
                            </p>
                            <div className="flex space-x-2 ml-3">
                                <div className="w-8 h-5 md:w-10 md:h-6 bg-white/10 rounded"></div>
                                <div className="w-8 h-5 md:w-10 md:h-6 bg-white/10 rounded"></div>
                                <div className="w-8 h-5 md:w-10 md:h-6 bg-white/10 rounded"></div>
                                <div className="w-8 h-5 md:w-10 md:h-6 bg-white/10 rounded"></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-grey-2 text-small-medium text-center md:text-right">
                                &copy; {currentYear} {siteConfig.name}. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 