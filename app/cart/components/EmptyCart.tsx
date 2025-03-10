import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-lg">
      <div className="mb-6">
        <Image
          src="/cart/empty-cart.png?height=150&width=150"
          alt="Empty cart"
          width={150}
          height={150}
          className="mx-auto"
        />
      </div>
      <p className="text-xl text-center mb-8">hmm, your cart looks empty :(</p>
      <Link href="/">
        <Button className="px-8">Continue Shopping</Button>
      </Link>
    </div>
  );
};