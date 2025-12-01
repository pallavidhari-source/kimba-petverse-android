-- Create a view for admin to see host applications with user email
CREATE OR REPLACE VIEW admin_host_applications AS
SELECT 
  ha.*,
  au.email as user_email
FROM host_applications ha
LEFT JOIN auth.users au ON ha.user_id = au.id;

-- Grant access to authenticated users
GRANT SELECT ON admin_host_applications TO authenticated;