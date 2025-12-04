-- Cobb's Crumbs Database Schema
-- Run this in your Supabase SQL Editor

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  price_label TEXT, -- Custom price display like "from $4 each"
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  tag TEXT, -- e.g., "Seasonal favourite"
  tag_emoji TEXT, -- e.g., "👻"
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  preferred_contact TEXT NOT NULL DEFAULT 'whatsapp',
  order_details TEXT NOT NULL,
  allergies TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items (optional - for itemized orders)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time DECIMAL(10, 2) NOT NULL
);

-- Featured items (This Week section on homepage)
CREATE TABLE featured_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  emoji TEXT NOT NULL DEFAULT '✨',
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site content (editable text blocks for homepage)
CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT UNIQUE NOT NULL,
  content_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin settings (for simple password auth)
CREATE TABLE admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin password (change this!)
-- Password should be hashed in production, but for simplicity we'll use a simple token approach
INSERT INTO admin_settings (setting_key, setting_value)
VALUES ('admin_password', 'cobbscrumbs2024');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_featured_items_updated_at
  BEFORE UPDATE ON featured_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are editable by service role only"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

-- Policies for orders (public insert, admin read/update)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Orders are viewable by service role only"
  ON orders FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Orders are editable by service role only"
  ON orders FOR UPDATE
  USING (auth.role() = 'service_role');

-- Policies for order_items
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Order items are viewable by service role only"
  ON order_items FOR SELECT
  USING (auth.role() = 'service_role');

-- Policies for featured_items (public read, admin write)
CREATE POLICY "Featured items are viewable by everyone"
  ON featured_items FOR SELECT
  USING (true);

CREATE POLICY "Featured items are editable by service role only"
  ON featured_items FOR ALL
  USING (auth.role() = 'service_role');

-- Policies for site_content (public read, admin write)
CREATE POLICY "Site content is viewable by everyone"
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "Site content is editable by service role only"
  ON site_content FOR ALL
  USING (auth.role() = 'service_role');

-- Policies for admin_settings
CREATE POLICY "Admin settings are accessible by service role only"
  ON admin_settings FOR ALL
  USING (auth.role() = 'service_role');

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Storage policy for product images
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Service role can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Service role can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

CREATE POLICY "Service role can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');

-- Sample products to get started
INSERT INTO products (name, description, price, price_label, stock, is_available, tag, tag_emoji, sort_order) VALUES
('Birthday Sprinkle Truffles (4-pack)', 'Fudgy chocolate truffles rolled in rainbow sprinkles and tucked into a little gift box.', 10.00, '$10', 5, true, 'Taking orders – limited boxes', NULL, 1),
('Earth Day Cupcakes (12-pack)', 'Vanilla cupcakes with blue & green buttercream – perfect for themed parties or classrooms.', 24.00, '$24', 3, true, 'Pre-order only', '🌎', 2),
('Ghost Brownie Squares', 'Gooey chocolate brownies with cute little ghost friends on top. Great for movie nights.', 18.00, '$18 pan', 4, true, 'Seasonal favourite', '👻', 3),
('Little Dessert Tarts', 'Mini tarts dressed up for special dinners and "I just want something pretty" nights.', 4.00, 'from $4 each', 10, true, 'Ask about flavours', '✨', 4);

-- Sample featured items (This Week section)
INSERT INTO featured_items (emoji, title, description, sort_order, is_visible) VALUES
('🎂', 'Birthday sprinkle boxes', 'Perfect for parties or just because', 1, true),
('🌎', 'Earth Day cupcakes', 'Blue & green frosted goodness', 2, true),
('👻', 'Gooey ghost brownies', 'Spooky cute for movie nights', 3, true);

-- Default site content
INSERT INTO site_content (content_key, content_value) VALUES
('site_title', 'Cobb''s Crumbs'),
('tagline', 'cozy bakes • tiny batches • big love'),
('hero_heading', 'Homemade treats for birthdays, movie nights & "just because."'),
('hero_description', 'Emily bakes small-batch goodies from her kitchen – from sprinkle truffle boxes to themed cupcakes and seasonal desserts. Browse the shop and place your order!'),
('hero_note', 'P.S. Allergies or special requests? Let Emily know when you order!'),
('about_title', 'Meet Emily'),
('about_text', 'Cobb''s Crumbs started as "I''ll bring dessert" and turned into "wait, can I order some too?". Emily bakes in tiny batches, experiments with flavours, and loves turning birthdays and random Tuesdays into something a little sweeter.'),
('about_instagram', 'Follow @cobbscrumbs on Instagram to see new treats, kitchen experiments, and last-minute "I have extra!" boxes.'),
('instagram_handle', '@cobbscrumbs'),
('whatsapp_number', '12269244889');
