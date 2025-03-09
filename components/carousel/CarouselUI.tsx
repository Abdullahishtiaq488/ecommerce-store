"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { CarouselSlide } from "./slides"

// Centralized styles for carousel UI elements
const uiStyles = {
    container: "relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen w-full overflow-hidden",
    slideContainer: "absolute inset-0 transition-all duration-1000 ease-in-out",
    activeSlide: "opacity-100 translate-x-0",
    prevSlide: "opacity-0 -translate-x-full",
    nextSlide: "opacity-0 translate-x-full",
    navButton: {
        base: "absolute top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 sm:p-3 text-white transition-all hover:bg-black/70 hover:scale-110 active:scale-95 z-10 focus:outline-none focus:ring-2 focus:ring-white",
        left: "left-2 sm:left-4",
        right: "right-2 sm:right-4"
    },
    indicatorContainer: "absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 flex -translate-x-1/2 space-x-2 sm:space-x-3 z-10",
    indicator: {
        base: "h-2 sm:h-3 transition-all",
        active: "bg-white w-6 sm:w-8 rounded-full",
        inactive: "bg-white/50 w-2 sm:w-3 rounded-full hover:bg-white/70"
    }
};

interface CarouselProps {
    slides: CarouselSlide[];
    autoPlayInterval?: number;
    showNavigation?: boolean;
    showIndicators?: boolean;
}

const CarouselUI = ({
    slides,
    autoPlayInterval = 5000,
    showNavigation = true,
    showIndicators = true
}: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Handle next slide with animation
    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, [slides.length]);

    // Handle previous slide with animation
    const handlePrevious = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Touch event handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsAutoPlaying(false); // Pause autoplay on touch
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        const swipeThreshold = 75;
        if (touchStart - touchEnd > swipeThreshold) {
            handleNext();
        }

        if (touchStart - touchEnd < -swipeThreshold) {
            handlePrevious();
        }

        // Resume autoplay after touch
        setIsAutoPlaying(true);
    };

    // Handle mouse enter/leave for pausing/resuming autoplay
    const handleMouseEnter = () => {
        setIsAutoPlaying(false);
    };

    const handleMouseLeave = () => {
        setIsAutoPlaying(true);
    };

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            handlePrevious();
        } else if (e.key === 'ArrowRight') {
            handleNext();
        }
    }, [handleNext, handlePrevious]);

    // Set up keyboard navigation
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    // Autoplay effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isAutoPlaying) {
            interval = setInterval(handleNext, autoPlayInterval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [handleNext, isAutoPlaying, autoPlayInterval]);

    // Handle window resize for responsive adjustments
    useEffect(() => {
        const handleResize = () => {
            // Any responsive adjustments can be made here
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!slides || slides.length === 0) {
        return null;
    }

    return (
        <section
            className={uiStyles.container}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-roledescription="carousel"
            aria-label="Featured Products Carousel"
        >
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={cn(
                        uiStyles.slideContainer,
                        currentIndex === index
                            ? uiStyles.activeSlide
                            : index < currentIndex
                                ? uiStyles.prevSlide
                                : uiStyles.nextSlide
                    )}
                    aria-hidden={currentIndex !== index}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Slide ${index + 1} of ${slides.length}: ${slide.alt}`}
                >
                    <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                        quality={90}
                    />
                    {slide.content}
                </div>
            ))}

            {/* Navigation buttons with hover effects */}
            {showNavigation && (
                <>
                    <button
                        onClick={handlePrevious}
                        className={`${uiStyles.navButton.base} ${uiStyles.navButton.left}`}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    <button
                        onClick={handleNext}
                        className={`${uiStyles.navButton.base} ${uiStyles.navButton.right}`}
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                </>
            )}

            {/* Slide indicators */}
            {showIndicators && (
                <div className={uiStyles.indicatorContainer}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                uiStyles.indicator.base,
                                currentIndex === index
                                    ? uiStyles.indicator.active
                                    : uiStyles.indicator.inactive
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={currentIndex === index ? "true" : "false"}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default CarouselUI; 