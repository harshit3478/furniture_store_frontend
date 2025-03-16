"use client";

import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ProfileSettingsPage: FC = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "Home 1",
      address: "1A, Hall of Residence, IIT Kharagpur, Kharagpur 721301"
    },
    {
      id: 2,
      title: "Home 1",
      address: "1A, Hall of Residence, IIT Kharagpur, Kharagpur 721301"
    }
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
      <p className="text-gray-500 mb-6">Modify name, email, phone number and addresses</p>
      
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
            <Input 
              id="fullName" 
              type="text" 
              placeholder="Full Name" 
              defaultValue="Harshit Agarwal"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium mb-1">Mobile Number</label>
            <Input 
              id="mobileNumber" 
              type="tel" 
              placeholder="Mobile Number" 
              defaultValue="1234567890"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Email" 
              defaultValue="harshit@gmail.com"
              className="w-full"
            />
          </div>
        </div>
        
        {/* Addresses */}
        <div>
          <h2 className="text-lg font-medium mb-3">My addresses</h2>
          
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="border border-gray-200 rounded-md p-4">
                <h3 className="font-medium">{address.title}</h3>
                <p className="text-sm text-gray-600">{address.address}</p>
              </div>
            ))}
            
            <button className="border border-dashed border-gray-300 rounded-md p-4 w-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Plus size={20} className="mr-2" />
              Add new Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
