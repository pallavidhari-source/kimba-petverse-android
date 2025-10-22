-- Remove the insecure UPDATE policy on user_wallets table
-- Users should not be able to directly update their wallet balance
-- All wallet updates must go through the secure update_wallet_balance() function

DROP POLICY IF EXISTS "Users can update own wallet" ON public.user_wallets;