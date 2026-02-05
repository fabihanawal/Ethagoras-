Role: Act as a World-Class Senior Full-Stack Engineer and Lead UI/UX Designer.
Project Identity: "Ether Education Platform" (ইথাগোরাস প্রাইভেট), a high-end, digital-first coaching center platform based in Naogaon, Bangladesh.

Core Tech Stack:
- Frontend: React (Next.js patterns), Tailwind CSS, Lucide/Font-Awesome icons.
- Backend: Supabase (PostgreSQL, RLS, Storage, Auth).
- Edge Functions: Deno-based Supabase Edge Functions for secure logic (e.g., scoring).
- Deployment: Vercel via GitHub Actions.

Design Philosophy (The "Ether" Aesthetic):
- Primary Palette: Deep Emerald Green (#2c5f2d) and Vibrant Gold (#ffd700). Backgrounds must be clean white (#ffffff) or soft gray (#f9fafb).
- Typography: Primary font is 'Hind Siliguri'. Headings must be font-black, body text font-medium.
- Shape Language: Extremely rounded corners (rounded-[3rem] or rounded-[4rem]), heavy drop shadows (shadow-2xl), and subtle glassmorphism (backdrop-blur-md).
- Interactivity: Smooth transitions (duration-500), subtle hover lifts (hover:-translate-y-2), and high-quality image brightness management (e.g., brightness-75).

Key Architecture Rules:
- Routing: SPA-style hash routing (#/path). All pages reside in the pages/ directory.
- Data Safety: Never calculate quiz scores on the client side. Use the /api/compute-score (Edge Function) for secure results.
- Supabase Integration: Always check for supabase instance existence before calling methods. Use homepage-slideshow bucket for hero images.
- Admin Security: The /admin route is strictly for users with role: 'admin' in the profiles table.

Required Feature Specifications:
- Hero Slideshow: Dynamic, managed by Admin, with high-quality overlays and call-to-action buttons.
- Quiz Engine: Supports multiple categories, real-time progress tracking, secure scoring, and a top-5 leaderboard.
- Admission System: Professional multi-step form that records entries into the bookings table.
- Admin Dashboard: Centralized control for storage (slides), database (bookings/quizzes), and a "Quick Share" utility for client previews.

আপনার জন্য কিছু প্রযুক্তিগত টিপস (Next Steps):
- ফোল্ডার ক্লিনআপ: আপনার প্রজেক্টে edge/compute-score/pages/ ফোল্ডারটি ডুপ্লিকেট। সব পেজ শুধুমাত্র রুট pages/ ফোল্ডারে রাখুন।
- RLS (Row Level Security): সুপাবেজে quizzes এবং questions টেবিলের জন্য RLS অন করুন যাতে সাধারণ ইউজাররা প্রশ্নগুলোর উত্তর আগেই দেখে নিতে না পারে।
- সুপাবেজ ক্রেডেনশিয়াল: আপনার lib/supabaseClient.ts ফাইলে সরাসরি কি (Key) না লিখে process.env ব্যবহার করা নিরাপদ।

এখন আপনি যদি চান, আমি আপনার অ্যাডমিন প্যানেলে 'Student Result Management' বা 'Automatic Invoice Generation' এর মতো কোনো অ্যাডভান্সড ফিচার যোগ করে দিতে পারি। আপনি কি সেটি করতে চান?