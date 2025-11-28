import { supabase } from '../lib/supabase';
import { Application, PartnerDetails, Address, Document } from '../types';

export const applicationService = {
  async getApplication(userId: string): Promise<Application | null> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        documents (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    if (!data) return null;

    return this.mapApplication(data);
  },

  async createDraft(userId: string): Promise<Application> {
    // Check if application already exists
    const existing = await this.getApplication(userId);
    if (existing) {
      return existing;
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        status: 'draft',
        progress: 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapApplication({ ...data, documents: [] });
  },

  async updateDraft(
    userId: string,
    updates: {
      userDetails?: any;
      partnerForm?: PartnerDetails;
      userAddress?: Address;
      userCurrentAddress?: Address;
      partnerAddress?: Address;
      partnerCurrentAddress?: Address;
      address?: Address;
      currentAddress?: Address;
      declarations?: Record<string, boolean | string>; // Allow both boolean and string values
    }
  ): Promise<Application> {
    // Get existing application
    let application = await this.getApplication(userId);
    if (!application) {
      application = await this.createDraft(userId);
    }

    // Calculate progress
    let progress = 0;
    
    // Merge declarations to preserve existing fields like marriageDate
    const mergedDeclarations = updates.declarations 
      ? { ...(application.declarations || {}), ...updates.declarations }
      : application.declarations;
    
    const updatedData: any = {
      user_details: updates.userDetails || application.userDetails,
      partner_form: updates.partnerForm || application.partnerForm,
      user_address: updates.userAddress || application.userAddress,
      user_current_address: updates.userCurrentAddress || application.userCurrentAddress,
      partner_address: updates.partnerAddress || application.partnerAddress,
      partner_current_address: updates.partnerCurrentAddress || application.partnerCurrentAddress,
      address: updates.address || application.address,
      current_address: updates.currentAddress || application.currentAddress,
      declarations: mergedDeclarations,
    };

    if (updatedData.user_details) progress += 20;
    if (updatedData.partner_form) progress += 20;
    if (updatedData.user_address || updatedData.partner_address) progress += 20;
    if (application.documents.length >= 4) progress += 20;
    if (updatedData.declarations) progress += 20;

    updatedData.progress = Math.min(progress, 100);

    const { data, error } = await supabase
      .from('applications')
      .update(updatedData)
      .eq('id', application.id)
      .select(`
        *,
        documents (*)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapApplication(data);
  },

  async submitApplication(userId: string): Promise<Application> {
    const application = await this.getApplication(userId);
    if (!application) {
      throw new Error('Application not found');
    }

    const { data, error } = await supabase
      .from('applications')
      .update({
        status: 'submitted',
        progress: 100,
        submitted_at: new Date().toISOString(),
      })
      .eq('id', application.id)
      .select(`
        *,
        documents (*)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapApplication(data);
  },

  async getAllApplications(): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        documents (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map((app) => this.mapApplication(app));
  },

  // Helper to map database row to Application type
  mapApplication(data: any): Application {
    return {
      id: data.id,
      userId: data.user_id,
      status: data.status,
      progress: data.progress || 0,
      userDetails: data.user_details,
      partnerForm: data.partner_form,
      userAddress: data.user_address,
      userCurrentAddress: data.user_current_address,
      partnerAddress: data.partner_address,
      partnerCurrentAddress: data.partner_current_address,
      address: data.address,
      currentAddress: data.current_address,
      declarations: data.declarations,
      documents: (data.documents || []).map((doc: any) => ({
        id: doc.id,
        applicationId: doc.application_id,
        type: doc.type,
        name: doc.name,
        url: doc.url,
        status: doc.status,
        uploadedAt: doc.uploaded_at,
        size: doc.size,
        mimeType: doc.mime_type,
        belongsTo: doc.belongs_to,
      })) as Document[],
      verified: data.verified || false,
      verifiedAt: data.verified_at,
      verifiedBy: data.verified_by,
      certificateNumber: data.certificate_number,
      registrationDate: data.registration_date,
      submittedAt: data.submitted_at,
      lastUpdated: data.last_updated || data.updated_at,
    };
  },
};
