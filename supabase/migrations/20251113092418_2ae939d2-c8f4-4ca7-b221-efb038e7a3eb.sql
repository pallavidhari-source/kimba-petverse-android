-- Create pet_products table for shop items
CREATE TABLE IF NOT EXISTS public.pet_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'jacket', 'dress', 'kurta', 'bandana', 'accessories'
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC, -- for showing discounts
  color TEXT NOT NULL,
  material TEXT NOT NULL, -- 'silk_blend', 'cotton', 'velvet', etc
  sizes TEXT[] NOT NULL DEFAULT ARRAY['small', 'medium', 'large'],
  gender TEXT NOT NULL, -- 'male', 'female', 'unisex'
  images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 100,
  rating NUMERIC DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pet_products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view products
CREATE POLICY "Anyone can view products"
  ON public.pet_products
  FOR SELECT
  USING (in_stock = true OR auth.uid() IS NOT NULL);

-- Admin can manage products (using existing has_role function)
CREATE POLICY "Admins can manage products"
  ON public.pet_products
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_pet_products_updated_at
  BEFORE UPDATE ON public.pet_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample ethnic wear products based on fetched data
INSERT INTO public.pet_products (name, category, description, price, original_price, color, material, sizes, gender, images, features) VALUES
-- Jackets
('Blue & Gold Silk Blend Ethnic Jacket', 'jacket', 'Luxurious silk blend ethnic jacket perfect for festive occasions. Features intricate gold patterns on royal blue base.', 34.00, 45.00, 'Blue', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'male', ARRAY['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500'], ARRAY['Handcrafted embroidery', 'Comfortable fit', 'Easy to wear', 'Machine washable']),
('Maroon & Gold Silk Blend Jacket', 'jacket', 'Elegant maroon jacket with golden border detailing. Perfect for weddings and celebrations.', 34.00, 45.00, 'Maroon', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'male', ARRAY['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'], ARRAY['Premium quality', 'Traditional design', 'Lightweight', 'Breathable fabric']),
('Black Woven Silk Blend Ethnic Jacket', 'jacket', 'Sophisticated black jacket with woven silk patterns. A timeless classic for your pet.', 34.00, 42.00, 'Black', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'male', ARRAY['https://images.unsplash.com/photo-1534361960057-19889db9621e?w=500'], ARRAY['Elegant design', 'Durable stitching', 'Comfortable collar', 'Easy maintenance']),
('Pink Woven Silk Blend Ethnic Jacket', 'jacket', 'Charming pink jacket with delicate woven patterns. Perfect for special occasions.', 34.00, 42.00, 'Pink', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'male', ARRAY['https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=500'], ARRAY['Soft fabric', 'Adjustable fit', 'Festive look', 'Premium finish']),
('Cream Floral Printed Cotton Jacket', 'jacket', 'Light cream jacket with beautiful floral prints. Comfortable for all-day wear.', 27.00, 35.00, 'Cream', 'Cotton Blend', ARRAY['small', 'medium', 'large'], 'male', ARRAY['https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=500'], ARRAY['Floral prints', 'Breathable cotton', 'Casual elegance', 'Easy to clean']),
('Royal Red Velvet Ethnic Jacket', 'jacket', 'Rich red velvet jacket with golden embellishments. Perfect for winter festivities.', 38.00, 48.00, 'Red', 'Velvet', ARRAY['small', 'medium', 'large'], 'male', ARRAY['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500'], ARRAY['Warm velvet', 'Festive embroidery', 'Premium buttons', 'Royal look']),

