"use client";

import { FC } from "react";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { useAuth } from "@/lib/authContext";

const ProfilePage: FC = () => {
  const { user } = useAuth();
  const userName = user?.displayName || "Guest";
  return (
    <ProfileSidebar userName={userName} />
  );
};

export default ProfilePage;
