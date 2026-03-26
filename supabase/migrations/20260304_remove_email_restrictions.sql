-- Remove email restrictions - allow all signups
-- Only pallavidhari@gmail.com will be granted admin role
-- All other users get regular user role

-- Update the handle_new_user trigger to:
-- 1. Allow all email signups (remove whitelist check)
-- 2. Only assign admin role to pallavidhari@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), COALESCE(NEW.raw_user_meta_data->>'phone', ''));
  
  -- Create wallet for new user
  INSERT INTO public.user_wallets (user_id, balance)
  VALUES (NEW.id, 0);
  
  -- Assign user role to everyone
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Assign admin role ONLY to pallavidhari@gmail.com
  IF LOWER(NEW.email) = 'pallavidhari@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Note: allowed_emails table and is_email_allowed function are no longer used
-- but are kept in the database for reference and future use
