

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string | null;
  photoUrl: string;
}

export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  landmark?: string | null;
  deliveryInstructions?: string | null;
  isDefault: boolean;
}