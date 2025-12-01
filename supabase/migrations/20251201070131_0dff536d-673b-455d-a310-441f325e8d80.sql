-- Drop the insecure view
DROP VIEW IF EXISTS admin_host_applications;

-- Create a secure function that only admins can use
CREATE OR REPLACE FUNCTION get_host_applications_with_email()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  phone text,
  status host_status,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  kyc_document_url text,
  selfie_url text,
  admin_notes text,
  pet_name text,
  pet_type text,
  pet_gender text,
  available_time_slots text[],
  pet_images_urls text[],
  vaccination_certificate_url text,
  available_dates_slots jsonb,
  user_email text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only allow admins to execute this function
  SELECT 
    ha.id,
    ha.user_id,
    ha.full_name,
    ha.phone,
    ha.status,
    ha.created_at,
    ha.updated_at,
    ha.kyc_document_url,
    ha.selfie_url,
    ha.admin_notes,
    ha.pet_name,
    ha.pet_type,
    ha.pet_gender,
    ha.available_time_slots,
    ha.pet_images_urls,
    ha.vaccination_certificate_url,
    ha.available_dates_slots,
    au.email as user_email
  FROM host_applications ha
  LEFT JOIN auth.users au ON ha.user_id = au.id
  WHERE has_role(auth.uid(), 'admin'::app_role)
  ORDER BY ha.created_at DESC;
$$;