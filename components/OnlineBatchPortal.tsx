import React, { useState, useEffect, useMemo } from 'react';
import {
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  BookOpen,
  UserCheck,
  Sparkles,
  LogIn,
} from 'lucide-react';
import { OnlineBatch, BookingSubmission, ContactSettings } from '../lib/types';
import { useAuth } from '../lib/AuthContext';
import { subscribeUserBookings } from '../lib/firestoreService';

interface OnlineBatchPortalProps {
  batches: OnlineBatch[];
  contactSettings: ContactSettings;
  navigate: (route: string) => void;
  onSelectOnlineBatchForAdmission: (batchTitle: string) => void;
}

export const OnlineBatchPortal: React.FC<OnlineBatchPortalProps> = ({
  batches,
  contactSettings,
  navigate,
  onSelectOnlineBatchForAdmission,
}) => {
  const { user, isAdmin, signInWithGoogle } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [userBookings, setUserBookings] = useState<BookingSubmission[]>([]);

  useEffect(() => {
    if (!user?.uid) {
      setUserBookings([]);
      return;
    }
    const unsub = subscribeUserBookings(user.uid, setUserBookings);
    return () => unsub();
  }, [user?.uid]);

  const activeBatches = useMemo(() => batches.filter((b) => b.active !== false), [batches]);

  const classOptions = useMemo(() => {
    const unique = Array.from(new Set(activeBatches.map((b) => b.classLevel)));
    return ['all', ...unique];
  }, [activeBatches]);

  const filteredBatches = useMemo(() => {
    if (selectedClass === 'all') return activeBatches;
    return activeBatches.filter((b) => b.classLevel === selectedClass);
  }, [activeBatches, selectedClass]);

  const onlineBookings = useMemo(
    () => userBookings.filter((b) => b.learningMode === 'Online' || b.courseSelected.includes('অনলাইন')),
    [userBookings]
  );

  const approvedOnlineBooking = useMemo(
    () => onlineBookings.find((b) => b.status === 'Approved'),
    [onlineBookings]
  );

  const pendingOnlineBooking = useMemo(
    () => onlineBookings.find((b) => b.status !== 'Approved'),
    [onlineBookings]
  );

  const cleanWhatsapp = (contactSettings?.whatsapp || '+8801700000000').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#1d461e] via-[#2c5f2d] to-[#173618] rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-bold text-[#ffd700] tracking-wide">
            অনলাইন লাইভ শিক্ষা কার্যক্রম · ঘরে বসেই সেরা প্রস্তুতি
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            অনলাইন লাইভ ব্যাচ পোর্টাল
          </h1>
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-medium">
            যারা অনলাইনে ভর্তি আবেদন করবেন, তাদের জন্য রয়েছে সরাসরি লাইভ ক্লাস, ডিজিটাল বোর্ড সমাধান, সাপ্তাহিক কুইজ এবং সম্পূর্ণ অধ্যায়ভিত্তিক PDF নোটস।
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectOnlineBatchForAdmission(activeBatches[0]?.title || '')}
              className="px-6 py-3 rounded-2xl bg-[#ffd700] hover:bg-[#e6c200] text-gray-950 font-black text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>অনলাইন ব্যাচে ভর্তি আবেদন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('#/notes')}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4 text-[#ffd700]" />
              <span>ফ্রী হুক নোটস দেখুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Step Online Study Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-bold text-[#2c5f2d] tabular-nums">ধাপ ০১</p>
          <h3 className="text-lg font-black text-gray-900">অনলাইন ভর্তি আবেদন</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            ভর্তি ফরমে গিয়ে &ldquo;অনলাইন লাইভ ব্যাচ&rdquo; নির্বাচন করে আপনার নাম, ক্লাস ও পছন্দের ব্যাচ সাবমিট করুন।
          </p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-bold text-[#2c5f2d] tabular-nums">ধাপ ০২</p>
          <h3 className="text-lg font-black text-gray-900">আবেদন যাচাই ও অনুমোদন</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            অ্যাডমিন আপনার আবেদন অনুমোদন করার সাথে সাথেই জিমেইল দিয়ে লগইন করে ক্লাসরুম লিংক পেয়ে যাবেন।
          </p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-bold text-[#2c5f2d] tabular-nums">ধাপ ০৩</p>
          <h3 className="text-lg font-black text-gray-900">লাইভ ক্লাস ও কুইজ</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            নির্ধারিত সময়সূচী অনুযায়ী Google Meet বা Zoom-এ সরাসরি শিক্ষকের সাথে ক্লাস ও মডেল টেস্টে অংশ নিন।
          </p>
        </div>
      </div>

      {/* Student Online Classroom Access Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        {!user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-[#2c5f2d]" />
                <span>ইতিমধ্যে অনলাইন ব্যাচে ভর্তি আবেদন করেছেন?</span>
              </h2>
              <p className="text-sm text-gray-600">
                আপনার আবেদনের অবস্থা দেখতে এবং অনুমোদিত লাইভ ক্লাসের লিংকে প্রবেশ করতে জিমেইল দিয়ে লগইন করুন।
              </p>
            </div>
            <button
              onClick={signInWithGoogle}
              className="px-5 py-3 rounded-2xl bg-[#2c5f2d] hover:bg-[#234b24] text-white font-bold text-sm flex items-center gap-2 shrink-0 whitespace-nowrap"
            >
              <LogIn className="w-4 h-4 text-[#ffd700]" />
              <span>জিমেইল দিয়ে লগইন করুন</span>
            </button>
          </div>
        ) : isAdmin || approvedOnlineBooking ? (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAdmin ? 'অ্যাডমিন ক্লাসরুম প্রিভিউ' : 'ভর্তি অনুমোদিত · অনলাইন ক্লাসরুম সক্রিয়'}</span>
                </p>
                <h2 className="text-xl font-black text-gray-900 mt-1">
                  আমার অনলাইন লাইভ ক্লাস রুম
                </h2>
              </div>
              {approvedOnlineBooking && (
                <div className="text-xs text-gray-600 font-semibold tabular-nums">
                  রেফারেন্স: <span className="font-mono font-bold text-[#2c5f2d]">{approvedOnlineBooking.id}</span>
                  {' · '}
                  <span>{approvedOnlineBooking.courseSelected}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-5 rounded-2xl bg-[#f9fafb] border border-gray-200 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="text-xs text-gray-500 font-semibold">
                      {batch.classLevel} · {batch.subject}
                    </div>
                    <h3 className="font-black text-gray-900 text-base">{batch.title}</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2c5f2d]" />
                      <span>{batch.schedule}</span>
                    </p>
                    {batch.nextTopic && (
                      <p className="text-xs text-[#2c5f2d] font-semibold pt-1">
                        পরবর্তী টপিক: {batch.nextTopic}
                      </p>
                    )}
                  </div>

                  {batch.meetingLink && (
                    <a
                      href={batch.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2c5f2d] hover:bg-[#234b24] text-white font-bold text-xs transition-colors"
                    >
                      <Video className="w-4 h-4 text-[#ffd700]" />
                      <span>লাইভ ক্লাসে যোগ দিন ({batch.platform})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : pendingOnlineBooking ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-700">
                আবেদন স্থিতি: {pendingOnlineBooking.status} · রেফারেন্স: {pendingOnlineBooking.id}
              </p>
              <h2 className="text-lg font-black text-gray-900">
                আপনার অনলাইন ব্যাচ ভর্তি আবেদনটি যাচাই করা হচ্ছে
              </h2>
              <p className="text-sm text-gray-600">
                নির্বাচিত ব্যাচ: {pendingOnlineBooking.courseSelected}। দ্রুত অনুমোদন ও লাইভ ক্লাসের রুটিন পেতে হোয়াটসঅ্যাপে যোগাযোগ করুন।
              </p>
            </div>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                `আসসালামু আলাইকুম, আমি অনলাইন ব্যাচে ভর্তি আবেদন করেছি।\nরেফারেন্স আইডি: ${pendingOnlineBooking.id}\nনাম: ${pendingOnlineBooking.studentName}\nব্যাচ: ${pendingOnlineBooking.courseSelected}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1fb857] text-white font-bold text-sm flex items-center gap-2 shrink-0 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে কনফার্ম করুন</span>
            </a>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#2c5f2d]" />
                <span>স্বাগতম, {user.displayName || user.email}</span>
              </h2>
              <p className="text-sm text-gray-600">
                আপনি এখনও কোনো অনলাইন ব্যাচে ভর্তি আবেদন করেননি। নিচের তালিকা থেকে পছন্দের ব্যাচে ভর্তি আবেদন করুন।
              </p>
            </div>
            <button
              onClick={() => onSelectOnlineBatchForAdmission(activeBatches[0]?.title || '')}
              className="px-5 py-3 rounded-2xl bg-[#ffd700] hover:bg-[#e6c200] text-gray-950 font-black text-sm shrink-0 whitespace-nowrap"
            >
              অনলাইন ভর্তি ফরম পূরণ করুন
            </button>
          </div>
        )}
      </div>

      {/* Filter & Online Batches Catalog */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              চলমান অনলাইন ব্যাচসমূহ
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              শ্রেণী অনুযায়ী আপনার উপযোগী অনলাইন ব্যাচ নির্বাচন করুন
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
            {classOptions.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  selectedClass === cls
                    ? 'bg-white text-[#2c5f2d] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cls === 'all' ? 'সকল শ্রেণী' : cls}
              </button>
            ))}
          </div>
        </div>

        {filteredBatches.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 text-gray-500 font-medium">
            এই শ্রেণীর জন্য বর্তমানে কোনো অনলাইন ব্যাচ পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-500 font-semibold">
                    <span>{batch.classLevel} · {batch.subject}</span>
                    <span className="text-base font-black text-[#2c5f2d] tabular-nums">{batch.monthlyFee}</span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 leading-snug">
                    {batch.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {batch.description}
                  </p>

                  <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-700 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2c5f2d] shrink-0" />
                      <span>সময়সূচী: {batch.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#2c5f2d] shrink-0" />
                      <span>মাধ্যম: {batch.platform}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#2c5f2d] shrink-0" />
                      <span>শিক্ষক: {batch.instructor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => onSelectOnlineBatchForAdmission(batch.title)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-[#2c5f2d] hover:bg-[#234b24] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>অনলাইন ব্যাচে ভর্তি আবেদন</span>
                    <ArrowRight className="w-4 h-4 text-[#ffd700]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
