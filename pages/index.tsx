import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Navbar } from '../components/Navbar';
import { HeroSlideshow } from '../components/HeroSlideshow';
import { QuizEngine } from '../components/QuizEngine';
import { AdmissionForm } from '../components/AdmissionForm';
import { AdminDashboard } from '../components/AdminDashboard';
import { CoursesSection } from '../components/CoursesSection';
import { FacultySection } from '../components/FacultySection';
import { UserProfileView } from '../components/UserProfileView';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/AuthContext';
import {
  subscribeContactSettings,
  subscribeSocialSettings,
  subscribeDirector,
  subscribeTeachers,
  subscribeSlides,
  subscribeBookings,
  subscribeCourses,
} from '../lib/firestoreService';
import {
  INITIAL_CONTACT_SETTINGS,
  INITIAL_SOCIAL_SETTINGS,
  INITIAL_DIRECTOR_PROFILE,
  INITIAL_TEACHERS,
  INITIAL_SLIDES,
  INITIAL_BOOKINGS,
  INITIAL_COURSES,
} from '../lib/dataStore';
import {
  Slide,
  BookingSubmission,
  ContactSettings,
  SocialSettings,
  DirectorProfile,
  TeacherProfile,
  Course,
} from '../lib/types';
import {
  Sparkles,
  Trophy,
  BookOpen,
  GraduationCap,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Star,
  Users,
  Quote,
} from 'lucide-react';

