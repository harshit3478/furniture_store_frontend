import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CostBreakdown } from "./CostBreakdown";
import { CartVisualizer } from "./CartVisualizer";
import { Coupon } from "./Coupon";
import { DeliveryEstimate } from "./DeliveryEstimate";

interface OrderSummaryProps {
  total: number;
  gst: number;
  deliveryFee: number;
  grandTotal: number;
}

export const OrderSummary = ({ total, gst, deliveryFee, grandTotal }: OrderSummaryProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Total Rent:</h2>
      <CostBreakdown 
        total={total} 
        gst={gst} 
        deliveryFee={deliveryFee} 
        grandTotal={grandTotal} 
      />

      <Button className="w-full mt-6 flex items-center justify-center gap-2">
        Proceed with the purchase
        <span className="ml-1">→</span>
      </Button>

      <div className="mt-8">
        <h3 className="font-medium mb-4">Cost Breakdown</h3>
        <CartVisualizer />
      </div>

      <div className="mt-8">
        <Coupon />
      </div>

      <div className="mt-8">
        <h3 className="font-medium mb-4">Delivery Estimate</h3>
        <DeliveryEstimate />
      </div>
    </Card>
  );
};
