import React from "react";
import { motion } from "framer-motion";

// Define the Offer type
interface Offer {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  expiry: string;
  terms: string;
  color: string;
}

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <motion.div
      className={`relative p-6 rounded-lg ${offer.color}`}
      style={{
        backgroundImage: `url('/home/offers/coupon1.svg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <div className="text-3xl font-semibold text-purple-800">
          <span>{offer.title}</span>
        </div>
        <div className="pl-1 text-xl">{offer.subtitle}</div>
      </div>
      <div className="text-xs text-gray-600 hidden md:block">
        <p>{offer.expiry}</p>
        <p className="text-nowrap max-w-full overflow-hidden ">{offer.terms}</p>
      </div>
    </motion.div>
  );
}