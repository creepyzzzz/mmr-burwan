import { supabase } from '../lib/supabase';

interface SendRejectionEmailParams {
  userEmail: string;
  documentType: string;
  documentName: string;
  rejectionReason: string;
  userName?: string;
}

/**
 * Send rejection email via Supabase Edge Function
 */
export const emailService = {
  async sendRejectionEmail(params: SendRejectionEmailParams): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('send-rejection-email', {
        body: {
          userEmail: params.userEmail,
          documentType: params.documentType,
          documentName: params.documentName,
          rejectionReason: params.rejectionReason,
          userName: params.userName,
        },
      });

      if (error) {
        console.error('Error calling email function:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      if (data?.error) {
        console.error('Email function error:', data.error);
        throw new Error(`Failed to send email: ${data.error}`);
      }

      return;
    } catch (error: any) {
      console.error('Error sending rejection email:', error);
      throw new Error(error.message || 'Failed to send rejection email');
    }
  },
};

