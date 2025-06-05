
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

    const { admin_id, is_active } = await req.json()

    // Update admin status
    const { data, error } = await supabase
      .from('users')
      .update({ is_active })
      .eq('id', admin_id)
      .eq('role', 'admin')
      .select()
      .single()

    if (error) {
      throw error
    }

    // Send notification if deactivated
    if (!is_active) {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-push-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_id: admin_id,
          title: 'Account Deactivated',
          body: 'Your admin account has been deactivated. Contact support for assistance.',
          data: { type: 'admin_deactivated' }
        })
      })
    }

    return new Response(
      JSON.stringify({ success: true, admin: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in update-admin-status:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
