# Admin Dashboard Setup Guide

Your admin dashboard has been successfully created! Follow these steps to get started.

## 1. Create Your First Admin User

To access the admin dashboard, you need to create an admin user in Supabase.

### Step 1: Sign Up via Supabase Auth

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add User** > **Create new user**
4. Enter an email and password for your admin account
5. Click **Create user**
6. Copy the user's UUID (you'll need this in the next step)

### Step 2: Add User to Admin Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Run this query (replace `YOUR_USER_UUID` with the UUID you copied and `admin@example.com` with your email):

```sql
INSERT INTO admin_users (id, email, full_name)
VALUES ('YOUR_USER_UUID', 'admin@example.com', 'Admin User');
```

For example:
```sql
INSERT INTO admin_users (id, email, full_name)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin@example.com', 'Admin User');
```

## 2. Access the Admin Dashboard

1. Navigate to `/admin/login` on your website
2. Log in with the email and password you created
3. You'll be redirected to the admin dashboard at `/admin`

## 3. Managing Properties

### View All Properties
- The main dashboard shows all properties in a table
- Use the search bar to filter by title or location
- Use the dropdown to filter by property type

### Add New Property
1. Click **Pridať nehnuteľnosť** (Add Property) button
2. Fill in all required fields (marked with *)
3. Upload an image (optional - a default image will be used if none is uploaded)
4. Check **Odporúčaná nehnuteľnosť** to feature the property on the homepage
5. Click **Uložiť nehnuteľnosť** (Save Property)

### Edit Existing Property
1. Find the property in the table
2. Click the edit icon (pencil)
3. Make your changes
4. Click **Uložiť zmeny** (Save Changes)

### Delete Property
1. Find the property in the table
2. Click the delete icon (trash)
3. Confirm the deletion in the popup

### Toggle Featured Status
1. Find the property in the table
2. Click the star icon to toggle featured status
3. Featured properties appear at the top of the homepage

## 4. Image Upload

The system uses Supabase Storage for property images:
- Storage bucket: `property-images`
- Public read access is enabled
- Only authenticated admins can upload/modify images
- Supported formats: JPG, PNG, WebP
- Maximum file size: 5MB (recommended)

## 5. Security Features

Your admin system includes:
- Email/password authentication via Supabase Auth
- Row Level Security (RLS) policies on all tables
- Protected routes that require authentication
- Admin-only access to property management
- Public can view properties but cannot modify them
- Public can submit inquiries through the contact form

## 6. Troubleshooting

### Cannot log in
- Verify the user exists in Supabase Authentication
- Verify the user's UUID is in the admin_users table
- Check browser console for error messages

### Cannot upload images
- Verify the property-images bucket exists in Supabase Storage
- Check that RLS policies are enabled on storage.objects
- Ensure file size is under 5MB

### Properties not showing on homepage
- Check that properties exist in the database
- Verify RLS policies allow public SELECT on properties table
- Check browser console for errors

## 7. Database Schema

### admin_users table
- `id` (uuid) - References auth.users(id)
- `email` (text) - Admin email address
- `full_name` (text) - Admin full name
- `created_at` (timestamptz) - Account creation date

### properties table (already exists)
- All existing fields remain the same
- RLS enabled for security
- Public SELECT access
- Admin-only INSERT/UPDATE/DELETE access

### property_inquiries table (already exists)
- Public can INSERT (submit inquiries)
- Admin-only SELECT/UPDATE access

## 8. Next Steps

1. Create your admin account following steps above
2. Log in to the admin dashboard
3. Add or edit properties
4. Test the public-facing website to ensure everything works
5. Consider adding more admin users if needed (repeat Step 1 and 2)

---

**Important Security Notes:**
- Never share your admin credentials
- Use a strong password for admin accounts
- Regularly review admin users in the database
- Monitor the Supabase logs for suspicious activity
