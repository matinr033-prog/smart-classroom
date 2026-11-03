# Smart Classroom setup guide

This is an extensible MVP, not a production-ready school platform. Local demo works on one device; secure online authentication and shared sync require Supabase configuration.

## Online setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Copy the Project URL and public anon/publishable key into `app.js`, replacing the placeholders. Never expose the service-role key in browser code.
4. Create your teacher account under Authentication > Users.
5. Promote it in SQL Editor:
   ```sql
   update public.profiles set role='teacher', grade=0, display_name='Teacher Name'
   where email='YOUR_EMAIL';
   ```
6. Deploy the secure account-creation function:
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase functions deploy create-student
   ```
   Ensure server-side secrets `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_ANON_KEY` are available to the function.
7. Host the folder on HTTPS (e.g. Cloudflare Pages or GitHub Pages), then set the hosted URL in Supabase Auth URL Configuration.
8. Test using separate teacher and student accounts.

## Android
Open the hosted HTTPS site in Chrome, open the three-dot menu, and choose Add to Home screen. Visit once online so the app shell can be cached.

## Important limitations
- Local demo has no real authentication or encryption.
- Offline queue is only a starter; it does not fully reconcile offline mutations to the server. Export backups frequently.
- Quiz answer keys are sent to the browser in this MVP. Secure exams need server-side grading.
- Live video, notifications, password recovery, payments, and advanced reports are not included.
- Review privacy, applicable child-data requirements, RLS policies, and sync behavior before real student data is used.
