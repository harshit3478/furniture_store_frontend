"use client";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CustomCarousel = () => {
  const slides = [
    {
      id: 1,
      title: "Smart Rentals for Urban Living",
      subtitle: "Rent Now - Use code: RENT30",
      color: "bg-gradient-to-r from-[#6D21B1] to-[#AF21B1]"
    },
    {
      id: 2,
      title: "Smart Furnish",
      subtitle: "Space Savvy, Trendy",
      color: "bg-gradient-to-r from-[#6D21B1] to-[#AF21B1]"
    },
    {
      id: 3,
      title: "Quirky, Trendy",
      subtitle: "Furniture for All Your Needs",
      color: "bg-gradient-to-r from-[#6D21B1] to-[#AF21B1]"
    },
    {
      id: 4,
      title: "Premium Collection",
      subtitle: "Luxury Meets Comfort",
      color: "bg-gradient-to-r from-[#6D21B1] to-[#AF21B1]"
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

  // Auto-play functionality
  useEffect(() => {
    if (api) {
      const interval = setInterval(() => {
        api.scrollNext();
      }, 20000); // Auto-play every 5 seconds
      return () => clearInterval(interval);
    }
  }, [api]);

  return (
    <div className="w-full flex justify-center py-8 pb-2 ">
      <div className="w-[96%]">
        <Carousel
        opts={{
          align: "center",
          loop: true,
          slidesToScroll: 1,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[300px] md:h-[400px] lg:h-[450px] rounded-xl overflow-hidden">
                {/* Placeholder div - replace with your images later */}
                <div className={cn(
                  " h-full flex flex-col items-center justify-center text-white",
                  slide.color
                )}>
                  <div className="text-center space-y-4 px-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl opacity-90">
                      {slide.subtitle}
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 mt-6"
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
       
        <CarouselPrevious className="absolute left-4 z-10 top-1/2 transform -translate-y-1/2 hidden md:flex" />
        <CarouselNext className="absolute right-4 z-10 top-1/2 transform -translate-y-1/2 hidden md:flex" />
       
        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={cn(
                "h-2 w-2 rounded-full p-0 transition-all duration-300",
                currentIndex === index 
                  ? "bg-[#6D21B1] scale-125" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
              </Carousel>
      </div>
    </div>
  );
};

export default CustomCarousel;