export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  price_label?: string; // e.g., "from $4 each" or "$18 pan"
  image_url: string | null;
  stock: number;
  is_available: boolean;
  tag?: string; // e.g., "Seasonal favourite", "Pre-order only"
  tag_emoji?: string; // e.g., "👻", "🌎"
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  preferred_contact: 'instagram' | 'whatsapp' | 'text' | 'email';
  order_details: string;
  allergies?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price_at_time: number;
}

export type OrderStatus = Order['status'];

export interface FeaturedItem {
  id: string;
  emoji: string;
  title: string;
  description: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}
