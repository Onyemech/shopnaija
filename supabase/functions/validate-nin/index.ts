
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NINRequest {
  nin: string;
}

interface NINResponse {
  valid: boolean;
  error?: string;
}

function validateNIN(nin: string): { valid: boolean; error?: string } {
  // Remove any spaces or dashes
  const cleanNIN = nin.replace(/[\s-]/g, '');
  
  // Check if it's exactly 11 digits
  if (!/^\d{11}$/.test(cleanNIN)) {
    return {
      valid: false,
      error: "NIN must be exactly 11 digits"
    };
  }
  
  // Additional validation could be added here
  // For now, we just check the format
  
  return { valid: true };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nin }: NINRequest = await req.json();
    
    if (!nin) {
      return new Response(
        JSON.stringify({ valid: false, error: "NIN is required" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const validationResult = validateNIN(nin);
    
    return new Response(
      JSON.stringify(validationResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: validationResult.valid ? 200 : 400
      }
    );
    
  } catch (error) {
    console.error('NIN validation error:', error);
    
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: "Internal server error during NIN validation" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
