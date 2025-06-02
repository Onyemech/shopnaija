
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const subdomain = url.searchParams.get('subdomain')
    const search = url.searchParams.get('search')
    const category = url.searchParams.get('category')
    const location = url.searchParams.get('location')

    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name),
        feedback(rating, comment, is_approved)
      `)

    // Filter by admin's subdomain if specified
    if (subdomain) {
      query = query.eq('users.subdomain', subdomain)
      query = query.eq('users.is_active', true)
    }

    // Apply search filters
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    if (category) {
      query = query.eq('category_id', category)
    }
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    const { data: products, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Process products to include approved feedback only
    const processedProducts = products?.map(product => ({
      ...product,
      feedback: product.feedback?.filter((f: any) => f.is_approved) || [],
      average_rating: product.feedback?.length > 0 
        ? product.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / product.feedback.length
        : 0
    }))

    return new Response(
      JSON.stringify(processedProducts || []),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in browse-products:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
