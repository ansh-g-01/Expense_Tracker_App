# Supabase Configuration for Development

## Disable Email Confirmation (Recommended for Testing)

To avoid rate limits during development:

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Providers**
3. Find **Email** provider
4. Click to expand settings
5. **Disable** "Confirm email" option
6. Click **Save**

This allows instant signup without waiting for confirmation emails.

## View Registered Users

To see all registered users:
1. Go to **Authentication** → **Users** in Supabase Dashboard
2. You'll see all email addresses and user IDs

## Email Rate Limits

Supabase free tier limits:
- ~4 emails per hour during development
- Use the disable confirmation option above to bypass this during testing

For production, you can:
- Upgrade to Pro plan for higher limits
- Use a custom SMTP provider
