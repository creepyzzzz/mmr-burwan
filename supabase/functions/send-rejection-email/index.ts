import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@mmrburwan.gov.in';

interface RequestBody {
  userEmail: string;
  documentType: string;
  documentName: string;
  rejectionReason: string;
  userName?: string;
}

const getDocumentTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    aadhaar: 'Aadhaar Card',
    tenth_certificate: '10th Certificate',
    voter_id: 'Voter ID',
    id: 'ID Document',
    photo: 'Photo',
    certificate: 'Certificate',
    other: 'Other',
  };
  return labels[type] || type;
};

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const body: RequestBody = await req.json();
    const { userEmail, documentType, documentName, rejectionReason, userName } = body;

    // Validate required fields
    if (!userEmail || !documentType || !rejectionReason) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userEmail, documentType, rejectionReason' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Check if Resend API key is configured
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Email service is not configured' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const documentTypeLabel = getDocumentTypeLabel(documentType);
    const displayName = userName || userEmail.split('@')[0];

    // Prepare email content
    const emailSubject = `Document Rejection Notice - ${documentTypeLabel}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document Rejection Notice</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f5f3f0 0%, #ffffff 100%); padding: 40px 20px; border-radius: 12px; margin-bottom: 20px;">
            <h1 style="color: #92400e; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">MMR Burwan</h1>
            <p style="color: #78716c; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Official Portal</p>
          </div>
          
          <div style="background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Document Rejection Notice</h2>
            
            <p style="color: #4b5563; margin: 0 0 20px 0;">Dear ${displayName},</p>
            
            <p style="color: #4b5563; margin: 0 0 20px 0;">
              We regret to inform you that your uploaded document has been rejected during the review process.
            </p>
            
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #991b1b;">Rejected Document:</p>
              <p style="margin: 0; color: #7f1d1d;">
                <strong>Type:</strong> ${documentTypeLabel}<br>
                <strong>File:</strong> ${documentName}
              </p>
            </div>
            
            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #92400e;">Reason for Rejection:</p>
              <p style="margin: 0; color: #78350f; white-space: pre-wrap;">${rejectionReason}</p>
            </div>
            
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #1e40af;">Next Steps:</p>
              <p style="margin: 0; color: #1e3a8a;">
                Please log in to your account and upload a new document that addresses the issues mentioned above. 
                You can access your documents section from your dashboard.
              </p>
            </div>
            
            <p style="color: #4b5563; margin: 20px 0 0 0;">
              If you have any questions or need assistance, please contact our support team.
            </p>
            
            <p style="color: #4b5563; margin: 20px 0 0 0;">
              Best regards,<br>
              <strong>MMR Burwan Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [userEmail],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send email: ${resendResponse.statusText}`);
    }

    const result = await resendResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.id,
        message: 'Email sent successfully' 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-rejection-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send email',
        details: error.toString() 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});

