import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointments';
import { useNotification } from '../../contexts/NotificationContext';
import { AppointmentSlot, Appointment } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Calendar, Plus, Clock } from 'lucide-react';
import { safeFormatDate, safeFormatDateObject } from '../../utils/dateUtils';

const AppointmentsAdminPage: React.FC = () => {
  const { showToast } = useNotification();
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: '', time: '', capacity: 5 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [slotsData, appointmentsData] = await Promise.all([
          appointmentService.getAvailableSlots(),
          appointmentService.getAllAppointments(),
        ]);
        setSlots(slotsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  const handleCreateSlot = async () => {
    try {
      await appointmentService.createSlot(newSlot);
      showToast('Slot created successfully', 'success');
      setIsModalOpen(false);
      setNewSlot({ date: '', time: '', capacity: 5 });
      // Reload slots
      const updated = await appointmentService.getAvailableSlots();
      setSlots(updated);
    } catch (error) {
      showToast('Failed to create slot', 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Appointment Management</h1>
          <p className="text-gray-600">Create and manage appointment slots</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Create Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Available Slots</h3>
          <div className="space-y-3">
            {slots.map((slot) => (
              <div key={slot.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {safeFormatDate(slot.date, 'MMM d, yyyy')} at {slot.time}
                    </p>
                    <p className="text-sm text-gray-500">
                      {slot.capacity - slot.booked} of {slot.capacity} available
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Booked Appointments</h3>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900">
                  {safeFormatDate(apt.date, 'MMM d, yyyy')} at {apt.time}
                </p>
                <p className="text-sm text-gray-500">Status: {apt.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Slot"
      >
        <div className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={newSlot.date}
            onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
            required
          />
          <Input
            label="Time"
            type="time"
            value={newSlot.time}
            onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
            required
          />
          <Input
            label="Capacity"
            type="number"
            value={newSlot.capacity}
            onChange={(e) => setNewSlot({ ...newSlot, capacity: parseInt(e.target.value) })}
            required
          />
          <Button variant="primary" onClick={handleCreateSlot} className="w-full">
            Create Slot
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentsAdminPage;

