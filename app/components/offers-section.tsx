import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { OfferCard } from "@/components/offer-card";

// Define the Offer type (could be moved to a separate types file)
interface Offer {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  expiry: string;
  terms: string;
  color: string;
}

// Sample offers data with explicit typing
const offers: Offer[] = [
  {
    id: "1",
    title: "Code10",
    subtitle: "Get 10% off upto ₹200",
    code: "CODE10",
    expiry: "05/08/2021 04:00 – 09/08/2021 12:00",
    terms: "Only for second order. Cannot be combined with other discounts.",
    color: "bg-purple-100",
  },
  {
    id: "2",
    title: "Code20",
    subtitle: "Get 20% off upto ₹500",
    code: "CODE20",
    expiry: "Valid until 31.12.2023",
    terms: "Cannot be combined with other promotions.",
    color: "bg-blue-100",
  },
  {
    id: "3",
    title: "Code10",
    subtitle: "Get 10% off upto ₹200",
    code: "CODE10",
    expiry: "05/08/2021 04:00 – 09/08/2021 12:00",
    terms: "Only for second order. Cannot be combined with other discounts.",
    color: "bg-purple-100",
  },
  {
    id: "4",
    title: "Code20",
    subtitle: "Get 20% off upto ₹500",
    code: "CODE20",
    expiry: "Valid until 31.12.2023",
    terms: "Cannot be combined with other promotions.",
    color: "bg-blue-100",
  },
  {
    id: "5",
    title: "Code20",
    subtitle: "Get 20% off upto ₹500",
    code: "CODE20",
    expiry: "Valid until 31.12.2023",
    terms: "Cannot be combined with other promotions.",
    color: "bg-blue-100",
  },
];

export function OffersSection() {
  return (
    <section className="py-8 px-8 w-full bg-[#F7F6FD]">
      <div className="container">
        <div className="mb-6">
          <h2 className="text-3xl font-gilroySemibold mb-2">Offers</h2>
          <p className="text-muted-foreground text-base">
            Checkout these coupons just for you!
          </p>
        </div>
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 4 },
          }}
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id} className=" rounded-md ">
              <OfferCard offer={offer} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}