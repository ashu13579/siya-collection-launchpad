
-- =============================================
-- SIYA COLLECTION - COMPLETE ECOMMERCE SCHEMA
-- =============================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cod');
CREATE TYPE public.payment_method AS ENUM ('razorpay', 'upi', 'card', 'netbanking', 'cod');
CREATE TYPE public.return_status AS ENUM ('requested', 'approved', 'rejected', 'picked_up', 'refunded');

-- 2. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. SECURITY DEFINER FUNCTION
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 6. PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sku TEXT,
  stock INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  badge TEXT,
  weight_grams INT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);

-- 7. PRODUCT IMAGES
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- 8. PRODUCT VARIANTS
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  price_adjustment NUMERIC(10,2) DEFAULT 0,
  stock INT DEFAULT 0,
  sku TEXT
);
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- 9. ADDRESSES
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 10. COUPONS
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_amount NUMERIC(10,2) DEFAULT 0,
  max_discount NUMERIC(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 11. ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  guest_phone TEXT,
  status order_status DEFAULT 'pending' NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  payment_method payment_method,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_charge NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  gst_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  coupon_id UUID REFERENCES public.coupons(id),
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  gst_number TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  notes TEXT,
  estimated_delivery DATE,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_number ON public.orders(order_number);

-- 12. ORDER ITEMS
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  variant_info TEXT,
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 13. WISHLIST
CREATE TABLE public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- 14. REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_reviews_product ON public.reviews(product_id);

-- 15. RETURNS
CREATE TABLE public.returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  status return_status DEFAULT 'requested' NOT NULL,
  refund_amount NUMERIC(10,2),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;

-- 16. PINCODE SERVICEABILITY
CREATE TABLE public.pincodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pincode TEXT NOT NULL UNIQUE,
  city TEXT,
  state TEXT,
  is_serviceable BOOLEAN DEFAULT true,
  delivery_days INT DEFAULT 5,
  shipping_charge NUMERIC(10,2) DEFAULT 49,
  cod_available BOOLEAN DEFAULT true
);
ALTER TABLE public.pincodes ENABLE ROW LEVEL SECURITY;

-- 17. SITE SETTINGS (admin config like COD toggle)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- USER ROLES
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- CATEGORIES (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- PRODUCTS (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- PRODUCT IMAGES
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage product images" ON public.product_images FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- PRODUCT VARIANTS
CREATE POLICY "Anyone can view variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admins can manage variants" ON public.product_variants FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ADDRESSES
CREATE POLICY "Users can manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- COUPONS
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ORDERS
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- ORDER ITEMS
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL))
);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- WISHLIST
CREATE POLICY "Users can manage own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);

-- REVIEWS
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RETURNS
CREATE POLICY "Users can view own returns" ON public.returns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create returns" ON public.returns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage returns" ON public.returns FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- PINCODES (public read, admin write)
CREATE POLICY "Anyone can check pincodes" ON public.pincodes FOR SELECT USING (true);
CREATE POLICY "Admins can manage pincodes" ON public.pincodes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- SITE SETTINGS
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON public.returns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'SC-' || TO_CHAR(now(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_order_number BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- Auto-deduct stock on order confirmation
CREATE OR REPLACE FUNCTION public.deduct_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    UPDATE public.products SET stock = stock - oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id AND products.id = oi.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER deduct_stock_trigger AFTER UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.deduct_stock_on_order();

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- Seed default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('cod_enabled', 'true'::jsonb),
  ('free_shipping_threshold', '999'::jsonb),
  ('default_shipping_charge', '49'::jsonb),
  ('gst_rate', '18'::jsonb);

-- Seed categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Soft Toys', 'soft-toys', 1),
  ('Remote Control Toys', 'rc-toys', 2),
  ('Educational Toys', 'educational', 3),
  ('Action Figures', 'action-figures', 4),
  ('Collectibles', 'collectibles', 5);
