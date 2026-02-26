-- ============================================
-- PET WALKERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS pet_walkers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT,
  experience TEXT,
  hourly_rate INTEGER NOT NULL,
  bio TEXT,
  certifications TEXT[] DEFAULT '{}',
  available_slots TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  pet_types TEXT[] DEFAULT '{"Dogs"}',
  languages TEXT[] DEFAULT '{"English"}',
  photo_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  total_walks INTEGER DEFAULT 0,
  availability TEXT DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pet_walkers ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved walkers
CREATE POLICY "Anyone can read approved walkers"
  ON pet_walkers FOR SELECT
  USING (is_approved = TRUE AND is_active = TRUE);

-- Users can insert their own application
CREATE POLICY "Users can apply as walker"
  ON pet_walkers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own walker profile"
  ON pet_walkers FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin can approve walkers (via Supabase dashboard or admin panel)
-- For now, auto-approve all submissions for demo purposes
-- Change is_approved DEFAULT to FALSE in production and approve via admin

-- Sample approved walkers so the page isn't empty on launch
INSERT INTO pet_walkers (
  user_id, full_name, phone, email, state, city, area,
  experience, hourly_rate, bio, certifications, available_slots,
  specialties, pet_types, languages, is_approved, rating,
  reviews_count, total_walks, availability
) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Rahul Sharma', '+91 98765 43210', 'rahul@example.com',
  'Telangana', 'Hyderabad', 'Banjara Hills',
  '3 years', 250,
  'Passionate dog lover certified in pet first aid. GPS tracking on every walk with photo updates every 15 mins.',
  ARRAY['Pet First Aid', 'Canine Behavior Training'],
  ARRAY['Morning (6AM-10AM)', 'Evening (4PM-8PM)'],
  ARRAY['Large Breeds', 'All Breeds'],
  ARRAY['Dogs'], ARRAY['English', 'Hindi', 'Telugu'],
  TRUE, 4.9, 156, 892, 'Available'
),
(
  '00000000-0000-0000-0000-000000000002',
  'Priya Patel', '+91 87654 32109', 'priya@example.com',
  'Telangana', 'Hyderabad', 'Jubilee Hills',
  '2 years', 200,
  'Specialized in small breeds and puppies. Sends walk updates with photos. Gentle and patient approach.',
  ARRAY['Dog Training Certified', 'Pet CPR'],
  ARRAY['Morning (7AM-11AM)', 'Afternoon (2PM-5PM)'],
  ARRAY['Small Dogs', 'Puppies'],
  ARRAY['Dogs', 'Cats'], ARRAY['English', 'Telugu'],
  TRUE, 4.8, 98, 445, 'Available'
),
(
  '00000000-0000-0000-0000-000000000003',
  'Vikram Singh', '+91 54321 09876', 'vikram@example.com',
  'Telangana', 'Hyderabad', 'Madhapur',
  '4 years', 275,
  'Former dog trainer. Every walk includes training elements. Perfect for energetic dogs needing discipline.',
  ARRAY['Certified Trainer', 'Pet First Aid', 'Agility Training'],
  ARRAY['Full Day Available'],
  ARRAY['Active Dogs', 'Training Walks'],
  ARRAY['Dogs'], ARRAY['English', 'Hindi'],
  TRUE, 4.85, 189, 1100, 'Available'
),
(
  '00000000-0000-0000-0000-000000000004',
  'Amit Kumar', '+91 76543 21098', 'amit@example.com',
  'Karnataka', 'Bengaluru', 'Indiranagar',
  '5 years', 300,
  'Top-rated walker in Bengaluru. Expert in senior and special needs dogs. Full walk reports provided.',
  ARRAY['Professional Walker', 'Animal Behavior', 'Pet Nutrition'],
  ARRAY['Evening (5PM-9PM)'],
  ARRAY['All Breeds', 'Senior Dogs', 'Special Needs'],
  ARRAY['Dogs'], ARRAY['English', 'Hindi', 'Kannada'],
  TRUE, 4.95, 234, 1820, 'Busy'
),
(
  '00000000-0000-0000-0000-000000000005',
  'Meera Krishnan', '+91 43210 98765', 'meera@example.com',
  'Karnataka', 'Bengaluru', 'Koramangala',
  '2.5 years', 220,
  'Weekend specialist offering extended park walks. Great for busy working pet parents.',
  ARRAY['Pet Care Certified'],
  ARRAY['Sat & Sun (All Day)'],
  ARRAY['Weekend Walks', 'Park Visits'],
  ARRAY['Dogs', 'Cats'], ARRAY['English', 'Kannada'],
  TRUE, 4.75, 112, 560, 'Weekend Only'
),
(
  '00000000-0000-0000-0000-000000000006',
  'Arjun Nair', '+91 99887 76655', 'arjun@example.com',
  'Maharashtra', 'Mumbai', 'Bandra',
  '3.5 years', 230,
  'Punctual and reliable. Provides live location sharing during walks and detailed post-walk reports.',
  ARRAY['Canine First Aid', 'Dog Behavior'],
  ARRAY['Morning (5AM-10AM)', 'Evening (5PM-9PM)'],
  ARRAY['All Breeds', 'Puppies'],
  ARRAY['Dogs'], ARRAY['English', 'Hindi', 'Malayalam'],
  TRUE, 4.88, 143, 978, 'Available'
),
(
  '00000000-0000-0000-0000-000000000007',
  'Ananya Desai', '+91 88776 65544', 'ananya@example.com',
  'Maharashtra', 'Mumbai', 'Andheri',
  '2 years', 190,
  'Gentle and caring with all pet types. Specializes in small animals with calm enriching walks.',
  ARRAY['Pet First Aid', 'Animal Welfare'],
  ARRAY['Afternoon (12PM-4PM)', 'Evening (5PM-8PM)'],
  ARRAY['Small Dogs', 'Rabbits'],
  ARRAY['Dogs', 'Cats', 'Rabbits'], ARRAY['English', 'Hindi', 'Marathi'],
  TRUE, 4.72, 88, 390, 'Available'
),
(
  '00000000-0000-0000-0000-000000000008',
  'Karthik Rajan', '+91 77665 54433', 'karthik@example.com',
  'Tamil Nadu', 'Chennai', 'Adyar',
  '4 years', 260,
  'Expert in large and energetic breeds. Sends real-time photo updates every 20 minutes.',
  ARRAY['Pro Walker', 'Canine CPR', 'Nutrition'],
  ARRAY['Morning (6AM-9AM)', 'Evening (6PM-9PM)'],
  ARRAY['Large Breeds', 'Active Dogs'],
  ARRAY['Dogs'], ARRAY['English', 'Tamil', 'Telugu'],
  TRUE, 4.92, 201, 1350, 'Available'
);
