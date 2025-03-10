import { Separator } from "@/components/ui/separator";

interface CostBreakdownProps {
  total: number;
  gst: number;
  deliveryFee: number;
  grandTotal: number;
}

export const CostBreakdown = ({ total, gst, deliveryFee, grandTotal }: CostBreakdownProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">GST (18%)</span>
        <span>₹{gst.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Delivery Fee</span>
        <span>₹{deliveryFee.toFixed(2)}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>₹{grandTotal.toFixed(2)}</span>
      </div>
      <p className="text-xs text-muted-foreground text-right">12 mo x ₹{(grandTotal / 12).toFixed(2)}</p>
    </div>
  );
};
