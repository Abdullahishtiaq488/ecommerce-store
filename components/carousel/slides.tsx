import React from 'react';

// Define the slide interface
export interface CarouselSlide {
    src: string;
    alt: string;
    content?: React.ReactNode;
}

// Centralized styles using global CSS classes
export const slideStyles = {
    contentWrapper: {
        left: "absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-20 bg-gradient-to-r from-black/50 to-transparent",
        right: "absolute inset-0 flex flex-col items-end justify-center px-6 sm:px-10 md:px-20 text-right bg-gradient-to-l from-black/50 to-transparent",
        center: "absolute inset-0 flex flex-col items-center justify-center text-center bg-black/30",
        bottom: "absolute inset-0 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20 px-6 sm:px-10 md:px-20 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
    },
    contentBox: "max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg",
    tag: "inline-block px-3 py-1 mb-3 md:mb-4 text-small-medium uppercase rounded-full",
    heading: {
        primary: "mb-2 text-heading2-bold sm:text-heading1-bold",
        secondary: "mb-2 text-heading3-bold sm:text-heading2-bold"
    },
    paragraph: "mb-4 md:mb-6 text-base-medium sm:text-body-medium max-w-xs sm:max-w-sm md:max-w-md",
    button: "px-6 py-2 md:px-8 md:py-3 text-small-bold uppercase transition-all rounded-md hover:shadow-lg w-auto sm:w-auto"
};

// Carousel slides data
export const carouselSlides: CarouselSlide[] = [
    {
        src: "/carousel-1.jpg",
        alt: "Summer Collection",
        content: (
            <div className={slideStyles.contentWrapper.left}>
                <div className={slideStyles.contentBox}>
                    <span className={`${slideStyles.tag} text-white bg-black/60`}>New Arrival</span>
                    <h2 className={`${slideStyles.heading.primary} tracking-tight text-white`}>
                        Summer<br className="hidden sm:block" />Collection
                    </h2>
                    <p className={`${slideStyles.paragraph} text-white/90`}>
                        Discover our breathtaking summer styles designed for the modern trendsetter.
                    </p>
                    <button className={`${slideStyles.button} text-black bg-white hover:bg-yellow-400`}>
                        Shop Now
                    </button>
                </div>
            </div>
        ),
    },
    {
        src: "/carousel-2.jpg",
        alt: "Winter Sale",
        content: (
            <div className={slideStyles.contentWrapper.left}>
                <div className={slideStyles.contentBox}>
                    <span className={`${slideStyles.tag} text-black bg-yellow-400`}>Limited Time</span>
                    <h2 className={`${slideStyles.heading.primary} text-white`}>
                        <span className="text-yellow-400">60% </span>
                        <span className="text-white">OFF</span>
                    </h2>
                    <h3 className={`${slideStyles.heading.secondary} text-white`}>Winter Collection</h3>
                    <p className={`${slideStyles.paragraph} text-white/90`}>
                        Elevate your winter wardrobe with our premium selection at unbeatable prices.
                    </p>
                    <button className={`${slideStyles.button} text-black bg-yellow-400 hover:bg-white`}>
                        Explore Now
                    </button>
                </div>
            </div>
        ),
    },
    {
        src: "/carousel-3.jpeg",
        alt: "Trending Now",
        content: (
            <div className={slideStyles.contentWrapper.center}>
                <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 sm:px-6 py-6 sm:py-8 md:py-10 bg-white/10 backdrop-blur-sm rounded-lg">
                    <span className={`${slideStyles.tag} text-white bg-red-700`}>Hot This Season</span>
                    <h2 className={`${slideStyles.heading.primary} text-white`}>
                        <span className="text-white">TRENDING</span>
                        <span className="block mt-1 sm:mt-2 text-red-500">COLLECTION</span>
                    </h2>
                    <div className="w-12 sm:w-16 md:w-20 h-1 mx-auto my-2 sm:my-3 md:my-4 bg-red-500"></div>
                    <p className={`${slideStyles.paragraph} text-white`}>
                        Discover the season's most coveted styles that will set you apart from the crowd.
                    </p>
                    <button className={`${slideStyles.button} text-white bg-red-700 hover:bg-red-600`}>
                        View Collection
                    </button>
                </div>
            </div>
        ),
    },
    {
        src: "/carousel-4.jpg",
        alt: "Exclusive Collection",
        content: (
            <div className={slideStyles.contentWrapper.center}>
                <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 sm:px-6">
                    <span className={`${slideStyles.tag} text-black bg-white`}>Premium Quality</span>
                    <h2 className={`${slideStyles.heading.primary} text-white`}>EXCLUSIVE COLLECTION</h2>
                    <div className="w-12 sm:w-16 md:w-20 h-1 mx-auto my-2 sm:my-3 md:my-4 bg-white"></div>
                    <p className={`${slideStyles.paragraph} text-white/90`}>
                        Indulge in luxury with our meticulously crafted garments designed for the discerning fashionista.
                    </p>
                    <button className={`${slideStyles.button} text-black bg-white hover:bg-gray-200`}>
                        Discover More
                    </button>
                </div>
            </div>
        ),
    },
    {
        src: "/carousel-5.jpg",
        alt: "Fashion Forward",
        content: (
            <div className={slideStyles.contentWrapper.bottom}>
                <div className={slideStyles.contentBox}>
                    <div className="w-12 sm:w-16 md:w-20 h-1 mb-3 sm:mb-4 md:mb-6 bg-white"></div>
                    <h2 className={`${slideStyles.heading.primary} text-white`}>FASHION FORWARD</h2>
                    <p className={`${slideStyles.paragraph} text-white/90`}>
                        Stay ahead of the curve with cutting-edge designs that define tomorrow's trends.
                    </p>
                    <button className={`${slideStyles.button} text-black bg-white hover:bg-gray-200`}>
                        Shop The Look
                    </button>
                </div>
            </div>
        ),
    },
]; 