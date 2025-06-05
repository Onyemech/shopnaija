
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, data } = await req.json();
    
    let subject = '';
    let htmlContent = '';
    
    if (type === 'confirmation') {
      subject = 'Welcome to GrowthSmallBeez - Confirm Your Account';
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00A862; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background: #00A862; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to GrowthSmallBeez!</h1>
            </div>
            <div class="content">
              <h2>Confirm Your Account</h2>
              <p>Hello ${data.name || 'there'},</p>
              <p>Thank you for joining GrowthSmallBeez, Nigeria's premier e-commerce platform!</p>
              <p>To complete your registration and start using your account, please confirm your email address by clicking the button below:</p>
              <a href="${data.confirmationUrl}" class="button">Confirm Your Account</a>
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p>${data.confirmationUrl}</p>
              <p>This link will expire in 24 hours for security reasons.</p>
              <p>If you didn't create an account with us, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>The GrowthSmallBeez Team</p>
              <p><small>© 2024 GrowthSmallBeez. All rights reserved.</small></p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'reset_password') {
      subject = 'Reset Your GrowthSmallBeez Password';
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00A862; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background: #00A862; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hello,</p>
              <p>We received a request to reset your password for your GrowthSmallBeez account.</p>
              <p>Click the button below to create a new password:</p>
              <a href="${data.resetUrl}" class="button">Reset Password</a>
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p>${data.resetUrl}</p>
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>The GrowthSmallBeez Team</p>
              <p><small>© 2024 GrowthSmallBeez. All rights reserved.</small></p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Here you would integrate with SendGrid or another email service
    // For now, return success
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email sent successfully',
      subject,
      email 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