-- Dresses
('Maroon & Gold Silk Blend Dress', 'dress', 'Beautiful silk blend dress with golden border. Perfect for your princess at celebrations.', 34.00, 45.00, 'Maroon', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'female', ARRAY['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500'], ARRAY['Elegant design', 'Comfortable fit', 'Traditional look', 'Easy to wear']),
('Cream Floral Printed Cotton Dress', 'dress', 'Light and airy dress with beautiful floral patterns. Perfect for summer events.', 27.00, 35.00, 'Cream', 'Cotton Blend', ARRAY['small', 'medium', 'large'], 'female', ARRAY['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500'], ARRAY['Floral prints', 'Breathable fabric', 'Lightweight', 'Comfortable straps']),
('Black Woven Silk Blend Dress', 'dress', 'Sophisticated black dress with intricate woven patterns. A statement piece for your pet.', 34.00, 42.00, 'Black', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'female', ARRAY['https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=500'], ARRAY['Premium silk', 'Elegant drape', 'Adjustable straps', 'Party ready']),
('Pink Woven Silk Blend Dress', 'dress', 'Delicate pink dress with beautiful woven details. Perfect for formal occasions.', 34.00, 42.00, 'Pink', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'female', ARRAY['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500'], ARRAY['Soft material', 'Beautiful drape', 'Comfortable fit', 'Photo-perfect']),
('Blue Embroidered Silk Dress', 'dress', 'Stunning blue dress with hand-embroidered details. Make your pet stand out.', 36.00, 46.00, 'Blue', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'female', ARRAY['https://images.unsplash.com/photo-1529472119196-cb724127a98e?w=500'], ARRAY['Hand embroidery', 'Luxury silk', 'Perfect fit', 'Festive ready']),
('Golden Yellow Lehenga Dress', 'dress', 'Traditional yellow lehenga-style dress. Perfect for celebrations and festivals.', 39.00, 50.00, 'Yellow', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'female', ARRAY['https://images.unsplash.com/photo-1514373941175-0a141072bbc8?w=500'], ARRAY['Lehenga style', 'Traditional design', 'Comfortable wear', 'Festive colors']),

-- Kurtas & Sherwanis
('White & Gold Kurta Set', 'kurta', 'Classic white kurta with golden buttons and border. Perfect for traditional events.', 32.00, 42.00, 'White', 'Cotton', ARRAY['small', 'medium', 'large'], 'male', ARRAY['https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500'], ARRAY['Traditional design', 'Comfortable cotton', 'Golden details', 'Formal look']),
('Mint Green Ethnic Kurta', 'kurta', 'Fresh mint green kurta with embroidered collar. Light and comfortable for long events.', 30.00, 40.00, 'Green', 'Cotton', ARRAY['small', 'medium', 'large'], 'male', ARRAY['https://images.unsplash.com/photo-1516222338250-863216ce01ea?w=500'], ARRAY['Soft cotton', 'Embroidered details', 'Breathable', 'Easy care']),
('Royal Purple Sherwani', 'kurta', 'Majestic purple sherwani with intricate patterns. Make your pet look like royalty.', 42.00, 55.00, 'Purple', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'male', ARRAY['https://images.unsplash.com/photo-1548638758-c71de19c93c0?w=500'], ARRAY['Sherwani style', 'Premium silk', 'Detailed work', 'Wedding perfect']),
('Peach Anarkali Kurta', 'kurta', 'Flowing anarkali style kurta in soft peach. Elegant and comfortable for female pets.', 35.00, 45.00, 'Peach', 'Silk Blend', ARRAY['small', 'medium', 'large'], 'female', ARRAY['https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=500'], ARRAY['Anarkali cut', 'Flowy design', 'Elegant drape', 'Party wear']),

-- Bandanas & Accessories
('Red & Gold Festive Bandana', 'bandana', 'Traditional bandana with gold patterns. Quick and easy festive look.', 12.00, 18.00, 'Red', 'Cotton', ARRAY['small', 'medium', 'large'], 'unisex', ARRAY['https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=500'], ARRAY['Easy to wear', 'Adjustable', 'Festive colors', 'Machine washable']),
('Blue Printed Ethnic Bandana', 'bandana', 'Blue bandana with traditional block prints. Perfect for casual ethnic looks.', 12.00, 18.00, 'Blue', 'Cotton', ARRAY['small', 'medium', 'large'], 'unisex', ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500'], ARRAY['Block print design', 'Comfortable fit', 'Versatile', 'Easy care']),
('Golden Collar Necklace', 'accessories', 'Elegant golden collar necklace with bells. Add sparkle to any outfit.', 18.00, 25.00, 'Gold', 'Metal', ARRAY['small', 'medium', 'large'], 'unisex', ARRAY['https://images.unsplash.com/photo-1601758003453-e45e43bb1033?w=500'], ARRAY['Adjustable size', 'Safe clasp', 'Traditional bells', 'Photo ready']),
('Pearl & Ruby Collar', 'accessories', 'Luxurious collar with pearls and ruby accents. Premium accessory for special occasions.', 22.00, 30.00, 'White', 'Metal & Beads', ARRAY['small', 'medium', 'large'], 'female', ARRAY['https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=500'], ARRAY['Handcrafted', 'Premium materials', 'Elegant look', 'Special occasions']);