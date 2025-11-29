import { supabase } from '../lib/supabase';
import { Certificate } from '../types';

export const certificateService = {
  async getCertificate(userId: string): Promise<Certificate | null> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('issued_on', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      applicationId: data.application_id,
      verificationId: data.verification_id,
      name: data.name,
      issuedOn: data.issued_on,
      pdfUrl: data.pdf_url,
      verified: data.verified || true,
      expiresAt: data.expires_at,
    };
  },

  async getCertificateByVerificationId(verificationId: string): Promise<Certificate | null> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('verification_id', verificationId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      applicationId: data.application_id,
      verificationId: data.verification_id,
      name: data.name,
      issuedOn: data.issued_on,
      pdfUrl: data.pdf_url,
      verified: data.verified || true,
      expiresAt: data.expires_at,
    };
  },

  async getCertificateByCertificateNumber(certificateNumber: string): Promise<any | null> {
    // Find the application by certificate_number with all details
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('certificate_number', certificateNumber)
      .eq('verified', true)
      .maybeSingle();

    if (appError) {
      if (appError.code === 'PGRST116') {
        return null;
      }
      throw new Error(appError.message);
    }

    if (!application || !application.verified) {
      return null;
    }

    // Return full application data
    return {
      certificateNumber: application.certificate_number,
      registrationDate: application.registration_date,
      userDetails: application.user_details,
      partnerForm: application.partner_form,
      userAddress: application.user_address,
      partnerAddress: application.partner_address,
      declarations: application.declarations,
    };
  },

  async issueCertificate(
    userId: string,
    applicationId: string,
    pdfUrl: string
  ): Promise<Certificate> {
    const verificationId = `MMR-BW-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        application_id: applicationId,
        verification_id: verificationId,
        name: 'Marriage Registration Certificate',
        pdf_url: pdfUrl,
        issued_on: new Date().toISOString(),
        verified: true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      userId: data.user_id,
      applicationId: data.application_id,
      verificationId: data.verification_id,
      name: data.name,
      issuedOn: data.issued_on,
      pdfUrl: data.pdf_url,
      verified: data.verified || true,
      expiresAt: data.expires_at,
    };
  },

  async getAllCertificates(): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issued_on', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map((cert) => ({
      id: cert.id,
      userId: cert.user_id,
      applicationId: cert.application_id,
      verificationId: cert.verification_id,
      name: cert.name,
      issuedOn: cert.issued_on,
      pdfUrl: cert.pdf_url,
      verified: cert.verified || true,
      expiresAt: cert.expires_at,
    }));
  },

  async getSignedUrl(certificateId: string): Promise<string> {
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select('pdf_url')
      .eq('id', certificateId)
      .single();

    if (error) {
      throw new Error('Certificate not found');
    }

    // Extract file path from URL
    const url = new URL(certificate.pdf_url);
    const filePath = url.pathname.split('/certificates/')[1];

    if (!filePath) {
      return certificate.pdf_url;
    }

    // Get signed URL (valid for 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('certificates')
      .createSignedUrl(filePath, 3600);

    if (signedUrlError) {
      // Fallback to public URL
      return certificate.pdf_url;
    }

    return signedUrlData.signedUrl;
  },
};
