-- ============================================
-- KIMBA PETVERSE - Complete Feature Migration
-- ============================================

-- PETS TABLE (core)
CREATE TABLE IF NOT EXISTS pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL, -- dog, cat, bird, etc.
  breed TEXT,
  date_of_birth DATE,
  weight DECIMAL(5,2),
  weight_unit TEXT DEFAULT 'kg',
  gender TEXT,
  color TEXT,
  microchip_id TEXT,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PET HEALTH RECORDS
CREATE TABLE IF NOT EXISTS health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL, -- vaccination, checkup, medication, surgery, allergy, weight
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  vet_name TEXT,
  vet_clinic TEXT,
  next_due_date DATE,
  cost DECIMAL(10,2),
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FEEDING REMINDERS
CREATE TABLE IF NOT EXISTS feeding_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_name TEXT NOT NULL, -- Breakfast, Lunch, Dinner, Snack
  food_type TEXT,
  quantity TEXT,
  unit TEXT,
  reminder_time TIME NOT NULL,
  days_of_week TEXT[] DEFAULT ARRAY['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FEEDING LOGS
CREATE TABLE IF NOT EXISTS feeding_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reminder_id UUID REFERENCES feeding_reminders(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- COMMUNITY POSTS
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- general, health, training, nutrition, adoption, lost-found
  tags TEXT[],
  image_url TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMMUNITY COMMENTS
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMMUNITY LIKES
CREATE TABLE IF NOT EXISTS community_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- PET CEMETERIES
CREATE TABLE IF NOT EXISTS pet_cemeteries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  pincode TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  services TEXT[], -- burial, cremation, memorial-garden, online-memorial
  description TEXT,
  rating DECIMAL(2,1),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PET MEMORIALS (user-created)
CREATE TABLE IF NOT EXISTS pet_memorials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_name TEXT NOT NULL,
  species TEXT,
  breed TEXT,
  date_of_birth DATE,
  date_of_passing DATE NOT NULL,
  photo_url TEXT,
  tribute TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  candles_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_memorials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users manage own pets" ON pets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own health records" ON health_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own feeding reminders" ON feeding_reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own feeding logs" ON feeding_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read posts" ON community_posts FOR SELECT USING (TRUE);
CREATE POLICY "Users manage own posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read comments" ON community_comments FOR SELECT USING (TRUE);
CREATE POLICY "Users manage own comments" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own likes" ON community_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone reads cemeteries" ON pet_cemeteries FOR SELECT USING (TRUE);
CREATE POLICY "Anyone reads public memorials" ON pet_memorials FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);
CREATE POLICY "Users manage own memorials" ON pet_memorials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own memorials" ON pet_memorials FOR UPDATE USING (auth.uid() = user_id);

-- Sample pet cemetery data
INSERT INTO pet_cemeteries (name, address, city, state, services, description, rating, is_verified) VALUES
('Rainbow Bridge Pet Memorial', '12 Garden Road, Jubilee Hills', 'Hyderabad', 'Telangana', ARRAY['burial','cremation','memorial-garden','online-memorial'], 'A peaceful garden sanctuary for beloved pets with individual burial plots and group cremation services.', 4.8, TRUE),
('Pawsome Rest', '45 Green Valley, Banjara Hills', 'Hyderabad', 'Telangana', ARRAY['cremation','memorial-garden'], 'Dignified cremation and memorial services for your beloved companions.', 4.5, TRUE),
('Furever Home Cemetery', '78 Serene Lane, Koramangala', 'Bengaluru', 'Karnataka', ARRAY['burial','cremation','online-memorial'], 'Beautiful peaceful grounds with personalized memorial stones and tribute gardens.', 4.7, TRUE),
('Pets Paradise Memorial', '23 Harmony Road, Andheri West', 'Mumbai', 'Maharashtra', ARRAY['burial','cremation','memorial-garden'], 'Premium pet memorial services with a lush garden environment.', 4.6, TRUE),
('Eternal Paws', '56 Peaceful Colony, Adyar', 'Chennai', 'Tamil Nadu', ARRAY['cremation','online-memorial'], 'Compassionate cremation and digital memorial services.', 4.4, TRUE);
