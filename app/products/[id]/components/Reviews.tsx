import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"
import { Star, StarHalf } from "lucide-react";

export  function Reviews() {
    return(
        <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Reviews</h2>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">4.5</div>
            <div className="flex flex-col">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <StarHalf className="w-4 h-4 fill-current" />
              </div>
              <div className="text-sm text-gray-500">1155 Reviews</div>
            </div>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2 mb-1">
                <div className="w-8 text-xs text-right">{rating}.0</div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${rating === 5 ? "60" : rating === 4 ? "25" : rating === 3 ? "10" : "5"}%` }}
                  ></div>
                </div>
                <div className="w-16 text-xs">
                  {rating === 5 ? "60" : rating === 4 ? "25" : rating === 3 ? "10" : "5"} reviews
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <Tabs defaultValue="quality">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="quality">Quality</TabsTrigger>
              <TabsTrigger value="material">Material</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
              <TabsTrigger value="durability">Durability</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="border-b pb-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-medium">Harshit Agarwal</div>
                  <div className="text-sm text-gray-500">4 months ago</div>
                </div>
                <div className="ml-auto flex items-center">
                  <div className="text-lg font-semibold">5.0</div>
                  <div className="flex text-amber-400 ml-1">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                This bed is amazing! Super sturdy, easy to assemble, and the design is just beautiful. The frame
                doesn&apos;t creak, and the headboard adds a nice touch of elegance. Been sleeping like a baby ever since I
                got it!
              </p>
            </div>
          ))}

          <div className="flex justify-center">
            <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
              Load More Reviews
            </Button>
          </div>
        </div>
      </div>

    )
}