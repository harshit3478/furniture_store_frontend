import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

// Define the categories
const categories = [
  {
    id: "bed-room",
    title: "Bed Room",
    image: "/home/categories/bedroom.png?height=150&width=150",
    href: "/search?category=bed-room",
  },
  {
    id: "living-room",
    title: "Living Room",
    image: "/home/categories/livingroom.png?height=150&width=150",
    href: "/search?category=living-room",
  },
  {
    id: "dining-room",
    title: "Dining Room",
    image: "/home/categories/diningroom.png?height=150&width=150",
    href: "/search?category=dining-room",
  },
  {
    id: "office",
    title: "Office",
    image: "/home/categories/office.png?height=150&width=150",
    href: "/search?category=office",
  },
  {
    id: "kids-room",
    title: "Kids Room",
    image: "/home/categories/kidsroom.png?height=150&width=150",
    href: "/search?category=kids-room",
  },
  {
    id: "outdoor",
    title: "Outdoor",
    image: "/home/categories/outdoor.png?height=150&width=150",
    href: "/search?category=outdoor",
  },
];

export function CategorySection() {
  return (
    <section className="py-8 px-8 w-full categories">
      <div className="container">
        <div className="mb-6">
          <h2 className="text-3xl font-gilroySemibold mb-2">Categories</h2>
          <p className="text-muted-foreground text-base">
            Furniture for all your furnishing needs!
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="group block">
              <Card className="shadow-sm hover:shadow-md hover:shadow-purple-200 hover:border hover:border-purple-500 transition-all duration-300 group-hover:scale-105 group-active:scale-95 cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center text-center relative overflow-hidden">
                  {/* Hover background effect */}
                  <div className="absolute inset-0 rounded-lg"></div>
                  
                  <div className="relative w-32 h-32 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <h3 className="font-gilroyMedium text-gray-700 group-hover:text-purple-600  transition-all duration-300 relative z-10">
                    {category.title}
                  </h3>
                  
                  {/* Animated border effect */}
                  {/* <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-purple-200 transition-colors duration-300"></div> */}
                  
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}