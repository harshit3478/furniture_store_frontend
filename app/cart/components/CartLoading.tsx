// components/cart/CartLoading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const CartLoading = () => {
  return (
    <div className="space-y-8">
      {/* <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p className="text-lg font-medium">Loading cart items...</p>
      </div> */}
      
      {/* Skeleton for cart items */}
      {[1, 2].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-[120px] w-[120px] rounded-md" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      {/* Skeleton for order summary */}
      <Card className="p-6">
        <Skeleton className="h-7 w-1/3 mb-4" />
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/6" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-1/6" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/6" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-6" />
      </Card>
    </div>
  );
};