"use client";

import { FC } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";

interface ProfileSidebarProps {
  userName: string;
}

export const ProfileSidebar: FC<ProfileSidebarProps> = ({ userName }) => {
  const pathname = usePathname();
  
  return (
    <div className="space-y-4 ">
      <div className="mb-4">
        <h2 className="text-3xl mb-1 mx-2 font-gilroySemibold">Profile</h2>
        <div className="flex items-center">
          <span className="text-gray-500 mx-2 font-gilroyMedium">Hello {userName}</span>
          <span className="ml-1">👋</span>
        </div>
      </div>

      <ProfileCard
        icon="📋"
        title="My Orders"
        description="See all orders and stay updated with their status"
        href="/profile/orders"
        isActive={pathname === "/profile/orders"}
      />
      <ProfileCard
        icon="💳"
        title="My Payments"
        description="Track your payments and download statement"
        href="/profile/payments"
        isActive={pathname === "/profile/payments"}
      />
      
      <ProfileCard
        icon="📄"
        title="KYC and Verification"
        description="Upload your KYC documents for verification"
        href="/profile/kyc"
        isActive={pathname === "/profile/kyc"}
      />
      <ProfileCard
        icon="⚙️"
        title="Profile Settings"
        description="Modify name, email and phone number, Addresses"
        href="/profile/settings"
        isActive={pathname === "/profile/settings"}
      />
    </div>
  );
};

interface ProfileCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  isActive?: boolean;
}

const ProfileCard: FC<ProfileCardProps> = ({
  icon,
  title,
  description,
  href,
  isActive = false,
}) => {
  return (
    <Link href={href}>
      <Card className={`p-2 m-2 border-2 ${isActive ? 'border-primary text-purple-700' : 'border-gray-200'} hover:border-gray-300 transition-all`}>
        <div className="flex items-center">
          <div className="text-2xl mr-3 ">{icon}</div>
          <div>
            <h3 className="font-gilroyMedium text-md ">{title}</h3>
            <p className="text-gray-500 text-sm sm:hidden">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
