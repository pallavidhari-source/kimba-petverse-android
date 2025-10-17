-- Add 'host' to the app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'host';

-- Update host_applications table to include pet details and time slots
ALTER TABLE public.host_applications
ADD COLUMN IF NOT EXISTS pet_name TEXT,
ADD COLUMN IF NOT EXISTS pet_type TEXT,
ADD COLUMN IF NOT EXISTS pet_gender TEXT,
ADD COLUMN IF NOT EXISTS available_time_slots TEXT[],
ADD COLUMN IF NOT EXISTS pet_images_urls TEXT[],
ADD COLUMN IF NOT EXISTS vaccination_certificate_url TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_host_applications_status ON public.host_applications(status);
CREATE INDEX IF NOT EXISTS idx_host_applications_user_id ON public.host_applications(user_id);

-- Update RLS policies for host_applications
DROP POLICY IF EXISTS "Admins can view all applications" ON public.host_applications;
CREATE POLICY "Admins can view all applications" 
ON public.host_applications 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Create index on bookings for admin viewing
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);