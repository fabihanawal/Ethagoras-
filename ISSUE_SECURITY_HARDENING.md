# Security & architecture hardening + initial scaffolds

Priority: High

Overview
- Implement critical security hardening and add initial server-side scaffolds for the Ether Education Platform.

Tasks
- [ ] Enable RLS on `quizzes` and `questions` tables
  - Policy suggestions:
    - SELECT for public: allow only necessary columns (no answers)
    - INSERT for admins only
    - Use RLS policies that prevent reading correct answers for non-admins
- [ ] Remove duplicated folder: `edge/compute-score/pages/` — keep only `pages/` root for pages
- [ ] Migrate Supabase keys to env vars and rotate keys if any are committed
  - Add `lib/supabaseClient.template.ts` as a safe example
- [ ] Add Edge Function stub for `/api/compute-score` (server-side scoring)
  - Validate payload, call DB RPC or compute securely, store results
- [ ] Add admin-role enforcement for `/admin` route (check profiles.role = 'admin')
- [ ] Create homepage-slideshow bucket policies and Admin UI scaffold to manage slides
- [ ] Scaffold Quiz Engine + top-5 leaderboard (server-side ranking)
- [ ] Scaffold Admission multi-step form writing to `bookings` table
- [ ] Add tests for compute-score edge function and RBAC policies

Notes
- All sensitive keys MUST be removed from repo and moved to deployment secrets.
- Prefer creating a feature branch and PR for large changes; for urgent security fixes we can commit to main.