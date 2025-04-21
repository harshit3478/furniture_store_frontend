"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Address } from "@/types/profile";
import { PlusCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onAddressSelect: (addressId: string) => void;
  onClearAddressSelection: () => void;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onAddressSelect,
}: AddressSelectorProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium">Your Saved Addresses</h3>
        <Link href="/profile/settings" className="text-purple-600 hover:text-purple-800 text-sm">
          Manage Addresses
        </Link>
      </div>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="mb-6">
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-md p-4 cursor-pointer transition-all ${selectedAddressId === address.id ? 'border-purple-500 bg-purple-50' : 'hover:border-gray-400'}`}
                onClick={() => onAddressSelect(address.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border border-purple-500 mr-2 flex items-center justify-center">
                      {selectedAddressId === address.id && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{address.fullName} {address.isDefault && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded ml-2">Default</span>}</p>
                      <p className="text-sm text-gray-600 mt-1">{address.addressLine1}</p>
                      {address.addressLine2 && <p className="text-sm text-gray-600">{address.addressLine2}</p>}
                      {address.landmark && <p className="text-sm text-gray-600">Landmark: {address.landmark}</p>}
                      <p className="text-sm text-gray-600">{address.city}, {address.state}, {address.pincode}</p>
                      <p className="text-sm text-gray-600 mt-1">Phone: {address.phoneNumber}</p>
                    </div>
                  </div>
                  {selectedAddressId === address.id && <CheckCircle className="h-5 w-5 text-purple-600" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No addresses message */}
      {!addresses.length && (
        <div className="text-center py-8 space-y-4">
          <p className="text-gray-500">You don&apos;t have any saved addresses.</p>
          <Button variant="outline" className="mx-auto">
            <Link href="/profile/settings" className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a New Address
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
}