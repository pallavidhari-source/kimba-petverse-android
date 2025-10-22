-- Remove admin role from hosurpallavi@gmail.com
DELETE FROM public.user_roles 
WHERE user_id = '8fd234e2-3b60-4248-9f03-b88aa8e46d6d' 
AND role = 'admin';

-- Update the handle_new_user function to automatically assign admin role to pallavidhari@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
  
  -- Assign user role to everyone
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Assign admin role to pallavidhari@gmail.com
  IF LOWER(NEW.email) = 'pallavidhari@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;