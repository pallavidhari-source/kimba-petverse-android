-- Create storage policies for kyc-documents bucket
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own uploaded documents
CREATE POLICY "Users can view their own KYC documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow admins to view all KYC documents
CREATE POLICY "Admins can view all KYC documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' 
  AND has_role(auth.uid(), 'admin')
);