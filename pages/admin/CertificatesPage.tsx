import React, { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificates';
import { useNotification } from '../../contexts/NotificationContext';
import { Certificate } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import Badge from '../../components/ui/Badge';
import { FileText, Download, Eye } from 'lucide-react';
import { safeFormatDateObject } from '../../utils/dateUtils';

const CertificatesPage: React.FC = () => {
  const { showToast } = useNotification();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const certs = await certificateService.getAllCertificates();
        setCertificates(certs);
      } catch (error) {
        console.error('Failed to load certificates:', error);
      }
    };

    loadCertificates();
  }, []);

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      // Mock: In real app, upload to storage first
      const mockUrl = URL.createObjectURL(files[0]);
      
      // For demo, use a mock user and application ID
      const cert = await certificateService.issueCertificate(
        'user-1',
        'app-1',
        mockUrl
      );
      
      setCertificates([...certificates, cert]);
      showToast('Certificate uploaded successfully', 'success');
    } catch (error) {
      showToast('Failed to upload certificate', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Certificate Management</h1>
        <p className="text-gray-600">Upload and manage marriage certificates</p>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upload Certificate</h3>
        <FileUpload
          accept=".pdf"
          maxSize={10 * 1024 * 1024}
          maxFiles={1}
          onFilesChange={handleUpload}
          label="Certificate PDF"
          helperText="Upload signed certificate PDF (max 10MB)"
        />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">All Certificates</h3>
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-4 bg-gray-50 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold-100 flex items-center justify-center">
                  <FileText size={24} className="text-gold-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{cert.name}</p>
                  <p className="text-sm text-gray-500">
                    Issued: {safeFormatDateObject(new Date(cert.issuedOn), 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Verification ID: {cert.verificationId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={cert.verified ? 'success' : 'warning'}>
                  {cert.verified ? 'Verified' : 'Pending'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(cert.pdfUrl, '_blank')}
                >
                  <Eye size={18} className="mr-2" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      const url = await certificateService.getSignedUrl(cert.id);
                      window.open(url, '_blank');
                    } catch (error) {
                      showToast('Failed to generate download link', 'error');
                    }
                  }}
                >
                  <Download size={18} className="mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>

        {certificates.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No certificates uploaded yet</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CertificatesPage;

