#!/bin/bash

# Admin Password Setup Script for Kimba Petverse
# This script will set the admin password to 123456 for pallavidhari@gmail.com

echo "========================================"
echo "Admin Password Setup - Kimba Petverse"
echo "========================================"
echo ""
echo "This script will set the admin password to: 123456"
echo "Admin Email: pallavidhari@gmail.com"
echo ""

# Check if environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Environment variables not set"
    echo ""
    echo "Please set these environment variables first:"
    echo "  export SUPABASE_URL='your-supabase-url'"
    echo "  export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
    echo ""
    echo "You can find these in:"
    echo "  1. Go to Supabase Dashboard"
    echo "  2. Project Settings > API"
    echo "  3. Copy the URL and Service Role Key"
    echo ""
    exit 1
fi

echo "✓ Environment variables found"
echo ""
echo "Setting up admin account..."
echo ""

# Create a Node.js script to update password
cat > /tmp/setup-admin.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = 'pallavidhari@gmail.com';
const adminPassword = '123456';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

async function setupAdmin() {
  try {
    console.log(`🔍 Finding user: ${adminEmail}`);
    
    // Get user by email
    const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();
    
    if (fetchError) throw fetchError;
    
    const adminUser = users.users.find(u => u.email === adminEmail);
    
    if (!adminUser) {
      console.error(`❌ User not found: ${adminEmail}`);
      console.log("Please sign up first with this email");
      process.exit(1);
    }
    
    console.log(`✓ Found user: ${adminUser.id}`);
    console.log(`🔐 Setting password to: ${adminPassword}`);
    
    // Update password
    const { data, error } = await supabase.auth.admin.updateUserById(adminUser.id, {
      password: adminPassword
    });
    
    if (error) throw error;
    
    console.log(`✓ Password updated successfully!`);
    console.log(`\n✅ Admin Setup Complete!`);
    console.log(`\nLogin credentials:`);
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`\nYou can now access the admin dashboard at: /admin`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAdmin();
EOF

# Check if Node.js modules are installed
if [ ! -d "node_modules/@supabase/supabase-js" ]; then
    echo "📦 Installing @supabase/supabase-js..."
    npm install @supabase/supabase-js
fi

echo "🚀 Running setup..."
node /tmp/setup-admin.js

# Cleanup
rm /tmp/setup-admin.js

echo ""
echo "========================================"
