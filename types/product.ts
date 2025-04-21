export enum Condition {
  EXCELLENT = "Excellent",
  GOOD = "Good",
  FAIR = "Fair",
  NEW = "New",
  USED = "Used",
  LIKE_NEW = "LikeNew",
  REFURBISHED = "Refurbished"
}

export interface WebsitePrices {
  sixMonths: number;
  nineMonths: number;
  twelveMonths: number;
}

export interface ReviewStats {
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductType {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  category: string;
  subcategory?: string;
  images: string[];
  material: string;
  size: string;
  rating: number;
  reviewCount: number;
  reviewStats?: ReviewStats;
  tags: string[];
  buyingPrice: number;
  sellingPrice: number;
  websitePrices: WebsitePrices;
  condition: Condition;
  showOnWebsite: boolean;
  stockItems: number; // Available items in stock
  rentedItems: number; // Items currently rented out
  deliveryFee: number;
  deliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  vendorId: string;
  // Backward compatibility
  image?: string;
  price?: number;
  reviews?: number;
  features?: string[];
  specifications?: Record<string, string>;
  stock?: number;
  duration?: string;
  discount?: number;
}

export interface CartItemType {
  id: number;
  productId: string;
  quantity: number;
  product: ProductType;
  duration: number;
  total : number;
  pricePerMonth: number;
}


export interface LocalCartItemType {
  id: string; // Use a unique ID for local cart items
  productId: string;
  quantity: number;
  product: ProductType;
  duration: number;
  total : number;
  pricePerMonth: number;
}
