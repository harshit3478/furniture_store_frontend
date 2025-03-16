"use client";

import { FC } from "react";
import Image from "next/image";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { useAuth } from "@/lib/authContext";

const ProfilePage: FC = () => {
    const { user } = useAuth();
    const userName = user?.displayName || "Guest";
  return (
    <div className="flex justify-center items-center h-full">
      <div className="h-96 w-96 relative hidden md:block">
        <Image
          src="/profile/group.png"
          alt="Profile"
          fill
          className="object-contain"
        />
      </div>
      <div className="block md:hidden">
        <ProfileSidebar userName={userName} />
      </div>
    </div>
  );
};

export default ProfilePage;
