# Resend API Configuration

## Important: Configure Your API Key

The email notification system has been deployed, but you need to configure the Resend API key as a secret in Supabase.

### Steps to Configure:

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Manage secrets**
3. Add a new secret with the following details:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_5tqgtJ2U_KdBV4fo9ZxHByJyrfqcv1Adu`

4. Click **Save** or **Add secret**

### Alternative Method (using Supabase CLI):

If you have Supabase CLI installed and authenticated:

```bash
supabase secrets set RESEND_API_KEY=re_5tqgtJ2U_KdBV4fo9ZxHByJyrfqcv1Adu
```

### Verification:

After setting the secret, test the email functionality by:
1. Submitting a form on your website (Contact, Buy Property, or Sell Property)
2. Check that you receive TWO emails:
   - One admin notification to inffomre@gmail.com
   - One customer confirmation to the email they provided

### Email Functionality:

The system sends emails for:
- **Contact Form** submissions → General inquiry emails
- **Buy Property** submissions → Property purchase inquiry emails
- **Sell Property** submissions → Property listing inquiry emails

Each submission triggers:
1. **Admin Email** to inffomre@gmail.com with full details
2. **Customer Confirmation** email to acknowledge their submission

### Important Notes:

- Emails are sent from `onboarding@resend.dev` (Resend's default sender)
- To use a custom domain, you'll need to verify it in your Resend dashboard
- The Edge Function automatically handles CORS and error handling
- All form submissions are saved to the database even if email sending fails
