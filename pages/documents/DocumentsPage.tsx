import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/application';
import { documentService } from '../../services/documents';
import { notificationService } from '../../services/notifications';
import { useNotification } from '../../contexts/NotificationContext';
import { Document, Application, Notification } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Upload, FileText, AlertCircle, ArrowLeft, XCircle, Info, UploadCloud, Eye, Download, X } from 'lucide-react';
import { safeFormatDate } from '../../utils/dateUtils';

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [rejectedDocuments, setRejectedDocuments] = useState<Document[]>([]);
  const [rejectionNotifications, setRejectionNotifications] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingDocumentId, setUploadingDocumentId] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Map<string, File>>(new Map());
  const [selectedReuploadFiles, setSelectedReuploadFiles] = useState<Map<string, File>>(new Map()); // For rejected doc re-uploads
  const [isUploading, setIsUploading] = useState(false);
  const [isReuploadingAll, setIsReuploadingAll] = useState(false);

  // Document type keys for tracking selected files
  const documentTypes = {
    userAadhaar: 'user-aadhaar',
    userSecondDoc: 'user-second-doc',
    partnerAadhaar: 'partner-aadhaar',
    partnerSecondDoc: 'partner-second-doc',
    jointPhoto: 'joint-photo',
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    const loadData = async () => {
      try {
        const app = await applicationService.getApplication(user.id);
        if (app) {
          setApplication(app);
          setApplicationId(app.id);
          const docs = await documentService.getDocuments(app.id);
          setDocuments(docs);

          // Find rejected documents
          const rejected = docs.filter((d) => d.status === 'rejected');
          setRejectedDocuments(rejected);

          // Load rejection notifications
          if (rejected.length > 0) {
            try {
              const notifications = await notificationService.getNotifications(user.id);
              const rejectionMap = new Map<string, string>();
              
              notifications
                .filter((n) => n.type === 'document_rejected' && n.documentId)
                .forEach((n) => {
                  if (n.documentId) {
                    rejectionMap.set(n.documentId, n.message);
                  }
                });
              
              setRejectionNotifications(rejectionMap);
            } catch (error) {
              console.error('Failed to load rejection notifications:', error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  const handleFileSelection = (file: File, type: string, belongsTo: 'user' | 'partner' | 'joint', docType: 'aadhaar' | 'tenth_certificate' | 'voter_id' | 'photo') => {
    // Store the selected file with its type key
    setSelectedFiles(prev => {
      const newMap = new Map(prev);
      newMap.set(type, file);
      return newMap;
    });
  };

  const handleRemoveSelectedFile = (type: string) => {
    setSelectedFiles(prev => {
      const newMap = new Map(prev);
      newMap.delete(type);
      return newMap;
    });
  };

  const handleSubmitDocuments = async () => {
    if (!applicationId) {
      showToast('Please start an application first', 'error');
      navigate('/application');
      return;
    }

    if (selectedFiles.size === 0) {
      showToast('Please select at least one document to upload', 'error');
      return;
    }

    setIsUploading(true);
    try {
      // Upload files with their proper types and belongsTo
      const uploadPromises: Array<{ file: File; type: 'aadhaar' | 'tenth_certificate' | 'voter_id' | 'photo'; belongsTo: 'user' | 'partner' | 'joint' }> = [];

      // Groom's Aadhaar
      if (selectedFiles.has(documentTypes.userAadhaar)) {
        uploadPromises.push({
          file: selectedFiles.get(documentTypes.userAadhaar)!,
          type: 'aadhaar',
          belongsTo: 'user',
        });
      }

      // Groom's Second Doc (10th Certificate or Voter ID)
      if (selectedFiles.has(documentTypes.userSecondDoc)) {
        const file = selectedFiles.get(documentTypes.userSecondDoc)!;
        const fileName = file.name.toLowerCase();
        const type = fileName.includes('voter') || fileName.includes('voterid') ? 'voter_id' : 'tenth_certificate';
        uploadPromises.push({
          file,
          type,
          belongsTo: 'user',
        });
      }

      // Bride's Aadhaar
      if (selectedFiles.has(documentTypes.partnerAadhaar)) {
        uploadPromises.push({
          file: selectedFiles.get(documentTypes.partnerAadhaar)!,
          type: 'aadhaar',
          belongsTo: 'partner',
        });
      }

      // Bride's Second Doc (10th Certificate or Voter ID)
      if (selectedFiles.has(documentTypes.partnerSecondDoc)) {
        const file = selectedFiles.get(documentTypes.partnerSecondDoc)!;
        const fileName = file.name.toLowerCase();
        const type = fileName.includes('voter') || fileName.includes('voterid') ? 'voter_id' : 'tenth_certificate';
        uploadPromises.push({
          file,
          type,
          belongsTo: 'partner',
        });
      }

      // Joint Photo
      if (selectedFiles.has(documentTypes.jointPhoto)) {
        uploadPromises.push({
          file: selectedFiles.get(documentTypes.jointPhoto)!,
          type: 'photo',
          belongsTo: 'joint',
        });
      }

      // Upload all files
      for (const { file, type, belongsTo } of uploadPromises) {
        try {
          await documentService.uploadDocument(applicationId, file, type, belongsTo);
        } catch (error: any) {
          showToast(`Failed to upload ${file.name}: ${error.message}`, 'error');
          // Continue with other files even if one fails
        }
      }

      // Clear selected files after successful upload
      setSelectedFiles(new Map());
      showToast('Documents uploaded successfully', 'success');

      // Refresh documents
      const updated = await documentService.getDocuments(applicationId);
      setDocuments(updated);
      
      // Update rejected documents list
      const rejected = updated.filter((d) => d.status === 'rejected');
      setRejectedDocuments(rejected);
      
      // Reload notifications if there are rejected documents
      if (rejected.length > 0 && user) {
        try {
          const notifications = await notificationService.getNotifications(user.id);
          const rejectionMap = new Map<string, string>();
          
          notifications
            .filter((n) => n.type === 'document_rejected' && n.documentId)
            .forEach((n) => {
              if (n.documentId) {
                rejectionMap.set(n.documentId, n.message);
              }
            });
          
          setRejectionNotifications(rejectionMap);
        } catch (error) {
          console.error('Failed to reload rejection notifications:', error);
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to upload documents', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Select a file for re-upload (doesn't upload immediately)
  const handleSelectReuploadFile = (documentId: string, file: File) => {
    setSelectedReuploadFiles(prev => {
      const newMap = new Map(prev);
      newMap.set(documentId, file);
      return newMap;
    });
  };

  // Remove a selected re-upload file
  const handleRemoveReuploadFile = (documentId: string) => {
    setSelectedReuploadFiles(prev => {
      const newMap = new Map(prev);
      newMap.delete(documentId);
      return newMap;
    });
  };

  // Submit all selected re-upload files
  const handleSubmitReuploadFiles = async () => {
    if (!applicationId) {
      showToast('Please start an application first', 'error');
      return;
    }

    if (selectedReuploadFiles.size === 0) {
      showToast('Please select at least one document to re-upload', 'error');
      return;
    }

    setIsReuploadingAll(true);
    try {
      // Upload each selected file
      for (const [documentId, file] of selectedReuploadFiles.entries()) {
        try {
          await documentService.replaceRejectedDocument(documentId, file);
        } catch (error: any) {
          showToast(`Failed to replace document: ${error.message}`, 'error');
        }
      }

      showToast('Documents replaced successfully', 'success');
      
      // Clear selected files
      setSelectedReuploadFiles(new Map());
      
      // Refresh documents
      const updated = await documentService.getDocuments(applicationId);
      setDocuments(updated);
      
      // Update rejected documents list
      const rejected = updated.filter((d) => d.status === 'rejected');
      setRejectedDocuments(rejected);
      
      // Reload notifications
      if (user) {
        try {
          const notifications = await notificationService.getNotifications(user.id);
          const rejectionMap = new Map<string, string>();
          
          notifications
            .filter((n) => n.type === 'document_rejected' && n.documentId)
            .forEach((n) => {
              if (n.documentId) {
                rejectionMap.set(n.documentId, n.message);
              }
            });
          
          setRejectionNotifications(rejectionMap);
        } catch (error) {
          console.error('Failed to reload rejection notifications:', error);
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to replace documents', 'error');
    } finally {
      setIsReuploadingAll(false);
    }
  };

  const handleRemove = async (documentId: string) => {
    // Prevent deletion if application is submitted
    if (isApplicationSubmitted) {
      showToast('Cannot delete documents after application submission. Please contact admin if needed.', 'error');
      return;
    }

    try {
      await documentService.deleteDocument(documentId);
      setDocuments(documents.filter((d) => d.id !== documentId));
      showToast('Document removed', 'success');
    } catch (error) {
      showToast('Failed to remove document', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!applicationId) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="p-8 text-center">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">No Application Found</h2>
          <p className="text-gray-600 mb-6">
            Please start an application before uploading documents.
          </p>
          <Button variant="primary" onClick={() => navigate('/application')}>
            Start Application
          </Button>
        </Card>
      </div>
    );
  }

  // Check if upload should be enabled
  // Upload is enabled if: application is not submitted OR there are rejected documents
  const isUploadEnabled = !application || 
    (application.status !== 'submitted' && 
     application.status !== 'under_review' && 
     application.status !== 'approved') ||
    rejectedDocuments.length > 0;

  // Check if application is submitted - users cannot delete documents after submission
  const isApplicationSubmitted = application && 
    (application.status === 'submitted' || 
     application.status === 'under_review' || 
     application.status === 'approved');

  const getDocumentTypeLabel = (type: string) => {
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

  const getFullDocumentLabel = (doc: Document): string => {
    const typeLabel = getDocumentTypeLabel(doc.type);
    const personLabel = getPersonLabel(doc.belongsTo);
    return personLabel ? `${personLabel} ${typeLabel}` : typeLabel;
  };

  const isImage = (mimeType: string): boolean => {
    return mimeType?.startsWith('image/') || false;
  };

  const isPDF = (mimeType: string): boolean => {
    return mimeType === 'application/pdf' || false;
  };

  const handlePreviewDocument = async (doc: Document) => {
    setPreviewDocument(doc);
    setIsLoadingPreview(true);
    setPreviewUrl(null);
    try {
      // Try to get signed URL for better security
      const signedUrl = await documentService.getSignedUrl(doc.id);
      setPreviewUrl(signedUrl);
    } catch (error: any) {
      console.error('Failed to get signed URL:', error);
      // Fallback to original URL
      setPreviewUrl(doc.url);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const closePreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewDocument(null);
    setPreviewUrl(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex-shrink-0"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </div>
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Upload Documents</h1>
        <p className="text-gray-600">Upload all required documents for your marriage registration</p>
      </div>

      {/* Rejection Instructions with Individual Upload */}
      {rejectedDocuments.length > 0 && (
        <Card className="p-6 mb-6 bg-rose-50 border-rose-200">
          <div className="flex items-start gap-3 mb-4">
            <XCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-rose-900 mb-2">
                Documents Requiring Re-upload
              </h3>
              <p className="text-sm text-rose-800 mb-4">
                The following documents have been rejected. Please review the reasons and select new files, then click "Submit Documents" to upload them.
              </p>
              <div className="space-y-4">
                {rejectedDocuments.map((doc) => {
                  const rejectionReason = rejectionNotifications.get(doc.id);
                  const selectedFile = selectedReuploadFiles.get(doc.id);
                  return (
                    <div key={doc.id} className="bg-white p-5 rounded-xl border border-rose-200">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">
                              {getFullDocumentLabel(doc)}
                            </p>
                            <Badge variant="error" size="sm">Rejected</Badge>
                          </div>
                          <p className="text-xs text-gray-600">{doc.name}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreviewDocument(doc)}
                            title="Preview"
                          >
                            <Eye size={16} />
                          </Button>
                        </div>
                      </div>
                      {rejectionReason && (
                        <div className="mb-4 p-3 bg-rose-50 rounded-lg border border-rose-100">
                          <p className="text-xs font-medium text-rose-900 mb-1">Rejection Reason:</p>
                          <p className="text-xs text-rose-800 whitespace-pre-wrap line-clamp-3">
                            {rejectionReason}
                          </p>
                        </div>
                      )}
                      <div className="mt-4">
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleSelectReuploadFile(doc.id, file);
                              }
                            }}
                            className="hidden"
                            id={`reupload-${doc.id}`}
                            disabled={isReuploadingAll}
                          />
                          <label
                            htmlFor={`reupload-${doc.id}`}
                            className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer ${
                              isReuploadingAll 
                                ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                                : 'hover:bg-gray-50 bg-white'
                            }`}
                          >
                            <Upload size={18} />
                            <span className="text-sm">Choose File</span>
                          </label>
                          {selectedFile && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText size={16} />
                              <span>{selectedFile.name}</span>
                              <button
                                onClick={() => handleRemoveReuploadFile(doc.id)}
                                className="text-rose-600 hover:text-rose-700 p-1"
                                title="Remove"
                                disabled={isReuploadingAll}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Button for Re-uploads */}
              {selectedReuploadFiles.size > 0 && (
                <div className="mt-6 pt-4 border-t border-rose-200 flex justify-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmitReuploadFiles}
                    disabled={isReuploadingAll}
                    className="min-w-[200px]"
                  >
                    {isReuploadingAll ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={20} className="mr-2" />
                        Submit Documents
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Main Upload Section - Only show if no rejected documents */}
      {rejectedDocuments.length === 0 && isUploadEnabled && (
        <Card className="p-6 mb-8">
          <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">Upload Documents</h2>
          
          {/* Groom's Documents */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Groom's Documents</h3>
            <p className="text-sm text-gray-600 mb-4">Upload groom's Aadhaar card and either 10th class certificate or Voter ID</p>
            
            <div className="space-y-4">
              {/* Groom's Aadhaar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Card <span className="text-rose-600">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelection(file, documentTypes.userAadhaar, 'user', 'aadhaar');
                    }}
                    className="hidden"
                    id="user-aadhaar"
                    disabled={!isUploadEnabled}
                  />
                  <label
                    htmlFor="user-aadhaar"
                    className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer ${
                      !isUploadEnabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Upload size={18} />
                    <span>Choose File</span>
                  </label>
                  {selectedFiles.has(documentTypes.userAadhaar) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText size={16} />
                      <span>{selectedFiles.get(documentTypes.userAadhaar)!.name}</span>
                      <button
                        onClick={() => handleRemoveSelectedFile(documentTypes.userAadhaar)}
                        className="text-rose-600 hover:text-rose-700 p-1"
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Groom's Second Document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  10th Class Certificate or Voter ID <span className="text-rose-600">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const fileName = file.name.toLowerCase();
                        const type = fileName.includes('voter') || fileName.includes('voterid') ? 'voter_id' : 'tenth_certificate';
                        handleFileSelection(file, documentTypes.userSecondDoc, 'user', type);
                      }
                    }}
                    className="hidden"
                    id="user-second-doc"
                    disabled={!isUploadEnabled}
                  />
                  <label
                    htmlFor="user-second-doc"
                    className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer ${
                      !isUploadEnabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Upload size={18} />
                    <span>Choose File</span>
                  </label>
                  {selectedFiles.has(documentTypes.userSecondDoc) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText size={16} />
                      <span>{selectedFiles.get(documentTypes.userSecondDoc)!.name}</span>
                      <button
                        onClick={() => handleRemoveSelectedFile(documentTypes.userSecondDoc)}
                        className="text-rose-600 hover:text-rose-700 p-1"
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bride's Documents */}
          <div className="mb-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Bride's Documents</h3>
            <p className="text-sm text-gray-600 mb-4">Upload bride's Aadhaar card and either 10th class certificate or Voter ID</p>
            
            <div className="space-y-4">
              {/* Bride's Aadhaar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Card <span className="text-rose-600">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelection(file, documentTypes.partnerAadhaar, 'partner', 'aadhaar');
                    }}
                    className="hidden"
                    id="partner-aadhaar"
                    disabled={!isUploadEnabled}
                  />
                  <label
                    htmlFor="partner-aadhaar"
                    className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer ${
                      !isUploadEnabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Upload size={18} />
                    <span>Choose File</span>
                  </label>
                  {selectedFiles.has(documentTypes.partnerAadhaar) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText size={16} />
                      <span>{selectedFiles.get(documentTypes.partnerAadhaar)!.name}</span>
                      <button
                        onClick={() => handleRemoveSelectedFile(documentTypes.partnerAadhaar)}
                        className="text-rose-600 hover:text-rose-700 p-1"
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bride's Second Document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  10th Class Certificate or Voter ID <span className="text-rose-600">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const fileName = file.name.toLowerCase();
                        const type = fileName.includes('voter') || fileName.includes('voterid') ? 'voter_id' : 'tenth_certificate';
                        handleFileSelection(file, documentTypes.partnerSecondDoc, 'partner', type);
                      }
                    }}
                    className="hidden"
                    id="partner-second-doc"
                    disabled={!isUploadEnabled}
                  />
                  <label
                    htmlFor="partner-second-doc"
                    className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer ${
                      !isUploadEnabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Upload size={18} />
                    <span>Choose File</span>
                  </label>
                  {selectedFiles.has(documentTypes.partnerSecondDoc) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText size={16} />
                      <span>{selectedFiles.get(documentTypes.partnerSecondDoc)!.name}</span>
                      <button
                        onClick={() => handleRemoveSelectedFile(documentTypes.partnerSecondDoc)}
                        className="text-rose-600 hover:text-rose-700 p-1"
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Joint Photograph */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Joint Photograph</h3>
            <p className="text-sm text-gray-600 mb-4">Upload a joint photograph of the bride and groom</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joint Photograph <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelection(file, documentTypes.jointPhoto, 'joint', 'photo');
                  }}
                  className="hidden"
                  id="joint-photograph"
                  disabled={!isUploadEnabled}
                />
                <label
                  htmlFor="joint-photograph"
                  className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer ${
                    !isUploadEnabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Upload size={18} />
                  <span>Choose File</span>
                </label>
                {selectedFiles.has(documentTypes.jointPhoto) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText size={16} />
                    <span>{selectedFiles.get(documentTypes.jointPhoto)!.name}</span>
                    <button
                      onClick={() => handleRemoveSelectedFile(documentTypes.jointPhoto)}
                      className="text-rose-600 hover:text-rose-700 p-1"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {!isUploadEnabled && rejectedDocuments.length === 0 && (
        <Card className="p-6 mb-8">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Application Submitted</p>
                <p>
                  Your documents have been submitted and are under review. You will be notified if any documents need to be re-uploaded.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Security & Privacy</p>
            <p>
              All documents are encrypted and stored securely. Signed URLs expire after 24 hours.
              Your personal information is protected according to government privacy standards.
            </p>
          </div>
        </div>
      </div>

      {/* Final Submit Button */}
      {isUploadEnabled && selectedFiles.size > 0 && (
        <div className="mt-8 flex items-center justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmitDocuments}
            disabled={isUploading}
            className="min-w-[200px]"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} className="mr-2" />
                Submit Documents
              </>
            )}
          </Button>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDocument && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h3 className="font-semibold text-gray-900">
                {getFullDocumentLabel(previewDocument)}: {previewDocument.name}
              </h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    previewDocument.status === 'approved'
                      ? 'success'
                      : previewDocument.status === 'rejected'
                      ? 'error'
                      : 'default'
                  }
                >
                  {previewDocument.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const urlToDownload = previewUrl || previewDocument.url;
                    window.open(urlToDownload, '_blank');
                  }}
                >
                  <Download size={18} className="mr-2" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" onClick={closePreview}>
                  <X size={18} />
                </Button>
              </div>
            </div>
            <div className="p-6">
              {isLoadingPreview ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
                </div>
              ) : previewUrl ? (
                <>
                  {isImage(previewDocument.mimeType) ? (
                    <img
                      src={previewUrl}
                      alt={previewDocument.name}
                      className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      onError={(e) => {
                        console.error('Failed to load image:', e);
                        (e.target as HTMLImageElement).src = previewDocument.url;
                      }}
                    />
                  ) : isPDF(previewDocument.mimeType) ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-[70vh] rounded-lg border border-gray-200"
                      title={previewDocument.name}
                      onError={() => {
                        console.error('Failed to load PDF');
                      }}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                      <Button variant="primary" onClick={() => window.open(previewUrl, '_blank')}>
                        <Download size={18} className="mr-2" />
                        Download to View
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Failed to load document preview</p>
                  <Button variant="primary" onClick={() => window.open(previewDocument.url, '_blank')}>
                    <Download size={18} className="mr-2" />
                    Download to View
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;

