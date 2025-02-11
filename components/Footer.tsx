import React from 'react';
import Image from 'next/image';
import bgImage from '../public/surprised-women.jpg';

const Footer = () => {
    return (

        <footer className="relative text-white h-auto mt-2" id='footer'>

            <div className="absolute inset-0">
                <Image
                    src={bgImage}
                    alt="Footer Background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="z-12"
                />
                <div className="absolute inset-0 bg-black opacity-80"></div> {/* Black Gradient Overlay */}
            </div>

            <div className="relative z-10 p-8">
                {/* First Row - Single Column */}
                <div className="flex flex-col items-center text-center space-y-4 mb-8">
                    <h1 className="text-2xl font-bold">Stay Connected with Us</h1>
                    <p className="text-lg">
                        Subscribe to our newsletter for the latest updates and offers.
                    </p>
                    <div className="flex items-center">
                        <input
                            type="email"
                            placeholder="Subscribe to our newsletter"
                            className="p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
                            style={{ width: '250px' }} // Adjust the width as needed
                        />
                        <button className="bg-brown text-white font-bold py-2 px-4 hover:bg-pink-700 transition duration-300">
                            Subscribe
                        </button>
                    </div>
                </div>


                <hr className="border-t border-gray-500 mb-4" />

                {/* Second Row - Four Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-8 p-2 md:p-10">
                    {/* Column 1: About */}
                    <div className="md:p-2">


                        <p className='mt-4 md:mt-6'>
                            Welcome to [Store Name], where style meets elegance! Our store offers a curated selection of the latest
                            trends and timeless classics, ensuring you find the perfect outfit for any occasion. With a focus on quality
                            craftsmanship and unique designs, we celebrate individuality and self-expression through fashion.
                            Discover pieces that resonate with your personal style and elevate your wardrobe!
                        </p>
                    </div>

                    {/* Column 2: About Us Links */}
                    <div className="md:p-2">
                        <h2 className="text-xl font-bold mb-4 md:mb-8">Quick Links</h2>
                        <ul className="space-y-2">
                            <li><a href="#home" className="hover:underline">Home</a></li>
                            <li><a href="#testimonials" className="hover:underline">Testimonials</a></li>
                            <li><a href="#services" className="hover:underline">Our Services</a></li>
                            <li><a href="#trucks" className="hover:underline">Who can Work with us</a></li>
                            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>

                        </ul>
                    </div>

                    {/* Column 3: FAQs Links */}
                    <div className="md:selection:p-2">
                        <h2 className="text-xl font-bold mb-4 md:mb-8">Our Location</h2>
                        <ul className="space-y-2 text-sm">
                            <iframe className='w-full h-auto' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3437.903788142798!2d-87.190473!3d30.495473199999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8890c0285b0e2bc7%3A0x6c76aaee360fb49d!2s6901a%20N%209th%20Ave%20%231387%2C%20Pensacola%2C%20FL%2032504%2C%20USA!5e0!3m2!1sen!2s!4v1727715305783!5m2!1sen!2s" loading="lazy" ></iframe>
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div className="md:p-2">
                        <h2 className="text-xl font-bold mb-4 md:mb-8">Contact</h2>
                        <ul className="space-y-2">
                            <li>6901A N 9th Avenue #1387 Pensacola, Florida, 32504</li>
                            <li><a href='mail:aheadoftheothersfreight786@gmail.com'>Email: R@theaheadotrfreight.com</a></li>

                            <li><a href='tel:+12514447918'>Phone: +1 251 4447918</a></li>
                        </ul>
                    </div>
                </div>

                {/* Horizontal Line */}
                <hr className="border-t border-gray-500 mb-4" />

                {/* Last Row - Copyright */}
                <div className="text-center text-sm">
                    <p>© {new Date().getFullYear()} Your Company. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
