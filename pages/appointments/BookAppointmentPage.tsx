import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentService } from '../../services/appointments';
import { useNotification } from '../../contexts/NotificationContext';
import { AppointmentSlot } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import QRCode from '../../components/ui/QRCode';
import { Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { safeFormatDate } from '../../utils/dateUtils';

const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [slot, setSlot] = useState<AppointmentSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    const slotId = searchParams.get('slotId');
    if (!slotId) {
      navigate('/appointments');
      return;
    }

    // In a real app, fetch slot details
    // For now, we'll create a mock slot
    setSlot({
      id: slotId,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      capacity: 5,
      booked: 2,
    });
  }, [user, navigate, searchParams]);

  const handleBook = async () => {
    if (!slot || !user) return;

    setIsBooking(true);
    try {
      const booked = await appointmentService.bookAppointment(user.id, slot.id);
      setAppointment(booked);
      showToast('Appointment booked successfully!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to book appointment', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  if (!slot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (appointment) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Your appointment has been successfully booked.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar size={20} className="text-gold-600" />
              <span className="font-semibold text-gray-900">
                {safeFormatDate(appointment.date, 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock size={20} className="text-gold-600" />
              <span className="font-semibold text-gray-900">{appointment.time}</span>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <QRCode value={appointment.qrCodeData} size={200} />
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Show this QR code at the registrar office on your appointment date.
          </p>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/appointments')}>
              Back
            </Button>
            <Button variant="primary" onClick={() => navigate('/pass')}>
              View Pass
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Confirm Appointment</h1>
        <p className="text-gray-600">Review your appointment details</p>
      </div>

      <Card className="p-8">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gold-600" />
              <span className="text-gray-700">
                {safeFormatDate(slot.date, 'EEEE, MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-gold-600" />
              <span className="text-gray-700">{slot.time}</span>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-rose-800">
            <strong>Important:</strong> Please arrive 15 minutes before your appointment time.
            Bring all required documents and your ID.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/appointments')} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleBook}
            isLoading={isBooking}
            className="flex-1"
          >
            Confirm Booking
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BookAppointmentPage;

