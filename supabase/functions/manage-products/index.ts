
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! }
        }
      }
    )

    const { method, productData, productId } = await req.json()

    // Calculate fees: 3% total (1.5% + ₦100 to Paystack, 1.5% to superadmin)
    if (productData?.price) {
      const paystackFeePercentage = 0.015
      const paystackFixedFee = 100
      const superadminFeePercentage = 0.015

      const paystackFee = (productData.price * paystackFeePercentage) + paystackFixedFee
      const superadminFee = productData.price * superadminFeePercentage
      const adjustedPrice = productData.price + paystackFee + superadminFee

      productData.paystack_fee = paystackFee
      productData.superadmin_fee = superadminFee
      productData.adjusted_price = adjustedPrice
    }

    let result
    if (method === 'CREATE') {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()
      
      if (error) throw error
      result = data
    } else if (method === 'UPDATE') {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select()
        .single()
      
      if (error) throw error
      result = data
    } else if (method === 'DELETE') {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
      
      if (error) throw error
      result = { success: true }
    } else if (method === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      result = data
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in manage-products:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
