"use client";
import { Navbar } from "@/components/navbar/navbar";
import { CategorySection } from "@/app/components/category-section";
import { BestsellersSection } from "@/app/components/bestsellers-section";
import { ComboSection } from "@/app/components/combo-section";
import { OffersSection } from "@/app/components/offers-section";
import { FaqSection } from "@/app/components/faq-section";
import { Footer } from "@/components/footer";
import CustomCarousel from "./components/Carousel";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { SyncModal } from "./components/sync-modal";
import { useCart } from "@/lib/cartContext";

export default function Home() {
  const { token } = useAuth();
  const { localCart } = useCart();
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
        <ComboSection />
        <OffersSection />
        <FaqSection />
      </main>
      <Footer />
      {syncModal && <SyncModal setShowModal={setSyncModal} showModal={syncModal} />}
    </div>
  );
}
