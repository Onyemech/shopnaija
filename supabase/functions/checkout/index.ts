
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

    const { 
      admin_id, 
      customer_id, 
      customer_name, 
      customer_email, 
      customer_phone, 
      order_details, 
      total_amount 
    } = await req.json()

    // Generate order reference
    const orderReference = `GSB-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        admin_id,
        customer_id: customer_id || null,
        customer_name,
        customer_email,
        customer_phone,
        order_details,
        total_amount,
        order_reference: orderReference,
        payment_status: 'pending',
        tracking_status: 'processing'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // If customer is not logged in, create/update customer record
    if (!customer_id && customer_email) {
      await supabase
        .from('users')
        .upsert({
          email: customer_email,
          name: customer_name,
          phone: customer_phone,
          role: 'customer'
        }, { 
          onConflict: 'email'
        })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        order,
        order_reference: orderReference 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in checkout:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
