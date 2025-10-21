-- Create enum for pet stay types
CREATE TYPE public.pet_stay_type AS ENUM ('commercial', 'individual');

-- Create pet_stays table
CREATE TABLE public.pet_stays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.pet_stay_type NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  price_per_night NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  max_capacity TEXT,
  pet_types TEXT,
  check_in_time TEXT,
  check_out_time TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pet_stays ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view available pet stays
CREATE POLICY "Anyone can view available pet stays"
ON public.pet_stays
FOR SELECT
USING (available = true OR host_id = auth.uid());

-- Policy: Authenticated users can create their own pet stays
CREATE POLICY "Users can create their own pet stays"
ON public.pet_stays
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = host_id);

-- Policy: Hosts can update their own pet stays
CREATE POLICY "Hosts can update their own pet stays"
ON public.pet_stays
FOR UPDATE
TO authenticated
USING (auth.uid() = host_id);

-- Policy: Hosts can delete their own pet stays
CREATE POLICY "Hosts can delete their own pet stays"
ON public.pet_stays
FOR DELETE
TO authenticated
USING (auth.uid() = host_id);

-- Add trigger for updated_at
CREATE TRIGGER update_pet_stays_updated_at
BEFORE UPDATE ON public.pet_stays
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();