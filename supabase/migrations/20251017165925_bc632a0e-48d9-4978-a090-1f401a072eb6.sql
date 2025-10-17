-- Allow users to insert their own host role during signup
CREATE POLICY "Users can insert own host role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role = 'host'
);