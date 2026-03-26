/**
 * Admin Password Setup Script
 * Sets the admin password to 123456 for pallavidhari@gmail.com
 * 
 * Usage: node scripts/setup-admin.js
 * 
 * Environment variables required:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = 'pallavidhari@gmail.com';
const adminPassword = '123456';

console.log('\n========================================');
console.log('Admin Password Setup - Kimba Petverse');
console.log('========================================\n');

// Validate environment variables
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Error: Missing environment variables\n');
  console.error('Please set these environment variables:');
  console.error('  export SUPABASE_URL="your-supabase-url"');
  console.error('  export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"\n');
  console.error('You can find these in Supabase Dashboard > Project Settings > API\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

async function setupAdmin() {
  try {
    console.log(`🔍 Finding admin user: ${adminEmail}\n`);
    
    // Get all users
    const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
    
    if (fetchError) {
      throw new Error(`Failed to fetch users: ${fetchError.message}`);
    }
    
    // Find the admin user
    const adminUser = users.find(u => u.email === adminEmail);
    
    if (!adminUser) {
      console.error(`\n❌ User not found: ${adminEmail}\n`);
      console.log('User with this email does not exist yet.');
      console.log('Please sign up first on the application with this email.\n');
      process.exit(1);
    }
    
    console.log(`✓ Found admin user:`);
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  ID: ${adminUser.id}\n`);
    
    console.log(`🔐 Setting password to: ${adminPassword}\n`);
    
    // Update password
    const { data, error } = await supabase.auth.admin.updateUserById(adminUser.id, {
      password: adminPassword
    });
    
    if (error) {
      throw new Error(`Failed to update password: ${error.message}`);
    }
    
    console.log(`✓ Password updated successfully!\n`);
    console.log(`✅ Admin Setup Complete!\n`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Admin Login Credentials:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    console.log(`🚀 You can now access:`);
    console.log(`  Admin Dashboard: http://localhost:5173/admin\n`);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

setupAdmin();
