'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number | null;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponsResponse {
  success: boolean;
  coupons: Coupon[];
}

export interface CouponContextType {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  fetchCoupons: () => Promise<void>;
  refreshCoupons: () => Promise<void>;
  getCouponByCode: (code: string) => Coupon | undefined;
  getActiveCoupons: () => Coupon[];
  getValidCouponsForOrder: (orderValue: number) => Coupon[];
  calculateDiscount: (coupon: Coupon, orderValue: number) => number;
  isCouponValid: (coupon: Coupon, orderValue?: number) => {
    valid: boolean;
    reason?: string;
  };
}

// Create Context
const CouponContext = createContext<CouponContextType | undefined>(undefined);

// Custom hook to use coupon context
export const useCoupons = (): CouponContextType => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
};

// Provider Props
interface CouponProviderProps {
  children: ReactNode;
}

// Provider Component
export const CouponProvider: React.FC<CouponProviderProps> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch coupons from API
  const fetchCoupons = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coupons`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CouponsResponse = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch coupons');
      }

      setCoupons(data.coupons);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch coupons';
      setError(errorMessage);
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh coupons
  const refreshCoupons = async (): Promise<void> => {
    await fetchCoupons();
  };

  // Get coupon by code
  const getCouponByCode = (code: string): Coupon | undefined => {
    return coupons.find(coupon => 
      coupon.code.toLowerCase() === code.toLowerCase()
    );
  };

  // Get only active coupons
  const getActiveCoupons = (): Coupon[] => {
    return coupons.filter(coupon => coupon.isActive);
  };

  // Get valid coupons for a specific order value
  const getValidCouponsForOrder = (orderValue: number): Coupon[] => {
    return coupons.filter(coupon => {
      const { valid } = isCouponValid(coupon, orderValue);
      return valid;
    });
  };

  // Calculate discount amount for a coupon
  const calculateDiscount = (coupon: Coupon, orderValue: number): number => {
    if (!isCouponValid(coupon, orderValue).valid) {
      return 0;
    }

    let discount = 0;

    if (coupon.discountType === 'percentage') {
      discount = (orderValue * coupon.discountValue) / 100;
      
      // Apply maximum discount limit if specified
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
      
      // Ensure discount doesn't exceed order value
      if (discount > orderValue) {
        discount = orderValue;
      }
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  };

  // Check if coupon is valid
  const isCouponValid = (coupon: Coupon, orderValue?: number): {
    valid: boolean;
    reason?: string;
  } => {
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    // Check if coupon is active
    if (!coupon.isActive) {
      return { valid: false, reason: 'Coupon is not active' };
    }

    // Check date validity
    if (now < startDate) {
      return { valid: false, reason: 'Coupon is not yet valid' };
    }

    if (now > endDate) {
      return { valid: false, reason: 'Coupon has expired' };
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, reason: 'Coupon usage limit exceeded' };
    }

    // Check minimum order value if orderValue is provided
    if (orderValue !== undefined && orderValue < coupon.minOrderValue) {
      return { 
        valid: false, 
        reason: `Minimum order value of ₹${coupon.minOrderValue} required` 
      };
    }

    return { valid: true };
  };

  // Fetch coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const contextValue: CouponContextType = {
    coupons,
    loading,
    error,
    fetchCoupons,
    refreshCoupons,
    getCouponByCode,
    getActiveCoupons,
    getValidCouponsForOrder,
    calculateDiscount,
    isCouponValid,
  };

  return (
    <CouponContext.Provider value={contextValue}>
      {children}
    </CouponContext.Provider>
  );
};

export default CouponProvider;