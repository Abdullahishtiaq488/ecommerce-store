"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselSlide {
  src: string
  alt: string
  content?: React.ReactNode
}

const slides: CarouselSlide[] = [
  { src: "/carousel-1.jpg", alt: "Slide 1" },
  {
    src: "/carousel-2.jpg",
    alt: "Winter Sale",
    content: (
      <div className="absolute top-1/4 left-4 md:left-15 text-left text-white">
        <p className="text-yellow-400 text-heading3-bold md:text-[30px] mb-2">FLAT 60% OFF</p>
        <h2 className="text-heading1-bold md:text-[60px]">
          WINTER <br /> SALE
        </h2>
      </div>
    ),
  },
  {
    src: "/carousel-3.jpg",
    alt: "Trending Now",
    content: (
      <div className="absolute top-1/4 right-4 md:right-10 text-center font-bold">
        <h2 className="text-heading1-bold md:text-[70px]">
          <span className="text-gray-900">TRENDING</span> <br />
          <span className="text-red-700">NOW!</span>
        </h2>
      </div>
    ),
  },
]

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }, [])

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext()
    }

    if (touchStart - touchEnd < -75) {
      handlePrevious()
    }
  }

  useEffect(() => {
    const interval = setInterval(handleNext, 5000)
    return () => clearInterval(interval)
  }, [handleNext])

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured Products Carousel"
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            currentIndex === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={currentIndex !== index}
        >
          <Image
            src={slide.src || "/placeholder.svg"}
            alt={slide.alt}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/40" />
          {slide.content}
        </div>
      ))}

      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-hidden focus:ring-2 focus:ring-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-hidden focus:ring-2 focus:ring-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              currentIndex === index ? "bg-white" : "bg-white/50",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Carousel