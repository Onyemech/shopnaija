
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${Deno.env.get('CLOUDINARY_CLOUD_NAME')}/image/upload`
    const formData = await req.formData()
    
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file provided')
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG and PNG are allowed.')
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.')
    }

    // Prepare upload data
    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('upload_preset', Deno.env.get('CLOUDINARY_UPLOAD_PRESET') || 'unsigned_preset')
    uploadData.append('transformation', 'c_fit,w_800,h_600')

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: uploadData
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error?.message || 'Upload failed')
    }

    return new Response(
      JSON.stringify({
        image_url: result.secure_url,
        image_public_id: result.public_id,
        thumbnail_url: result.secure_url.replace('/upload/', '/upload/c_thumb,w_300,h_300/')
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in upload-image:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
