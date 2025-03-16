export interface ProductType {
  id: string;
  name: string;
  price: number;
  category: string
  rating: number
  image: string
  description: string
  reviews?: number
  features?: string[]
  specifications?: Record<string, string>
  stock?: number
  duration?: string 
  discount?: number

}

export interface CartItem {
  id: number;
  productId: string;
  quantity: number;
  product: ProductType;
  duration: number;
}

