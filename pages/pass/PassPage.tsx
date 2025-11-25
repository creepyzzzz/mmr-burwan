import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentService } from '../../services/appointments';
import { Appointment } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import QRCode from '../../components/ui/QRCode';
import Badge from '../../components/ui/Badge';
import { Calendar, Clock, Download, Share2 } from 'lucide-react';
import { safeFormatDate } from '../../utils/dateUtils';

const PassPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    const loadAppointment = async () => {
      try {
        const apt = await appointmentService.getUserAppointment(user.id);
        setAppointment(apt);
      } catch (error) {
        console.error('Failed to load appointment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointment();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Card className="p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">No Appointment Found</h2>
          <p className="text-gray-600 mb-6">
            You don't have an active appointment. Book one to get your pass.
          </p>
          <Button variant="primary" onClick={() => navigate('/appointments')}>
            Book Appointment
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Your Appointment Pass</h1>
        <p className="text-gray-600">Show this QR code at the registrar office</p>
      </div>

      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="mb-4">
            <Badge variant={appointment.status === 'confirmed' ? 'success' : 'warning'}>
              {appointment.status}
            </Badge>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            {user?.name}
          </h2>
          <p className="text-gray-600">Appointment Pass</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gold-600" />
                <span className="text-gray-700">Date</span>
              </div>
              <span className="font-semibold text-gray-900">
                {safeFormatDate(appointment.date, 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-gold-600" />
                <span className="text-gray-700">Time</span>
              </div>
              <span className="font-semibold text-gray-900">{appointment.time}</span>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <QRCode value={appointment.qrCodeData} size={250} />
          </div>

          <p className="text-center text-xs text-gray-500">
            Verification ID: {appointment.id}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              // Create a printable/downloadable version
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Appointment Pass - ${user?.name}</title>
                      <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .info { margin: 20px 0; }
                        .qr-code { text-align: center; margin: 30px 0; }
                        .verification { font-size: 12px; color: #666; margin-top: 20px; }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <h1>MMR Burwan - Appointment Pass</h1>
                        <h2>${user?.name}</h2>
                      </div>
                      <div class="info">
                        <p><strong>Date:</strong> ${safeFormatDate(appointment.date, 'MMMM d, yyyy')}</p>
                        <p><strong>Time:</strong> ${appointment.time}</p>
                        <p><strong>Status:</strong> ${appointment.status}</p>
                      </div>
                      <div class="qr-code">
                        <p>Scan QR Code at Registrar Office</p>
                        <p style="font-size: 10px; color: #999;">Verification ID: ${appointment.id}</p>
                      </div>
                      <div class="verification">
                        <p>Please arrive 15 minutes before your appointment time.</p>
                        <p>Bring this pass, your ID, and all required documents.</p>
                      </div>
                    </body>
                  </html>
                `);
                printWindow.document.close();
                printWindow.print();
              } else {
                window.print();
              }
            }}
          >
            <Download size={18} className="mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              // Mock share
              if (navigator.share) {
                navigator.share({
                  title: 'My Appointment Pass',
                  text: `Appointment on ${safeFormatDate(appointment.date, 'MMMM d, yyyy')} at ${appointment.time}`,
                });
              }
            }}
          >
            <Share2 size={18} className="mr-2" />
            Share
          </Button>
        </div>
      </Card>

      <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> Please arrive 15 minutes before your appointment time.
          Bring this pass, your ID, and all required documents.
        </p>
      </Card>
    </div>
  );
};

export default PassPage;

