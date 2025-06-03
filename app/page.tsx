"use client";
import { Navbar } from "@/components/navbar/navbar";
import { CategorySection } from "@/app/components/category-section";
import { BestsellersSection } from "@/app/components/bestsellers-section";
// import { ComboSection } from "@/app/components/combo-section";
import { OffersSection } from "@/app/components/offers-section";
import { FaqSection } from "@/app/components/faq-section";
import CustomCarousel from "./components/Carousel";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { SyncModal } from "./components/sync-modal";
import { useCart } from "@/lib/cartContext";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  // state of user login
  const { token } = useAuth();
  // states of local cart
  const { localCart } = useCart();
  // whether user wants to sync local cart with server
  const [syncModal, setSyncModal] = useState(false);

  useEffect(() => {
    if (token && localCart.length > 0) {
      setSyncModal(true);
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CustomCarousel />
        <CategorySection />
        <BestsellersSection />
        {/* <ComboSection /> */}
        <OffersSection />
        <FaqSection />
        <Footer />
      </main>
      {syncModal && <SyncModal setShowModal={setSyncModal} showModal={syncModal} />}
    </div>
  );
}
