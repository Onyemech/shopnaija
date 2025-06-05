
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const adminData = await req.json()

    // Validate NIN
    const ninValidation = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/validate-nin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nin: adminData.nin })
    })

    const ninResult = await ninValidation.json()
    if (!ninResult.valid) {
      return new Response(
        JSON.stringify({ error: ninResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin user
    const { data: newAdmin, error } = await supabase
      .from('users')
      .insert({
        name: adminData.name,
        phone: adminData.phone,
        email: adminData.email,
        nin: adminData.nin,
        role: 'admin',
        account_name: adminData.account_name,
        account_number: adminData.account_number,
        bank_name: adminData.bank_name,
        logo_url: adminData.logo_url,
        website_name: adminData.website_name,
        subdomain: adminData.subdomain,
        primary_color: adminData.primary_color || '#00A862',
        is_active: adminData.is_active !== false
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Send notification to superadmin
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-push-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient_id: 'superadmin', // Replace with actual superadmin ID
        title: 'New Admin Created',
        body: `Admin ${adminData.name} has been registered`,
        data: { type: 'admin_created' }
      })
    })

    return new Response(
      JSON.stringify({ success: true, admin: newAdmin }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in create-admin:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
