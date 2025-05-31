import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { OfferCard } from "@/components/offer-card";
import { useCoupons, type Coupon } from "@/lib/couponContext";

// Transform coupon data to match OfferCard expected format
interface Offer {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  expiry: string;
  terms: string;
  color: string;
}

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to generate subtitle based on coupon data
const generateSubtitle = (coupon: Coupon): string => {
  if (coupon.discountType === 'percentage') {
    const maxDiscount = coupon.maxDiscountAmount 
      ? ` upto ₹${coupon.maxDiscountAmount}` 
      : '';
    return `Get ${coupon.discountValue}% off${maxDiscount}`;
  } else {
    return `Flat ₹${coupon.discountValue} off`;
  }
};

// Helper function to generate terms based on coupon data
const generateTerms = (coupon: Coupon): string => {
  const terms = [];
  
  if (coupon.minOrderValue > 0) {
    terms.push(`Minimum order value: ₹${coupon.minOrderValue}`);
  }
  
  if (coupon.usageLimit) {
    const remaining = coupon.usageLimit - coupon.usageCount;
    terms.push(`${remaining} uses remaining`);
  }
  
  if (terms.length === 0) {
    terms.push("Cannot be combined with other promotions.");
  }
  
  return terms.join('. ');
};

// Color options for cards
const colorOptions = [
  "bg-purple-100",
  "bg-blue-100", 
  "bg-green-100",
  "bg-pink-100",
  "bg-yellow-100",
  "bg-indigo-100"
];

// Transform coupon to offer format
const transformCouponToOffer = (coupon: Coupon, index: number): Offer => ({
  id: coupon.id,
  title: coupon.code,
  subtitle: generateSubtitle(coupon),
  code: coupon.code,
  expiry: `Valid until ${formatDate(coupon.endDate)}`,
  terms: generateTerms(coupon),
  color: colorOptions[index % colorOptions.length],
});

export function OffersSection() {
  const { loading, error, getActiveCoupons } = useCoupons();

  // Get only active coupons
  const activeCoupons = getActiveCoupons();
  
  // Transform coupons to offers format
  const offers = activeCoupons.map((coupon, index) => 
    transformCouponToOffer(coupon, index)
  );

  // Loading state
  if (loading) {
    return (
      <section className="py-8 px-8 w-full bg-[#F7F6FD]">
        <div className="container">
          <div className="mb-6">
            <h2 className="text-3xl font-gilroySemibold mb-2">Offers</h2>
            <p className="text-muted-foreground text-base">
              Loading amazing deals for you...
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-8 px-8 w-full bg-[#F7F6FD]">
        <div className="container">
          <div className="mb-6">
            <h2 className="text-3xl font-gilroySemibold mb-2">Offers</h2>
            <p className="text-muted-foreground text-base">
              Unable to load offers at the moment.
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No offers available
  if (offers.length === 0) {
    return (
      <section className="py-8 px-8 w-full bg-[#F7F6FD]">
        <div className="container">
          <div className="mb-6">
            <h2 className="text-3xl font-gilroySemibold mb-2">Offers</h2>
            <p className="text-muted-foreground text-base">
              No active offers available at the moment.
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Check back soon for exciting deals!
            </p>
          </div>
        </div>
      </section>
    );
  }

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
            768: { slidesPerView: Math.min(4, offers.length) },
          }}
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id} className="rounded-md">
              <OfferCard offer={offer} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}