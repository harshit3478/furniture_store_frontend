import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Coupon = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-medium">Coupons Available!</h3>
        <Badge variant="outline" className="text-yellow-500 border-yellow-500">
          🎉
        </Badge>
      </div>
      <div className="flex gap-2">
        <Input placeholder="Enter coupon code" className="flex-grow" />
        <Button variant="outline">Apply</Button>
      </div>
    </div>
  );
};