export default function Home() {
  const { isAdmin } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('#/');

  // Real-time Firestore States with fallback initial data
  const [contactSettings, setContactSettings] = useState<ContactSettings>(INITIAL_CONTACT_SETTINGS);
  const [socialSettings, setSocialSettings] = useState<SocialSettings>(INITIAL_SOCIAL_SETTINGS);
  const [director, setDirector] = useState<DirectorProfile>(INITIAL_DIRECTOR_PROFILE);
  const [teachers, setTeachers] = useState<TeacherProfile[]>(INITIAL_TEACHERS);
  const [slides, setSlides] = useState<Slide[]>(INITIAL_SLIDES);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [bookings, setBookings] = useState<BookingSubmission[]>(INITIAL_BOOKINGS);

  // Synchronize hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentRoute(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen to Firestore real-time collections
  useEffect(() => {
    const unsubContact = subscribeContactSettings(setContactSettings);
    const unsubSocial = subscribeSocialSettings(setSocialSettings);
    const unsubDirector = subscribeDirector(setDirector);
    const unsubTeachers = subscribeTeachers(setTeachers);
    const unsubSlides = subscribeSlides(setSlides);
    const unsubCourses = subscribeCourses(setCourses);

    // Bookings are confidential and only accessible by verified admins
    let unsubBookings = () => {};
    if (isAdmin) {
      unsubBookings = subscribeBookings(setBookings);
    }

    return () => {
      unsubContact();
      unsubSocial();
      unsubDirector();
      unsubTeachers();
      unsubSlides();
      unsubCourses();
      unsubBookings();
    };
  }, [isAdmin]);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
  };

  const handleNewBooking = (booking: BookingSubmission) => {
    setBookings((prev) => [booking, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb] text-gray-900 selection:bg-[#2c5f2d] selection:text-[#ffd700]">
      <Head>
        <title>ইথাগোরাস প্রাইভেট | Ether Education Platform — নওগাঁ</title>
        <meta
          name="description"
          content="ইথাগোরাস প্রাইভেট (Ether Education Platform) - নওগাঁর শীর্ষস্থানীয় ডিজিটাল কোচিং সেন্টার। আধুনিক স্মার্ট ক্লাসরুম, কুইজ ইঞ্জিন ও অভিজ্ঞ শিক্ষকমণ্ডলী।"
        />
      </Head>

      {/* Navigation Bar */}
      <Navbar currentRoute={currentRoute} navigate={navigate} contactSettings={contactSettings} />

      {/* Main Page Routing Switcher */}
      <main className="flex-1">
        {currentRoute === '#/quiz' ? (
          <QuizEngine navigate={navigate} />
        ) : currentRoute === '#/admission' ? (
          <AdmissionForm onSuccessBooking={handleNewBooking} navigate={navigate} />
        ) : currentRoute === '#/faculty' ? (
          <FacultySection director={director} teachers={teachers} navigate={navigate} />
        ) : currentRoute === '#/profile' ? (
          <UserProfileView navigate={navigate} />
        ) : currentRoute === '#/admin' ? (
          <AdminDashboard
            slides={slides}
            bookings={bookings}
            contactSettings={contactSettings}
            socialSettings={socialSettings}
            director={director}
            teachers={teachers}
            courses={courses}
            navigate={navigate}
          />
        ) : currentRoute === '#/courses' ? (
          <CoursesSection courses={courses} navigate={navigate} />
        ) : (
          /* Default Landing Page: '#/' */
          <div className="space-y-12 sm:space-y-20 pb-16">
            {/* Dynamic Hero Slideshow */}
            <HeroSlideshow slides={slides} navigate={navigate} />

            {/* Feature Highlights with Ether Aesthetic */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Feature 1 */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl ether-card relative overflow-hidden group">
                  <div className="w-14 h-14 rounded-2xl bg-[#2c5f2d]/10 text-[#2c5f2d] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-8 h-8 text-[#2c5f2d]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
                    সেরা শিক্ষকমণ্ডলী ও মেন্টর
                  </h3>
                  <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6">
                    বুয়েট, ঢাকা বিশ্ববিদ্যালয় এবং রাজশাহী বিশ্ববিদ্যালয়ের অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক দ্বারা পরিচালিত পাঠদান।
                  </p>
                  <button
                    onClick={() => navigate('#/faculty')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#2c5f2d] hover:text-[#1e421f]"
                  >
                    <span>শিক্ষক ও পরিচালকের প্রোফাইল দেখুন</span>
                    <ArrowRight className="w-4 h-4 text-[#ffd700]" />
                  </button>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl ether-card relative overflow-hidden group">
                  <div className="w-14 h-14 rounded-2xl bg-[#ffd700]/20 text-[#2c5f2d] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Trophy className="w-8 h-8 text-[#2c5f2d]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
                    স্মার্ট কুইজ ও স্কলারশিপ
                  </h3>
                  <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6">
                    সার্ভার-সাইড ভেরিফাইড এজ ইঞ্জিনের মাধ্যমে তাৎক্ষণিক মেধা যাচাই ও আকর্ষণীয় মেধা বৃত্তি প্রদান।
                  </p>
                  <button
                    onClick={() => navigate('#/quiz')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#2c5f2d] hover:text-[#1e421f]"
                  >
                    <span>কুইজে অংশ নিন</span>
                    <ArrowRight className="w-4 h-4 text-[#ffd700]" />
                  </button>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl ether-card relative overflow-hidden group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#2c5f2d] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-[#2c5f2d]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
                    ডিজিটাল ক্লাসরুম ও ল্যাব
                  </h3>
                  <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6">
                    হাই-স্পিড ওয়াইফাই, মাল্টিমিডিয়া প্রজেকশন এবং শীতাতপ নিয়ন্ত্রিত মনোরম ক্লাসরুম পরিবেশ।
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2c5f2d]">
                    <CheckCircle className="w-4 h-4 text-[#ffd700]" />
                    <span>নওগাঁ সদর শহরের প্রাণকেন্দ্রে ক্যাম্পাস</span>
                  </div>
                </div>

              </div>
            </section>

            {/* Director Spotlight on Homepage */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-emerald-950 via-[#2c5f2d] to-[#1f4420] rounded-[3rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-4 flex justify-center">
                    <div className="w-48 h-56 sm:w-56 sm:h-64 rounded-3xl overflow-hidden border-4 border-[#ffd700]/50 shadow-2xl relative bg-black/30">
                      <img
                        src={director.photoUrl}
                        alt={director.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/20 text-[#ffd700] text-xs font-bold">
                      <Quote className="w-3.5 h-3.5" />
                      <span>পরিচালকের অনুপ্রেরণামূলক বার্তা</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{director.name}</h3>
                    <p className="text-xs sm:text-sm text-[#ffd700] font-bold">{director.designation} • {director.qualifications}</p>
                    <p className="text-gray-200 text-sm leading-relaxed line-clamp-3 italic">
                      "{director.message}"
                    </p>
                    <div className="pt-2 flex gap-4">
                      <button
                        onClick={() => navigate('#/faculty')}
                        className="px-5 py-2.5 bg-white text-gray-900 rounded-2xl text-xs font-bold hover:bg-gray-100 transition-colors"
                      >
                        সম্পূর্ণ বার্তা ও শিক্ষকবৃন্দ
                      </button>
                      <button
                        onClick={() => navigate('#/admission')}
                        className="px-5 py-2.5 bg-[#ffd700] text-gray-950 rounded-2xl text-xs font-bold hover:bg-[#e6c200] transition-colors"
                      >
                        ভর্তি আবেদন
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Courses Overview Section */}
            <CoursesSection navigate={navigate} />

            {/* Teachers Preview Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                    আমাদের নিবেদিতপ্রাণ শিক্ষকবৃন্দ
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    প্রতিটি বিষয়ের জন্য আলাদা অভিজ্ঞ ও বিশেষজ্ঞ শিক্ষক
                  </p>
                </div>
                <button
                  onClick={() => navigate('#/faculty')}
                  className="text-xs sm:text-sm font-bold text-[#2c5f2d] hover:underline flex items-center gap-1"
                >
                  <span>সব শিক্ষক দেখুন</span>
                  <ArrowRight className="w-4 h-4 text-[#ffd700]" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teachers.slice(0, 4).map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-[2rem] overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all p-4 ether-card"
                  >
                    <div className="h-48 rounded-2xl overflow-hidden mb-3 bg-gray-100 relative">
                      <img
                        src={teacher.photoUrl}
                        alt={teacher.name}
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute top-2 right-2 bg-[#ffd700] text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                        {teacher.subject}
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 text-sm">{teacher.name}</h4>
                    <p className="text-xs text-[#2c5f2d] font-semibold">{teacher.qualifications}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{teacher.experience}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Callout Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-[3rem] bg-gradient-to-r from-[#2c5f2d] via-[#245025] to-[#183919] p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/25 text-[#ffd700] text-xs font-bold mb-4 border border-[#ffd700]/50">
                    <Star className="w-3.5 h-3.5 fill-[#ffd700]" />
                    <span>সীমিত আসন সংখ্যা</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black mb-4 leading-tight">
                    আজই আপনার আসন নিশ্চিত করে ভবিষ্যতের পথে এক ধাপ এগিয়ে থাকুন
                  </h2>
                  <p className="text-gray-200 text-sm sm:text-base mb-8 font-medium">
                    অনলাইনে ঘরে বসেই ভর্তি ফর্ম পূরণ করুন অথবা সরাসরি নওগাঁ ক্যাম্পাসে এসে আমাদের কাউন্সিলরদের সাথে পরামর্শ নিন।
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => navigate('#/admission')}
                      className="px-8 py-4 rounded-3xl bg-[#ffd700] text-gray-950 font-black text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                      ভর্তি ফরম পূরণ করুন
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('#/quiz')}
                      className="px-6 py-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
                    >
                      মেধা যাচাই কুইজ
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        navigate={navigate}
        contactSettings={contactSettings}
        socialSettings={socialSettings}
      />
    </div>
  );
}
