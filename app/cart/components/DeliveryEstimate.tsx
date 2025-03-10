import { Input } from "@/components/ui/input";

export const DeliveryEstimate = () => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-muted-foreground">Address:</label>
        <Input placeholder="Enter your address" className="mt-1" />
      </div>
      <div>
        <label className="text-sm text-muted-foreground">PinCode:</label>
        <Input placeholder="Enter pincode" className="mt-1" />
      </div>
      <p className="text-sm">Get it delivered by 10 March</p>
    </div>
  );
};