import { 
  User, 
  Profile, 
  Application, 
  Document, 
  Message, 
  Conversation,
  AppointmentSlot,
  Appointment,
  Certificate,
  AuditLog
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'client@example.com',
    phone: '+1234567890',
    name: 'Ahmed Hassan',
    role: 'client',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@mmr.gov.in',
    name: 'Registrar Office',
    role: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
  },
];

// Mock Profiles
export const mockProfiles: Profile[] = [
  {
    id: 'profile-1',
    userId: 'user-1',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    dateOfBirth: '1990-05-15',
    idNumber: 'ID123456789',
    address: {
      street: '123 Main Street',
      city: 'Burwan',
      state: 'West Bengal',
      zipCode: '713101',
      country: 'India',
    },
    partnerDetails: {
      firstName: 'Fatima',
      lastName: 'Hassan',
      dateOfBirth: '1992-08-20',
      idNumber: 'ID987654321',
      address: {
        street: '123 Main Street',
        city: 'Burwan',
        state: 'West Bengal',
        zipCode: '713101',
        country: 'India',
      },
    },
    completionPercentage: 75,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: 'app-1',
    userId: 'user-1',
    status: 'under_review',
    progress: 80,
    partnerForm: {
      firstName: 'Fatima',
      lastName: 'Hassan',
      dateOfBirth: '1992-08-20',
      idNumber: 'ID987654321',
      address: {
        street: '123 Main Street',
        city: 'Burwan',
        state: 'West Bengal',
        zipCode: '713101',
        country: 'India',
      },
    },
    address: {
      street: '123 Main Street',
      city: 'Burwan',
      state: 'West Bengal',
      zipCode: '713101',
      country: 'India',
    },
    declarations: {
      consent: true,
      accuracy: true,
      legal: true,
    },
    documents: [],
    submittedAt: '2024-01-20T14:30:00Z',
    lastUpdated: '2024-01-20T14:30:00Z',
  },
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    applicationId: 'app-1',
    type: 'id',
    name: 'national_id_front.pdf',
    url: 'https://example.com/documents/national_id_front.pdf',
    status: 'approved',
    uploadedAt: '2024-01-18T10:00:00Z',
    size: 1024000,
    mimeType: 'application/pdf',
  },
  {
    id: 'doc-2',
    applicationId: 'app-1',
    type: 'photo',
    name: 'passport_photo.jpg',
    url: 'https://example.com/documents/passport_photo.jpg',
    status: 'pending',
    uploadedAt: '2024-01-19T11:00:00Z',
    size: 512000,
    mimeType: 'image/jpeg',
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderName: 'Ahmed Hassan',
    content: 'Hello, I have a question about my application.',
    status: 'read',
    timestamp: '2024-01-21T09:00:00Z',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'admin-1',
    senderName: 'Registrar Office',
    content: 'Hello Ahmed, how can I help you today?',
    status: 'read',
    timestamp: '2024-01-21T09:15:00Z',
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    userId: 'user-1',
    adminId: 'admin-1',
    lastMessage: mockMessages[mockMessages.length - 1],
    unreadCount: 0,
    updatedAt: '2024-01-21T09:15:00Z',
  },
];

// Mock Appointment Slots
export const mockAppointmentSlots: AppointmentSlot[] = [
  {
    id: 'slot-1',
    date: '2024-02-01',
    time: '09:00',
    capacity: 5,
    booked: 2,
  },
  {
    id: 'slot-2',
    date: '2024-02-01',
    time: '10:00',
    capacity: 5,
    booked: 1,
  },
  {
    id: 'slot-3',
    date: '2024-02-01',
    time: '11:00',
    capacity: 5,
    booked: 0,
  },
  {
    id: 'slot-4',
    date: '2024-02-02',
    time: '09:00',
    capacity: 5,
    booked: 3,
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    userId: 'user-1',
    slotId: 'slot-1',
    date: '2024-02-01',
    time: '09:00',
    status: 'confirmed',
    qrCodeData: JSON.stringify({
      appointmentId: 'apt-1',
      userId: 'user-1',
      date: '2024-02-01',
      time: '09:00',
    }),
    createdAt: '2024-01-22T10:00:00Z',
  },
];

// Mock Certificates
export const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    userId: 'user-1',
    applicationId: 'app-1',
    verificationId: 'MMR-BW-2024-001234',
    name: 'Marriage Registration Certificate',
    issuedOn: '2024-01-25T12:00:00Z',
    pdfUrl: 'https://example.com/certificates/cert-1.pdf',
    verified: true,
  },
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    actorId: 'admin-1',
    actorName: 'Registrar Office',
    actorRole: 'admin',
    action: 'document_approved',
    resourceType: 'document',
    resourceId: 'doc-1',
    details: { documentType: 'id' },
    timestamp: '2024-01-20T15:00:00Z',
  },
  {
    id: 'audit-2',
    actorId: 'user-1',
    actorName: 'Ahmed Hassan',
    actorRole: 'client',
    action: 'application_submitted',
    resourceType: 'application',
    resourceId: 'app-1',
    timestamp: '2024-01-20T14:30:00Z',
  },
  {
    id: 'audit-3',
    actorId: 'admin-1',
    actorName: 'Registrar Office',
    actorRole: 'admin',
    action: 'certificate_issued',
    resourceType: 'certificate',
    resourceId: 'cert-1',
    timestamp: '2024-01-25T12:00:00Z',
  },
];

