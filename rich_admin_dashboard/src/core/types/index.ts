// ============================================================
// Shared TypeScript types — mirrors the backend DB schema
// ============================================================

export interface Profile {
  id: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
  is_active: boolean;
  categories?: Category;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products?: {
    id: string;
    name: string;
    image_url?: string;
  };
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  profiles?: {
    id: string;
    name: string;
  };
  order_items?: OrderItem[];
}

export interface DashboardStats {
  totalOrders: number;
  ordersToday: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  activeProducts: number;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
