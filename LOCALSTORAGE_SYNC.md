# LocalStorage Data Synchronization

## Overview
All data operations (create, read, update, delete) are now synchronized and stored in localStorage. This ensures that:
- User actions (client side) are immediately reflected
- Admin actions update the same data source
- All changes persist across page refreshes
- Data is synchronized between client and admin views

## Services Using LocalStorage

### ✅ Already Implemented

1. **Appointments Service** (`services/appointments.ts`)
   - Appointment slots storage
   - User appointments
   - Booking/cancellation operations
   - Admin slot creation

2. **Application Service** (`services/application.ts`)
   - Application drafts
   - Application updates
   - Submission status
   - Progress tracking

3. **Documents Service** (`services/documents.ts`)
   - Document uploads
   - Document approval/rejection
   - Document deletion
   - **Now syncs with applications** - documents are added to application's documents array

4. **Profile Service** (`services/profile.ts`)
   - User profiles
   - Profile updates
   - Address updates
   - Partner details

5. **Certificates Service** (`services/certificates.ts`)
   - Certificate issuance
   - Certificate verification
   - Certificate storage

6. **Messages Service** (`services/messages.ts`)
   - Conversations
   - Messages
   - Read status

7. **Audit Service** (`services/audit.ts`)
   - Audit logs
   - Action tracking

### ✅ Updated for Synchronization

1. **Admin Service** (`services/admin.ts`)
   - **Now properly updates application status** when approving/rejecting
   - Creates audit logs for all admin actions
   - All changes are persisted to localStorage

2. **Documents Service** (`services/documents.ts`)
   - **Now syncs documents with applications** when uploaded
   - **Updates application when documents are approved/rejected**
   - **Removes documents from applications when deleted**

## Data Flow

### User Actions → LocalStorage
1. User creates/updates application → Saved to `mmr_applications`
2. User uploads document → Saved to `mmr_documents` AND added to application
3. User books appointment → Saved to `mmr_appointments` AND updates slot booking count
4. User sends message → Saved to `mmr_messages` AND updates conversation

### Admin Actions → LocalStorage
1. Admin approves application → Updates status in `mmr_applications` + creates audit log
2. Admin rejects application → Updates status in `mmr_applications` + creates audit log
3. Admin approves document → Updates status in `mmr_documents` AND in application's documents array
4. Admin rejects document → Updates status in `mmr_documents` AND in application's documents array
5. Admin creates slot → Saved to `mmr_appointment_slots`

## Storage Keys

- `mmr_appointment_slots` - Available appointment slots
- `mmr_appointments` - User appointments
- `mmr_applications` - Marriage registration applications
- `mmr_documents` - Uploaded documents
- `mmr_profiles` - User profiles
- `mmr_certificates` - Issued certificates
- `mmr_messages` - Chat messages
- `mmr_conversations` - Chat conversations
- `mmr_audit_logs` - Admin action logs
- `mmr_auth_token` - Authentication token
- `mmr_user` - Current user data

## Synchronization Points

1. **Document ↔ Application**: Documents are linked to applications and both are updated together
2. **Appointment ↔ Slot**: Booking updates both appointment and slot availability
3. **Admin Actions ↔ User Data**: Admin approvals/rejections update the same data users see
4. **Audit Logs**: All admin actions are logged for tracking

## Testing Checklist

- [ ] User creates application → Appears in admin panel
- [ ] User uploads document → Document appears in application AND admin can see it
- [ ] Admin approves document → Status updates in both user and admin views
- [ ] Admin approves application → Status updates in user dashboard
- [ ] User books appointment → Slot availability decreases, admin sees booking
- [ ] User cancels appointment → Slot availability increases
- [ ] All data persists after page refresh
- [ ] Data is synchronized between multiple browser tabs

## Future: Supabase Integration

When ready to integrate Supabase:
1. Replace localStorage operations with Supabase API calls
2. Keep the same service interfaces
3. Add real-time subscriptions for live updates
4. Implement proper authentication with Supabase Auth

