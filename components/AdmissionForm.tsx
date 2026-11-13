import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, ArrowRight, ArrowLeft, Shield, FileText, Sparkles, School, Video } from 'lucide-react';
import { BookingSubmission, OnlineBatch, Course } from '../lib/types';
import { addBooking } from '../lib/firestoreService';
import { useAuth } from '../lib/AuthContext';

interface AdmissionFormProps {
  onSuccessBooking: (booking: BookingSubmission) => void;
  navigate: (route: string) => void;
  defaultLearningMode?: 'Online' | 'Offline';
  defaultCourse?: string;
  onlineBatches?: OnlineBatch[];
  courses?: Course[];
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({
  onSuccessBooking,
  navigate,
  defaultLearningMode = 'Online',
  defaultCourse = '',
  onlineBatches = [],
  courses = [],
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedBooking, setSubmittedBooking] = useState<BookingSubmission | null>(null);

  const [formData, setFormData] = useState({
    studentName: '',
    guardianName: '',
    phone: '',
    email: '',
    schoolName: '',
    grade: 'দশম শ্রেণী (Class 10 - SSC 2026)',
    learningMode: defaultLearningMode as 'Online' | 'Offline',
    courseSelected: defaultCourse || 'এসএসসি বিজ্ঞান অনলাইন লাইভ ব্যাচ (Class 9-10)',
    shiftPreference: 'Evening' as 'Morning' | 'Day' | 'Evening',
    address: 'বদলগাছী সদর, নওগাঁ',
    notes: '',
  });

  useEffect(() => {
    if (defaultLearningMode) {
      setFormData((prev) => ({ ...prev, learningMode: defaultLearningMode }));
    }
  }, [defaultLearningMode]);

  useEffect(() => {
    if (defaultCourse) {
      setFormData((prev) => ({ ...prev, courseSelected: defaultCourse }));
    }
  }, [defaultCourse]);

  // Pre-fill user info if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        studentName: prev.studentName || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.studentName.trim()) errs.studentName = 'শিক্ষার্থীর নাম আবশ্যক';
      if (!formData.guardianName.trim()) errs.guardianName = 'অভিভাবকের নাম আবশ্যক';
      if (!formData.phone.trim()) errs.phone = 'সচল মোবাইল নম্বর আবশ্যক';
    } else if (currentStep === 2) {
      if (!formData.schoolName.trim()) errs.schoolName = 'বিদ্যালয়ের নাম আবশ্যক';
      if (!formData.grade.trim()) errs.grade = 'শ্রেণী/ক্লাস আবশ্যক';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    try {
      setSubmitting(true);
      const newBooking: BookingSubmission = {
        id: `BK-${Date.now().toString().slice(-6)}`,
        ...(user?.uid ? { userId: user.uid } : {}),
        studentName: formData.studentName,
        guardianName: formData.guardianName,
        phone: formData.phone,
        email: formData.email,
        schoolName: formData.schoolName,
        grade: formData.grade,
        courseSelected: formData.courseSelected,
        learningMode: formData.learningMode,
        shiftPreference: formData.shiftPreference,
        address: formData.address,
        notes: formData.notes,
        submittedAt: new Date().toLocaleString('bn-BD'),
        status: 'Pending',
      };

      // Persist to Firestore
      await addBooking(newBooking);

      onSuccessBooking(newBooking);
      setSubmittedBooking(newBooking);
    } catch (err) {
      console.error('Booking submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2c5f2d]/10 text-[#2c5f2d] font-bold text-xs uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-[#ffd700]" />
          <span>অনলাইন অ্যাডমিশন পোর্টাল (Firebase Firestore)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
          ইথাগোরাস প্রাইভেট ভর্তি আবেদন
        </h2>
        <p className="text-gray-600 font-medium text-base sm:text-lg">
          নিচের তথ্যগুলো যথাযথভাবে পূরণ করে আপনার আসন নিশ্চিত করুন।
        </p>
      </div>

      {/* Stepper Progress */}
      {!submittedBooking && (
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-0 -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#2c5f2d] -z-0 -translate-y-1/2 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step >= s
                      ? 'bg-[#2c5f2d] text-[#ffd700] shadow-md shadow-[#2c5f2d]/30'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {s}
                </div>
                <span className="text-[11px] font-bold mt-2 text-gray-600 hidden sm:block">
                  {s === 1 ? 'শিক্ষার্থী' : s === 2 ? 'একাডেমিক' : s === 3 ? 'কোর্স নির্বাচন' : 'নিশ্চিতকরণ'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-gray-100 ether-card">
        {submittedBooking ? (
          /* Confirmation Slip */
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-emerald-100 text-[#2c5f2d] flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#2c5f2d]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              ভর্তি আবেদন সফলভাবে সম্পন্ন হয়েছে!
            </h3>
            <p className="text-gray-600 font-medium mb-6">
              আপনার বুকিং রেফারেন্স আইডি:{' '}
              <span className="font-mono font-bold text-[#2c5f2d] bg-emerald-50 px-3 py-1 rounded-xl text-lg">
                {submittedBooking.id}
              </span>
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-2 mb-8 border border-gray-200 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">শিক্ষার্থীর নাম:</span>
                <span className="font-bold text-gray-900">{submittedBooking.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">অভিভাবক:</span>
                <span className="font-bold text-gray-900">{submittedBooking.guardianName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">নির্বাচিত কোর্স:</span>
                <span className="font-bold text-[#2c5f2d]">{submittedBooking.courseSelected}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">পড়াশোনার মাধ্যম:</span>
                <span className="font-bold text-gray-900">
                  {submittedBooking.learningMode === 'Online' ? 'অনলাইন লাইভ ব্যাচ' : 'অফলাইন ক্যাম্পাস ব্যাচ'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">শিফট:</span>
                <span className="font-bold text-gray-900">{submittedBooking.shiftPreference} Shift</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-medium">আবেদনের স্থিতি:</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {submittedBooking.status} (যাচাই চলছে)
                </span>
              </div>
            </div>

            {submittedBooking.learningMode === 'Online' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-lg mx-auto mb-6 text-xs sm:text-sm text-emerald-900 font-medium">
                অনলাইন লাইভ ব্যাচের অনুমোদন হয়ে গেলে আপনার জিমেইল আইডি দিয়ে লগইন করে সরাসরি{' '}
                <button
                  type="button"
                  onClick={() => navigate('#/online-batch')}
                  className="font-black underline text-[#2c5f2d]"
                >
                  অনলাইন ব্যাচ পোর্টাল
                </button>{' '}
                থেকে লাইভ ক্লাসে যুক্ত হতে পারবেন।
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center">
              {submittedBooking.learningMode === 'Online' && (
                <button
                  onClick={() => navigate('#/online-batch')}
                  className="px-6 py-3 rounded-2xl bg-[#ffd700] hover:bg-[#e6c200] font-black text-sm text-gray-950 shadow-md transition-colors flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>অনলাইন ব্যাচ পোর্টাল দেখুন</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSubmittedBooking(null);
                  setStep(1);
                }}
                className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 font-bold text-sm text-gray-700 transition-colors"
              >
                আরেকটি আবেদন করুন
              </button>
              <button
                onClick={() => navigate('#/')}
                className="px-6 py-3 rounded-2xl bg-[#2c5f2d] text-white font-bold text-sm hover:bg-[#234b24] shadow-md transition-all flex items-center gap-2"
              >
                <span>হোমে ফিরে যান</span>
                <ArrowRight className="w-4 h-4 text-[#ffd700]" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                  <UserCheck className="w-5 h-5 text-[#2c5f2d]" />
                  ধাপ ১: শিক্ষার্থীর ব্যক্তিগত তথ্য
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      শিক্ষার্থীর নাম *
                    </label>
                    <input
                      type="text"
                      placeholder="পুরো নাম বাংলায় বা ইংরেজিতে"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                    />
                    {errors.studentName && <p className="text-xs text-red-500 mt-1">{errors.studentName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      অভিভাবকের নাম *
                    </label>
                    <input
                      type="text"
                      placeholder="পিতা / মাতার নাম"
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                    />
                    {errors.guardianName && <p className="text-xs text-red-500 mt-1">{errors.guardianName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      সচল ফোন নম্বর *
                    </label>
                    <input
                      type="tel"
                      placeholder="০১৭xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      ইমেইল (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    বর্তমান ঠিকানা (নওগাঁ / উপজেলা)
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Academic Info */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                  <School className="w-5 h-5 text-[#2c5f2d]" />
                  ধাপ ২: বর্তমান শিক্ষাগত বিবরণ
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    বর্তমান বিদ্যালয় / কলেজের নাম *
                  </label>
                  <input
                    type="text"
                    placeholder="উদা: নওগাঁ জিলা স্কুল / সরকারি বালিকা উচ্চ বিদ্যালয়"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                  />
                  {errors.schoolName && <p className="text-xs text-red-500 mt-1">{errors.schoolName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    শ্রেণী / ব্যাচ *
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c5f2d] bg-white font-medium"
                  >
                    <option value="নবম শ্রেণী (Class 9)">নবম শ্রেণী (Class 9)</option>
                    <option value="দশম শ্রেণী (Class 10 - SSC 2026)">দশম শ্রেণী (Class 10 - SSC 2026)</option>
                    <option value="একাদশ শ্রেণী (HSC 1st Year)">একাদশ শ্রেণী (HSC 1st Year)</option>
                    <option value="দ্বাদশ শ্রেণী (HSC 2nd Year)">দ্বাদশ শ্রেণী (HSC 2nd Year)</option>
                    <option value="অলিম্পিয়াড ফাউন্ডেশন">অলিম্পিয়াড ফাউন্ডেশন (Class 6-8)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Batch Mode & Course Selection */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                  <FileText className="w-5 h-5 text-[#2c5f2d]" />
                  ধাপ ৩: পড়াশোনার মাধ্যম, কোর্স ও শিফট নির্বাচন
                </h3>

                {/* Online vs Offline Batch Mode */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    কোন মাধ্যমে পড়তে চান? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const firstOnline = onlineBatches[0]?.title || 'এসএসসি বিজ্ঞান অনলাইন লাইভ ব্যাচ (Class 9-10)';
                        setFormData({
                          ...formData,
                          learningMode: 'Online',
                          courseSelected: firstOnline,
                        });
                      }}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        formData.learningMode === 'Online'
                          ? 'bg-[#2c5f2d] text-white border-[#2c5f2d] shadow-md'
                          : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-black text-sm flex items-center gap-2">
                        <Video className={`w-4 h-4 ${formData.learningMode === 'Online' ? 'text-[#ffd700]' : 'text-[#2c5f2d]'}`} />
                        <span>অনলাইন লাইভ ব্যাচ (Online Batch)</span>
                      </div>
                      <p className={`text-xs mt-1 ${formData.learningMode === 'Online' ? 'text-gray-200' : 'text-gray-500'}`}>
                        ঘরে বসেই Google Meet / Zoom-এ লাইভ ক্লাস ও PDF নোটস
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const firstOffline = courses[0]?.title || 'বিজ্ঞান বিশেষ ব্যাচ (Special Science Batch)';
                        setFormData({
                          ...formData,
                          learningMode: 'Offline',
                          courseSelected: firstOffline,
                        });
                      }}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        formData.learningMode === 'Offline'
                          ? 'bg-[#2c5f2d] text-white border-[#2c5f2d] shadow-md'
                          : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-black text-sm flex items-center gap-2">
                        <School className={`w-4 h-4 ${formData.learningMode === 'Offline' ? 'text-[#ffd700]' : 'text-[#2c5f2d]'}`} />
                        <span>অফলাইন ক্যাম্পাস ব্যাচ (Offline Campus)</span>
                      </div>
                      <p className={`text-xs mt-1 ${formData.learningMode === 'Offline' ? 'text-gray-200' : 'text-gray-500'}`}>
                        বদলগাছী সদর ক্যাম্পাসে সরাসরি স্মার্ট ক্লাসরুমে পাঠদান
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {formData.learningMode === 'Online' ? 'অনলাইন ব্যাচ নির্বাচন করুন' : 'পছন্দের কোর্স নির্বাচন করুন'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(formData.learningMode === 'Online'
                      ? (onlineBatches.length > 0
                          ? onlineBatches.map((b) => b.title)
                          : [
                              'এসএসসি বিজ্ঞান অনলাইন লাইভ ব্যাচ (Class 9-10)',
                              'এইচএসসি বিজ্ঞান প্রি-এডমিশন অনলাইন ব্যাচ (Class 11-12)',
                              'জুনিয়র ম্যাথ ও সায়েন্স ফাউন্ডেশন অনলাইন ব্যাচ (Class 6-8)',
                              'ইংরেজি গ্রামার ও স্পোকেন অনলাইন স্পেশাল ব্যাচ',
                            ])
                      : (courses.length > 0
                          ? courses.map((c) => c.title)
                          : [
                              'বিজ্ঞান বিশেষ ব্যাচ (Special Science Batch)',
                              'উচ্চতর গণিত ও পদার্থবিজ্ঞান স্পেশাল',
                              'অল-ইন-ওয়ান ফাউন্ডেশন কোর্স (All-in-One)',
                              'মেধাবী স্কলারশিপ ব্যাচ (Olympiad)',
                            ])
                    ).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData({ ...formData, courseSelected: c })}
                        className={`p-4 rounded-2xl text-left border font-semibold text-sm transition-all ${
                          formData.courseSelected === c
                            ? 'bg-[#2c5f2d] text-white border-[#2c5f2d] shadow-md shadow-[#2c5f2d]/20'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    সুবিধাজনক সময় (Shift Preference)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Morning', 'Day', 'Evening'] as const).map((shift) => (
                      <button
                        key={shift}
                        type="button"
                        onClick={() => setFormData({ ...formData, shiftPreference: shift })}
                        className={`p-3 rounded-xl border text-center font-bold text-sm transition-all ${
                          formData.shiftPreference === shift
                            ? 'bg-[#ffd700] text-gray-900 border-[#ffd700] shadow'
                            : 'bg-white text-gray-600 border-gray-200'
                        }`}
                      >
                        {shift === 'Morning' ? 'সকাল (৭:০০ - ৯:০০)' : shift === 'Day' ? 'দুপুর (২:০০ - ৪:০০)' : 'সন্ধ্যা (৫:০০ - ৯:০০)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    বিশেষ কোনো জিজ্ঞাসা বা মন্তব্য (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="যেকোনো বিশেষ প্রয়োজনীয়তা বা লক্ষ্য..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Final Review */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Shield className="w-5 h-5 text-[#2c5f2d]" />
                  ধাপ ৪: তথ্য পর্যালোচনা ও সাবমিশন
                </h3>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">শিক্ষার্থী:</span>
                    <span className="font-bold text-gray-900">{formData.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">অভিভাবক:</span>
                    <span className="font-bold text-gray-900">{formData.guardianName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">মোবাইল:</span>
                    <span className="font-bold text-gray-900">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">প্রতিষ্ঠান:</span>
                    <span className="font-bold text-gray-900">{formData.schoolName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">ব্যাচের ধরণ:</span>
                    <span className="font-bold text-[#2c5f2d]">
                      {formData.learningMode === 'Online' ? 'অনলাইন লাইভ ব্যাচ' : 'অফলাইন ক্যাম্পাস ব্যাচ'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">কোর্স:</span>
                    <span className="font-bold text-[#2c5f2d]">{formData.courseSelected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">শিফট:</span>
                    <span className="font-bold text-gray-900">{formData.shiftPreference} Shift</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 font-medium bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 text-emerald-900">
                  ✓ সাবমিটের পর তথ্যটি ফায়ারবেস ক্লাউড ডাটাবেজে সংরক্ষিত হবে এবং অ্যাডমিন প্যানেল থেকে আবেদনটি যাচাই করা হবে।
                </div>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  পূর্ববর্তী
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-2xl bg-[#2c5f2d] hover:bg-[#234b24] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  পরবর্তী ধাপ
                  <ArrowRight className="w-4 h-4 text-[#ffd700]" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#ffd700] to-[#e6c200] text-gray-900 font-black text-base shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  {submitting ? 'সংরক্ষণ হচ্ছে...' : 'ভর্তি আবেদন নিশ্চিত করুন'}
                  <CheckCircle2 className="w-5 h-5 text-emerald-900" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
