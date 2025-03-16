"use client";

import React from 'react';
import { Navbar } from '@/components/navbar/navbar';
import { Footer } from '@/components/footer/Footer';
import { ProfileSidebar } from './components/ProfileSidebar';
import { useAuth } from "@/lib/authContext";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const userName = user?.displayName || "Guest";

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-primary-background ">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 py-8 px-4 ">
          {/* Left Side - Profile Sidebar */}
          <div className="col-span-2 md:border-r md:pr-8 border-gray-200 hidden md:block">
            <ProfileSidebar userName={userName} />
          </div>
          
          {/* Right Side - Page Content */}
          <div className="col-span-3">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileLayout;
