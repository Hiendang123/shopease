export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  rating: number;
  rating_count: number;
  stock_quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  total_price: number;
  items: OrderItem[];
  shipping_details: ShippingDetails;
  payment_method: 'Credit Card' | 'Cash on Delivery';
}

export type Category = 'All' | 'Electronics' | 'Fashion' | 'Food' | 'Beauty';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}
