export  interface ProductType {
    id: string;
    name: string;
    price: number;
    category: string;
    rating: number;
    image: string;
    description: string;
}

export interface CartItem {
    id: number;
    productId: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
  }