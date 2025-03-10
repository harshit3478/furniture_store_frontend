"use client";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CustomCarousel = () => {
  const images = [
    {
      src: "/home/carousel/banner1.jpg",
      alt: "Smart Rentals for Urban Living",
      title: "Smart Rentals for Urban Living",
      subtitle: "Rent Now - Use code: RENT30",
    },
    {
      src: "/home/carousel/banner2.webp",
      alt: "Smart Furnish - Space Savvy, Trendy",
      title: "Smart Furnish",
      subtitle: "Space Savvy, Trendy",
    },
    {
      src: "/home/carousel/banner3.webp",
      alt: "Quirky, Trendy Furniture",
      title: "Quirky, Trendy",
      subtitle: "Furniture for All Your Needs",
    },
    {
      src: "/home/carousel/banner3.webp",
      alt: "Quirky, Trendy Furniture",
      title: "Quirky, Trendy",
      subtitle: "Furniture for All Your Needs",
    },
  ];
  
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle carousel API when it's ready
  useEffect(() => {
    if (api) {
      api.on("select", () => {
        setCurrentIndex(api.selectedScrollSnap());
      });
    }
  }, [api]);

  // Uncomment for auto-play functionality
  /*
  useEffect(() => {
    if (api) {
      const interval = setInterval(() => {
        api.scrollNext();
      }, 6000); // Auto-play every 6 seconds
      return () => clearInterval(interval);
    }
  }, [api]);
  */

  return (
    <div className="w-[92vw]  mx-auto py-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 1,
        }}
        className="w-full "
        setApi={setApi}
      >
        <CarouselContent className="-ml-4 w-full md:h-[40vh] ">
          {images.map((image, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-[45%]">
              <div className="relative h-[40vh] w-full rounded-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
          
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="absolute -left-4 z-10 top-1/2 transform -translate-y-1/2" />
        <CarouselNext className="absolute -right-4 z-10 top-1/2 transform -translate-y-1/2" />
        
        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={cn(
                "h-2 w-2 rounded-full p-0 bg-gray-300",
                currentIndex === index && "bg-gray-800"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default CustomCarousel;