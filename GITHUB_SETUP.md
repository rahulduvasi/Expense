# RupeeWise GitHub Actions setup

Before pushing/building the Android app, add these two GitHub repository secrets:

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — your Supabase publishable key (`sb_publishable_...`)

Do not add the secret/service-role key to the repository or to the React app.

The workflow injects these values only during the Vite build, so the Android APK contains the public Supabase client configuration needed by the app while the repository itself does not contain `.env.local`.

## Supabase password-reset redirect

For local browser testing, add this URL in Supabase Dashboard → Authentication → URL Configuration → Redirect URLs:

`http://localhost:5173/reset-password`

The app uses its current origin for the reset redirect. When you later host the web app, add that production `/reset-password` URL as well. For a fully native Android password-reset flow, a Capacitor deep-link/hosted redirect should be configured before production release.
