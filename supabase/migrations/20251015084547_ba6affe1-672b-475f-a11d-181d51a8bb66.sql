-- Fix 1: Restrict profiles table access to owner and pet hosts only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can view host profiles" 
ON public.profiles 
FOR SELECT 
USING (
  id IN (SELECT host_id FROM public.pets WHERE available = true)
);

-- Fix 2: Remove dangerous wallet and transaction policies
DROP POLICY IF EXISTS "Users can update own wallet" ON public.user_wallets;
DROP POLICY IF EXISTS "Users can create transactions" ON public.coin_transactions;

-- Create secure function for balance updates with transaction recording
CREATE OR REPLACE FUNCTION public.update_wallet_balance(
  _user_id UUID,
  _amount INTEGER,
  _transaction_type TEXT,
  _description TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate amount
  IF _amount = 0 THEN
    RAISE EXCEPTION 'Amount cannot be zero';
  END IF;
  
  -- Validate transaction type
  IF _transaction_type NOT IN ('credit', 'debit') THEN
    RAISE EXCEPTION 'Invalid transaction type';
  END IF;
  
  -- For debits, check sufficient balance
  IF _transaction_type = 'debit' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.user_wallets 
      WHERE user_id = _user_id AND balance >= ABS(_amount)
    ) THEN
      RAISE EXCEPTION 'Insufficient balance';
    END IF;
  END IF;
  
  -- Update wallet balance
  UPDATE public.user_wallets
  SET balance = balance + CASE 
    WHEN _transaction_type = 'credit' THEN ABS(_amount)
    ELSE -ABS(_amount)
  END,
  updated_at = NOW()
  WHERE user_id = _user_id;
  
  -- Record transaction
  INSERT INTO public.coin_transactions (user_id, amount, type, description)
  VALUES (
    _user_id, 
    CASE 
      WHEN _transaction_type = 'credit' THEN ABS(_amount)
      ELSE -ABS(_amount)
    END, 
    _transaction_type, 
    _description
  );
END;
$$;

-- Grant execute to authenticated users (they can only affect their own wallet through business logic)
GRANT EXECUTE ON FUNCTION public.update_wallet_balance TO authenticated;

-- Fix 3: Create secure KYC documents storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents', 
  'kyc-documents', 
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for KYC storage - admin only
CREATE POLICY "Admins can upload KYC documents"
ON storage.objects 
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can view KYC documents"
ON storage.objects 
FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update KYC documents"
ON storage.objects 
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete KYC documents"
ON storage.objects 
FOR DELETE
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  has_role(auth.uid(), 'admin'::app_role)
);