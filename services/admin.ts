import { applicationService } from './application';
import { documentService } from './documents';
import { auditService } from './audit';
import { notificationService } from './notifications';
import { emailService } from './email';
import { supabase } from '../lib/supabase';
import { Application } from '../types';

export const adminService = {
  async getAllApplications(): Promise<Application[]> {
    return applicationService.getAllApplications();
  },

  async approveApplication(applicationId: string, actorId: string, actorName: string): Promise<Application> {
    // Update application status
    const { data, error } = await supabase
      .from('applications')
      .update({ status: 'approved' })
      .eq('id', applicationId)
      .select(`
        *,
        documents (*)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Create audit log
    await auditService.createLog({
      actorId,
      actorName,
      actorRole: 'admin',
      action: 'application_approved',
      resourceType: 'application',
      resourceId: applicationId,
    });

    return applicationService.mapApplication(data);
  },

  async rejectApplication(applicationId: string, reason: string, actorId: string, actorName: string): Promise<Application> {
    // Update application status
    const { data, error } = await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId)
      .select(`
        *,
        documents (*)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Create audit log
    await auditService.createLog({
      actorId,
      actorName,
      actorRole: 'admin',
      action: 'application_rejected',
      resourceType: 'application',
      resourceId: applicationId,
      details: { reason },
    });

    return applicationService.mapApplication(data);
  },

  async approveDocument(documentId: string, actorId: string, actorName: string): Promise<void> {
    await documentService.approveDocument(documentId);
    
    await auditService.createLog({
      actorId,
      actorName,
      actorRole: 'admin',
      action: 'document_approved',
      resourceType: 'document',
      resourceId: documentId,
    });
  },

  async rejectDocument(
    documentId: string,
    reason: string,
    actorId: string,
    actorName: string,
    sendEmail: boolean = false,
    userEmail?: string
  ): Promise<void> {
    // Get document details first
    const { data: documentData, error: docError } = await supabase
      .from('documents')
      .select('*, applications!inner(user_id, user_details)')
      .eq('id', documentId)
      .single();

    if (docError || !documentData) {
      throw new Error('Document not found');
    }

    const application = documentData.applications as any;
    const userId = application.user_id;
    const document = documentData;

    // Reject the document
    await documentService.rejectDocument(documentId);

    // Get document type label
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

    const documentTypeLabel = getDocumentTypeLabel(document.type);

    // Get person label (groom/bride/joint)
    const getPersonLabel = (belongsTo?: string): string => {
      if (!belongsTo) return '';
      switch (belongsTo) {
        case 'user':
          return 'Groom\'s';
        case 'partner':
          return 'Bride\'s';
        case 'joint':
          return 'Joint';
        default:
          return '';
      }
    };

    const personLabel = getPersonLabel(document.belongs_to);
    const documentTitle = personLabel 
      ? `${personLabel} ${documentTypeLabel}`
      : documentTypeLabel;

    // Create notification (wrap in try-catch to prevent failure from blocking rejection)
    try {
      await notificationService.createNotification({
        userId,
        applicationId: document.application_id,
        documentId,
        type: 'document_rejected',
        title: `Document Rejected: ${documentTitle}`,
        message: reason,
      });
    } catch (notificationError: any) {
      // Log error but don't fail the rejection - notification is not critical
      console.error('Failed to create notification:', notificationError);
      // Note: We continue with the rejection even if notification creation fails
      // The document rejection is more important than the notification
    }

    // Send email if requested
    if (sendEmail && userEmail) {
      try {
        const userDetails = application.user_details as any;
        const userName = userDetails?.firstName 
          ? `${userDetails.firstName} ${userDetails.lastName || ''}`.trim()
          : undefined;

        await emailService.sendRejectionEmail({
          userEmail,
          documentType: document.type,
          documentName: document.name,
          rejectionReason: reason,
          userName,
        });
      } catch (emailError) {
        // Log error but don't fail the rejection
        console.error('Failed to send rejection email:', emailError);
      }
    }

    // Create audit log
    await auditService.createLog({
      actorId,
      actorName,
      actorRole: 'admin',
      action: 'document_rejected',
      resourceType: 'document',
      resourceId: documentId,
      details: { reason, emailSent: sendEmail },
    });
  },

  async verifyApplication(
    applicationId: string,
    actorId: string,
    actorName: string,
    certificateNumber: string,
    registrationDate: string
  ): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
        verified_by: actorId,
        certificate_number: certificateNumber,
        registration_date: registrationDate,
      })
      .eq('id', applicationId)
      .select(`
        *,
        documents (*)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    await auditService.createLog({
      actorId,
      actorName,
      actorRole: 'admin',
      action: 'application_verified',
      resourceType: 'application',
      resourceId: applicationId,
      details: { certificateNumber, registrationDate },
    });

    return applicationService.mapApplication(data);
  },

  async unverifyApplication(applicationId: string, actorId: string, actorName: string): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .update({
        verified: false,
        verified_at: null,
        verified_by: null,
      })
      .eq('id', applicationId)
      .select(`
        *,
        documents (*)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    await auditService.createLog({
      actorId,
      actorName,
      actorRole: 'admin',
      action: 'application_unverified',
      resourceType: 'application',
      resourceId: applicationId,
    });

    return applicationService.mapApplication(data);
  },

  async updateApplication(
    applicationId: string,
    updates: {
      userDetails?: any;
      partnerForm?: any;
      userAddress?: any;
      userCurrentAddress?: any;
      partnerAddress?: any;
      partnerCurrentAddress?: any;
      declarations?: Record<string, boolean | string>; // Allow both boolean and string values (for marriageDate)
    },
    actorId: string,
    actorName: string
  ): Promise<Application> {
    const updatedData: any = {};
    
    if (updates.userDetails) updatedData.user_details = updates.userDetails;
    if (updates.partnerForm) updatedData.partner_form = updates.partnerForm;
    if (updates.userAddress) updatedData.user_address = updates.userAddress;
    if (updates.userCurrentAddress) updatedData.user_current_address = updates.userCurrentAddress;
    if (updates.partnerAddress) updatedData.partner_address = updates.partnerAddress;
    if (updates.partnerCurrentAddress) updatedData.partner_current_address = updates.partnerCurrentAddress;
    if (updates.declarations) updatedData.declarations = updates.declarations;

    updatedData.last_updated = new Date().toISOString();

    const { data, error } = await supabase
      .from('applications')
      .update(updatedData)
      .eq('id', applicationId)
      .select(`
        *,
        documents (*)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    await auditService.createLog({
      actorId,
      actorName,
      actorRole: 'admin',
      action: 'application_updated',
      resourceType: 'application',
      resourceId: applicationId,
      details: { updatedFields: Object.keys(updatedData) },
    });

    return applicationService.mapApplication(data);
  },
};
