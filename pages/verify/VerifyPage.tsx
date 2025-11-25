import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { certificateService } from '../../services/certificates';
import { Certificate } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { CheckCircle, XCircle, Download, Search } from 'lucide-react';
import { safeFormatDateObject } from '../../utils/dateUtils';

const VerifyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [verificationId, setVerificationId] = useState(id || '');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!id);

  useEffect(() => {
    const loadCertificate = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const cert = await certificateService.getCertificateByVerificationId(id);
        setCertificate(cert);
        setIsValid(!!cert && cert.verified);
        setHasSearched(true);
      } catch (error) {
        console.error('Failed to load certificate:', error);
        setIsValid(false);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificate();
  }, [id]);

  const handleVerify = async () => {
    if (!verificationId.trim()) return;

    setIsLoading(true);
    try {
      const cert = await certificateService.getCertificateByVerificationId(verificationId.trim());
      setCertificate(cert);
      setIsValid(!!cert && cert.verified);
      setHasSearched(true);
      navigate(`/verify/${verificationId.trim()}`);
    } catch (error) {
      console.error('Failed to load certificate:', error);
      setIsValid(false);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Verify Certificate</h1>
        <p className="text-gray-600">Enter your verification ID to check certificate validity</p>
      </div>

      {!hasSearched ? (
        <Card className="p-8">
          <div className="space-y-6">
            <Input
              label="Verification ID"
              placeholder="Enter verification ID (e.g., MMR-BW-2024-001234)"
              value={verificationId}
              onChange={(e) => setVerificationId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              leftIcon={<Search size={20} />}
            />
            <Button
              variant="primary"
              onClick={handleVerify}
              isLoading={isLoading}
              className="w-full"
            >
              <Search size={18} className="mr-2" />
              Verify Certificate
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          {isValid && certificate ? (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
              Certificate Verified
            </h1>
            <p className="text-gray-600 mb-8">
              This certificate is valid and has been issued by the MMR Burwan office.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Certificate Name</p>
                  <p className="font-semibold text-gray-900">{certificate.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Issued On</p>
                  <p className="font-semibold text-gray-900">
                    {safeFormatDateObject(new Date(certificate.issuedOn), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Verification ID</p>
                  <p className="font-semibold text-gray-900 font-mono">
                    {certificate.verificationId}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    const url = await certificateService.getSignedUrl(certificate.id);
                    window.open(url, '_blank');
                  } catch (error) {
                    console.error('Failed to download:', error);
                  }
                }}
              >
                <Download size={18} className="mr-2" />
                Download Certificate
              </Button>
            </div>
          </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} className="text-rose-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
                Certificate Not Found
              </h2>
              <p className="text-gray-600 mb-8">
                The certificate with verification ID "{verificationId || id}" could not be found or is invalid.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setHasSearched(false);
                  setVerificationId('');
                  setCertificate(null);
                  navigate('/verify');
                }}
              >
                Try Another ID
              </Button>
            </>
          )}
        </Card>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Need help? <a href="/help" className="text-gold-600 hover:text-gold-700">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;

