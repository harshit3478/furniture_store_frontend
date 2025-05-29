"use client";

import { FC, useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Address } from "@/types/profile";


const AddressManager: FC = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address> | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formErrors, setFormErrors] = useState<{ pincode?: string; phoneNumber?: string }>({});

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token, fetchAddresses]);

  const handleAddressSubmit = async () => {
    if (!currentAddress) return;

    const pincodeValid = currentAddress.pincode?.length === 6;
    const phoneValid = currentAddress.phoneNumber?.length === 10;

    if (!pincodeValid || !phoneValid) {
      setFormErrors({
        pincode: pincodeValid ? undefined : "Pincode must be 6 digits",
        phoneNumber: phoneValid ? undefined : "Mobile number must be 10 digits",
      });
      return;
    }

    try {
      setIsSaving(true);
      const method = isEditingAddress ? "PUT" : "POST";
      const url = isEditingAddress
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/addresses/${currentAddress.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/addresses`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentAddress),
      });

      if (!response.ok) {
        throw new Error(isEditingAddress ? "Failed to update address" : "Failed to add address");
      }

      await fetchAddresses();
      setShowAddressModal(false);
      setCurrentAddress(null);
      setFormErrors({});
      toast.success(isEditingAddress ? "Address updated" : "Address added");
    } catch (error) {
      console.error("Error with address:", error);
      toast.error(isEditingAddress ? "Failed to update address" : "Failed to add address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      await fetchAddresses();
      toast.success("Address deleted");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to set default address");
      }

      await fetchAddresses();
      toast.success("Default address updated");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const handlePincodeSearch = async (pincode: string) => {
    if (pincode.length !== 6) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/addresses/pincode?pincode=${pincode}`);

      if (!response.ok) {
        throw new Error("Failed to fetch pincode data");
      }

      const data = await response.json();
      if (data.success) {
        setCurrentAddress(prev => ({
          ...prev,
          city: data.city,
          state: data.state
        }));
        setFormErrors(prev => ({ ...prev, pincode: undefined }));
      } else {
        setFormErrors(prev => ({ ...prev, pincode: "Please provide a valid pincode" }));
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
      setFormErrors(prev => ({ ...prev, pincode: "Please provide a valid pincode" }));
    }
  };

  const openAddressModal = (address?: Address) => {
    if (address) {
      setCurrentAddress(address);
      setIsEditingAddress(true);
    } else {
      setCurrentAddress({ isDefault: addresses.length === 0 });
      setIsEditingAddress(false);
    }
    setShowAddressModal(true);
    setFormErrors({});
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">My addresses</h2>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-gray-500 text-sm">No addresses added yet</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-md p-4 relative">
              <div className="flex justify-between">
                <h3 className="font-medium flex items-center">
                  {address.fullName}
                  {address.isDefault && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Default</span>
                  )}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openAddressModal(address)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefaultAddress(address.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Set as default"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {address.addressLine1}
                {address.addressLine2 && `, ${address.addressLine2}`}
              </p>
              <p className="text-sm text-gray-600">
                {address.city}, {address.state}, {address.pincode}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {address.phoneNumber}
              </p>
              {address.landmark && (
                <p className="text-sm text-gray-600">
                  Landmark: {address.landmark}
                </p>
              )}
            </div>
          ))
        )}

        <button
          onClick={() => openAddressModal()}
          className="border border-dashed border-gray-300 rounded-md p-4 w-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add new Address
        </button>
      </div>

      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">{isEditingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Fill in the details for your address
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                value={currentAddress?.fullName || ""}
                onChange={(e) => setCurrentAddress(prev => ({ ...prev, fullName: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium">Mobile Number</Label>
              <Input
                id="phoneNumber"
                placeholder="10-digit mobile number"
                value={currentAddress?.phoneNumber || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setCurrentAddress(prev => ({ ...prev, phoneNumber: value }));
                  setFormErrors(prev => ({
                    ...prev,
                    phoneNumber: value.length !== 10 && value ? "Mobile number must be 10 digits" : undefined
                  }));
                }}
                className="mt-1"
              />
              {formErrors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="addressLine1" className="text-sm font-medium">House/Flat No., Building</Label>
              <Input
                id="addressLine1"
                placeholder="House No., Building Name"
                value={currentAddress?.addressLine1 || ""}
                onChange={(e) => setCurrentAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="addressLine2" className="text-sm font-medium">Area, Street</Label>
              <Input
                id="addressLine2"
                placeholder="Area, Street"
                value={currentAddress?.addressLine2 || ""}
                onChange={(e) => setCurrentAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="landmark" className="text-sm font-medium">Landmark (Optional)</Label>
              <Input
                id="landmark"
                placeholder="E.g. near hospital"
                value={currentAddress?.landmark || ""}
                onChange={(e) => setCurrentAddress(prev => ({ ...prev, landmark: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="pincode" className="text-sm font-medium">Pincode</Label>
              <Input
                id="pincode"
                placeholder="6-digit Pincode"
                value={currentAddress?.pincode || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCurrentAddress(prev => ({ ...prev, pincode: value }));
                  if (value.length === 6) {
                    handlePincodeSearch(value);
                  } else if (value) {
                    setFormErrors(prev => ({ ...prev, pincode: "Pincode must be 6 digits" }));
                  } else {
                    setFormErrors(prev => ({ ...prev, pincode: undefined }));
                  }
                }}
                className="mt-1"
              />
              {formErrors.pincode && (
                <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={currentAddress?.city || ""}
                  onChange={(e) => setCurrentAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={currentAddress?.state || ""}
                  onChange={(e) => setCurrentAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deliveryInstructions" className="text-sm font-medium">Delivery Instructions (Optional)</Label>
              <Input
                id="deliveryInstructions"
                placeholder="Special instructions"
                value={currentAddress?.deliveryInstructions || ""}
                onChange={(e) => setCurrentAddress(prev => ({ ...prev, deliveryInstructions: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={currentAddress?.isDefault || false}
                onChange={(e) => setCurrentAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor="isDefault" className="text-sm">Make this my default address</Label>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setShowAddressModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddressSubmit}
              disabled={
                isSaving ||
                !currentAddress?.fullName ||
                !currentAddress?.addressLine1 ||
                !currentAddress?.city ||
                !currentAddress?.state ||
                !currentAddress?.pincode ||
                currentAddress.pincode.length !== 6 ||
                !currentAddress?.phoneNumber ||
                currentAddress.phoneNumber.length !== 10 ||
                !!formErrors.pincode ||
                !!formErrors.phoneNumber
              }
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditingAddress ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressManager;