
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

    const { order_id, email, amount, admin_id, customer_name, customer_phone } = await req.json()

    // Get admin details
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('id', admin_id)
      .single()

    if (adminError || !admin) {
      throw new Error('Admin not found')
    }

    // Generate unique order reference
    const orderReference = `SN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Calculate admin commission (95% goes to admin, 5% to platform)
    const adminAmount = Math.floor(amount * 0.95)
    
    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYSTACK_LIVE_SECRET_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to kobo
        reference: orderReference,
        callback_url: `https://www.shopnaija.com/payment-success?reference=${orderReference}`,
        webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paystack-webhook`,
        metadata: {
          order_id,
          admin_id,
          customer_name,
          customer_phone,
          admin_phone: admin.phone,
          website_name: admin.website_name,
          custom_fields: [
            {
              display_name: "Order Reference",
              variable_name: "order_reference",
              value: orderReference
            },
            {
              display_name: "Store Name",
              variable_name: "store_name", 
              value: admin.website_name
            }
          ]
        },
        // Split payment - 95% to admin, 5% to platform
        split: {
          type: "percentage",
          currency: "NGN",
          subaccounts: admin.account_number ? [
            {
              subaccount: admin.account_number,
              share: 95
            }
          ] : [],
          bearer_type: "all",
          bearer_subaccount: admin.account_number || undefined
        }
      })
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Payment initialization failed')
    }

    // Update order with payment reference
    await supabase
      .from('orders')
      .update({
        order_reference: orderReference,
        payment_status: 'pending',
        customer_name,
        customer_email: email,
        customer_phone,
        total_amount: amount
      })
      .eq('id', order_id)

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: orderReference,
        redirect_url: `https://wa.me/${admin.phone}?text=${encodeURIComponent(
          `Hello! I just completed payment for order ${orderReference} worth ₦${amount.toLocaleString()}. Please confirm and prepare my items for delivery. Customer: ${customer_name}, Phone: ${customer_phone}`
        )}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in process-payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
