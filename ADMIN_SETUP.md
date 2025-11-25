# Admin Role Setup Guide

This guide explains how to set up an admin user in Supabase so they can access the admin dashboard.

## Quick Setup

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** > **Users**

2. **Find or Create Admin User**
   - If the admin user already exists, find them in the list
   - If not, create a new user or use an existing one

3. **Update User Metadata**
   - Click on the user you want to make admin
   - Scroll down to **User Metadata** section
   - Click **Edit** or **Add** metadata
   - Add a new key: `role`
   - Set the value to: `admin`
   - Click **Save**

### Option 2: Using SQL Editor

1. **Open SQL Editor**
   - Go to Supabase Dashboard > **SQL Editor**
   - Click **New Query**

2. **Run the SQL Script**
   - Open the file `scripts/set-admin-role.sql`
   - Replace `'admin@example.com'` with the actual admin email address
   - Run the query

   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = jsonb_set(
     COALESCE(raw_user_meta_data, '{}'::jsonb),
     '{role}',
     '"admin"'
   )
   WHERE email = 'your-admin-email@example.com';
   ```

3. **Verify the Update**
   - Run this query to verify:
   
   ```sql
   SELECT 
     email,
     raw_user_meta_data->>'role' as role,
     raw_user_meta_data->>'name' as name
   FROM auth.users
   WHERE email = 'your-admin-email@example.com';
   ```

   You should see `role: admin` in the results.

## How It Works

1. **Role Storage**: The admin role is stored in `user_metadata.role` in Supabase Auth
2. **Login Detection**: When a user logs in, the system checks their `user_metadata.role`
3. **Automatic Redirect**: 
   - If `role === 'admin'` → Redirects to `/admin` (Admin Dashboard)
   - If `role === 'client'` or no role → Redirects to `/dashboard` (User Dashboard)

## Testing

1. **Log in** with the admin credentials
2. **Verify redirect**: You should be automatically redirected to `/admin`
3. **Check access**: You should see the admin dashboard with admin-specific features

## Troubleshooting

### Admin user not redirecting to admin dashboard?

1. **Check user metadata**:
   ```sql
   SELECT 
     email,
     raw_user_meta_data->>'role' as role
   FROM auth.users
   WHERE email = 'your-admin-email@example.com';
   ```

2. **Verify role is set correctly**: The role should be exactly `"admin"` (with quotes in JSON)

3. **Clear browser cache** and try logging in again

4. **Check browser console** for any errors

### Permission denied errors?

- Make sure you're using the correct Supabase project
- Verify the user exists in the database
- Check that RLS policies allow admin access

## Security Notes

- Only trusted users should be given admin role
- Admin role grants access to sensitive operations
- Consider using Supabase's built-in admin features for additional security
- Regularly audit admin users in your system

