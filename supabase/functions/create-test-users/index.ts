
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create superadmin user
    const { data: superAdminAuth, error: superAdminAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: 'superadmin@shopnaija.com',
      password: 'SuperAdmin123!',
      email_confirm: true,
      user_metadata: {
        name: 'Super Admin',
        role: 'superadmin'
      }
    });

    if (superAdminAuthError) {
      console.error('Error creating superadmin auth:', superAdminAuthError);
    } else {
      // Create superadmin profile
      const { error: superAdminProfileError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: superAdminAuth.user.id,
          name: 'Super Admin',
          email: 'superadmin@shopnaija.com',
          role: 'superadmin',
          is_active: true,
          email_verified: true
        });

      if (superAdminProfileError) {
        console.error('Error creating superadmin profile:', superAdminProfileError);
      }
    }

    // Create admin user
    const { data: adminAuth, error: adminAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@teststore.com',
      password: 'Admin123!',
      email_confirm: true,
      user_metadata: {
        name: 'Test Store Admin',
        role: 'admin',
        subdomain: 'teststore',
        website_name: 'Test Store'
      }
    });

    if (adminAuthError) {
      console.error('Error creating admin auth:', adminAuthError);
    } else {
      // Create admin profile
      const { error: adminProfileError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: adminAuth.user.id,
          name: 'Test Store Admin',
          email: 'admin@teststore.com',
          phone: '+2348012345678',
          nin: '12345678901',
          role: 'admin',
          subdomain: 'teststore',
          website_name: 'Test Store',
          primary_color: '#00A862',
          account_name: 'Test Store Account',
          account_number: '1234567890',
          bank_name: 'First Bank',
          is_active: true,
          email_verified: true,
          referral_code: 'TEST123'
        });

      if (adminProfileError) {
        console.error('Error creating admin profile:', adminProfileError);
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Test users created successfully',
        users: [
          {
            role: 'superadmin',
            email: 'superadmin@shopnaija.com',
            password: 'SuperAdmin123!',
            loginUrl: window.location.origin + '/auth'
          },
          {
            role: 'admin',
            email: 'admin@teststore.com',
            password: 'Admin123!',
            subdomain: 'teststore',
            storeUrl: 'https://teststore.shopnaija.com.ng',
            adminUrl: window.location.origin + '/admin/dashboard',
            loginUrl: window.location.origin + '/auth'
          }
        ]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
