-- Create allowed emails table
CREATE TABLE IF NOT EXISTS public.allowed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on allowed emails
ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can manage allowed emails" ON public.allowed_emails;

-- Only admins can manage allowed emails
CREATE POLICY "Admins can manage allowed emails"
ON public.allowed_emails
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert the allowed emails
INSERT INTO public.allowed_emails (email) VALUES
  ('pallavidhari@gmail.com'),
  ('shivahosur@gmail.com'),
  ('anvikahosur@gmail.com'),
  ('pallavihosur09@gmail.com'),
  ('hosurpallavi@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Function to check if email is allowed
CREATE OR REPLACE FUNCTION public.is_email_allowed(check_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.allowed_emails
    WHERE LOWER(email) = LOWER(check_email)
  )
$$;

-- Update the handle_new_user trigger to check for allowed emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if email is allowed
  IF NOT public.is_email_allowed(NEW.email) THEN
    RAISE EXCEPTION 'This email is not authorized to access this application';
  END IF;

  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), COALESCE(NEW.raw_user_meta_data->>'phone', ''));
  
  INSERT INTO public.user_wallets (user_id, balance)
  VALUES (NEW.id, 0);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;