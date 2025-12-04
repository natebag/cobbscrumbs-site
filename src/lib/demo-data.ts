import { Product, Order, FeaturedItem } from './types';

export function isDemoMode(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !supabaseUrl || supabaseUrl.includes('placeholder');
}

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    name: 'Birthday Sprinkle Truffles (4-pack)',
    description: 'Fudgy chocolate truffles rolled in rainbow sprinkles and tucked into a little gift box.',
    price: 10,
    price_label: '$10',
    image_url: null,
    stock: 5,
    is_available: true,
    tag: 'Taking orders – limited boxes',
    tag_emoji: null,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Earth Day Cupcakes (12-pack)',
    description: 'Vanilla cupcakes with blue & green buttercream – perfect for themed parties or classrooms.',
    price: 24,
    price_label: '$24',
    image_url: null,
    stock: 3,
    is_available: true,
    tag: 'Pre-order only',
    tag_emoji: '🌎',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    name: 'Ghost Brownie Squares',
    description: 'Gooey chocolate brownies with cute little ghost friends on top. Great for movie nights.',
    price: 18,
    price_label: '$18 pan',
    image_url: null,
    stock: 4,
    is_available: true,
    tag: 'Seasonal favourite',
    tag_emoji: '👻',
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    name: 'Little Dessert Tarts',
    description: 'Mini tarts dressed up for special dinners and "I just want something pretty" nights.',
    price: 4,
    price_label: 'from $4 each',
    image_url: null,
    stock: 0,
    is_available: true,
    tag: 'Ask about flavours',
    tag_emoji: '✨',
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_ORDERS: Order[] = [
  {
    id: 'order-1',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah@example.com',
    customer_phone: '555-1234',
    preferred_contact: 'whatsapp',
    order_details: '2x Birthday Sprinkle Truffles (4-pack) for my daughter\'s party on Saturday!',
    allergies: 'Nut-free please',
    notes: 'Pink theme if possible!',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'order-2',
    customer_name: 'Mike Chen',
    customer_email: null,
    customer_phone: '555-5678',
    preferred_contact: 'text',
    order_details: '1x Ghost Brownie Squares for Halloween movie night',
    allergies: null,
    notes: 'Can pick up anytime Friday',
    status: 'confirmed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'order-3',
    customer_name: 'Emily\'s Mom',
    customer_email: 'mom@example.com',
    customer_phone: null,
    preferred_contact: 'email',
    order_details: '1x Earth Day Cupcakes for classroom party',
    allergies: 'No dairy',
    notes: 'Need by April 22nd',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const DEMO_FEATURED: FeaturedItem[] = [
  {
    id: 'featured-1',
    emoji: '🎂',
    title: 'Birthday sprinkle boxes',
    description: 'Perfect for parties or just because',
    sort_order: 1,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'featured-2',
    emoji: '🌎',
    title: 'Earth Day cupcakes',
    description: 'Blue & green frosted goodness',
    sort_order: 2,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'featured-3',
    emoji: '👻',
    title: 'Gooey ghost brownies',
    description: 'Spooky cute for movie nights',
    sort_order: 3,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
