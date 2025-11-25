import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { applicationService } from '../../services/application';
import { documentService } from '../../services/documents';
import { profileService } from '../../services/profile';
import { Application, Document } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, FileText, CheckCircle, X } from 'lucide-react';
import { safeFormatDate } from '../../utils/dateUtils';

const ApplicationDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!applicationId) return;
      
      try {
        // Find application by ID
        const allApplications = await applicationService.getAllApplications();
        const app = allApplications.find(a => a.id === applicationId);
        
        if (app) {
          setApplication(app);
          const docs = await documentService.getDocuments(app.id);
          setDocuments(docs);
        }
      } catch (error) {
        console.error('Failed to load application details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [applicationId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="p-8 text-center">
          <p className="text-gray-500">Application not found</p>
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mt-4">
            <ArrowLeft size={18} className="mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const userDetails = (application.userDetails as any) || {};
  const partnerForm = application.partnerForm || {};
  const userAddress = application.userAddress || application.address || {};
  const userCurrentAddress = application.userCurrentAddress || (application as any).currentAddress || {};
  const partnerAddress = application.partnerAddress || partnerForm.address || {};
  const partnerCurrentAddress = application.partnerCurrentAddress || {};

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-4"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Application Details</h1>
            <p className="text-gray-600">Application ID: {application.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={application.status === 'submitted' ? 'info' : application.status === 'approved' ? 'success' : 'default'}>
              {application.status}
            </Badge>
            {application.verified !== undefined && (
              <Badge variant={application.verified ? 'success' : 'default'}>
                {application.verified ? 'Verified' : 'Unverified'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* User Aadhaar Details */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">User's Aadhaar Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Full Name</p>
              <p className="font-medium text-gray-900">
                {userDetails.firstName || '-'} {userDetails.lastName || ''}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {userDetails.dateOfBirth ? safeFormatDate(userDetails.dateOfBirth, 'MMMM d, yyyy') : '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Aadhaar Number</p>
              <p className="font-medium text-gray-900">{userDetails.aadhaarNumber || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Mobile Number</p>
              <p className="font-medium text-gray-900">{userDetails.mobileNumber || '-'}</p>
            </div>
          </div>
        </Card>

        {/* Partner Aadhaar Details */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Partner's Aadhaar Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Full Name</p>
              <p className="font-medium text-gray-900">
                {partnerForm.firstName || '-'} {partnerForm.lastName || ''}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {partnerForm.dateOfBirth ? safeFormatDate(partnerForm.dateOfBirth, 'MMMM d, yyyy') : '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Aadhaar Number</p>
              <p className="font-medium text-gray-900">{(partnerForm as any).aadhaarNumber || partnerForm.idNumber || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Mobile Number</p>
              <p className="font-medium text-gray-900">{(partnerForm as any).mobileNumber || '-'}</p>
            </div>
          </div>
        </Card>

        {/* User Addresses */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">User's Addresses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Permanent Address</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{userAddress.street || '-'}</p>
                <p>{userAddress.city || '-'}, {userAddress.state || '-'}</p>
                <p>{userAddress.zipCode || '-'}, {userAddress.country || '-'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Current Address</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{userCurrentAddress.street || '-'}</p>
                <p>{userCurrentAddress.city || '-'}, {userCurrentAddress.state || '-'}</p>
                <p>{userCurrentAddress.zipCode || '-'}, {userCurrentAddress.country || '-'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Partner Addresses */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Partner's Addresses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Permanent Address</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{partnerAddress.street || '-'}</p>
                <p>{partnerAddress.city || '-'}, {partnerAddress.state || '-'}</p>
                <p>{partnerAddress.zipCode || '-'}, {partnerAddress.country || '-'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Current Address</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{partnerCurrentAddress.street || '-'}</p>
                <p>{partnerCurrentAddress.city || '-'}, {partnerCurrentAddress.state || '-'}</p>
                <p>{partnerCurrentAddress.zipCode || '-'}, {partnerCurrentAddress.country || '-'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">User's Documents</p>
              <div className="space-y-2">
                {documents.filter(d => d.belongsTo === 'user').map(doc => (
                  <div key={doc.id} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <FileText size={16} />
                    <span>
                      {doc.type === 'aadhaar' && 'Aadhaar Card'}
                      {doc.type === 'tenth_certificate' && '10th Certificate'}
                      {doc.type === 'voter_id' && 'Voter ID'}
                      {!['aadhaar', 'tenth_certificate', 'voter_id'].includes(doc.type) && doc.type}
                      : {doc.name}
                    </span>
                    <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'error' : 'default'} className="ml-auto">
                      {doc.status}
                    </Badge>
                  </div>
                ))}
                {documents.filter(d => d.belongsTo === 'user').length === 0 && (
                  <p className="text-sm text-gray-400 italic">No documents uploaded</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Partner's Documents</p>
              <div className="space-y-2">
                {documents.filter(d => d.belongsTo === 'partner').map(doc => (
                  <div key={doc.id} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <FileText size={16} />
                    <span>
                      {doc.type === 'aadhaar' && 'Aadhaar Card'}
                      {doc.type === 'tenth_certificate' && '10th Certificate'}
                      {doc.type === 'voter_id' && 'Voter ID'}
                      {!['aadhaar', 'tenth_certificate', 'voter_id'].includes(doc.type) && doc.type}
                      : {doc.name}
                    </span>
                    <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'error' : 'default'} className="ml-auto">
                      {doc.status}
                    </Badge>
                  </div>
                ))}
                {documents.filter(d => d.belongsTo === 'partner').length === 0 && (
                  <p className="text-sm text-gray-400 italic">No documents uploaded</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Declarations */}
        {application.declarations && (
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Declarations</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">I consent to the processing of my personal data for marriage registration purposes.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">I confirm that all information provided is accurate and truthful.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">I confirm that I am legally eligible to enter into marriage.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Application Info */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Application Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Progress</p>
              <p className="font-medium text-gray-900">{application.progress}%</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Last Updated</p>
              <p className="font-medium text-gray-900">
                {safeFormatDate(application.lastUpdated, 'MMMM d, yyyy')}
              </p>
            </div>
            {application.submittedAt && (
              <div>
                <p className="text-gray-500 mb-1">Submitted At</p>
                <p className="font-medium text-gray-900">
                  {safeFormatDate(application.submittedAt, 'MMMM d, yyyy')}
                </p>
              </div>
            )}
            {application.verifiedAt && (
              <div>
                <p className="text-gray-500 mb-1">Verified At</p>
                <p className="font-medium text-gray-900">
                  {safeFormatDate(application.verifiedAt, 'MMMM d, yyyy')}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;

