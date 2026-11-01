import React, { useState, useEffect } from 'react';
import {
  User,
  Award,
  BookOpen,
  GraduationCap,
  Save,
  Upload,
  Printer,
  CheckCircle2,
  Calendar,
  Sparkles,
  School,
  Phone,
  Mail,
  MapPin,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { UserProfile, Certificate } from '../lib/types';
import {
  subscribeUserProfile,
  saveUserProfile,
  subscribeUserCertificates,
} from '../lib/firestoreService';
import { CertificateView } from './CertificateView';

interface UserProfileViewProps {
  navigate: (route: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ navigate }) => {
  const { user, signInWithGoogle } = useAuth();

  const [profile, setProfile] = useState<UserProfile>({
    uid: '',
    email: '',
    studentName: '',
    fatherName: '',
    motherName: '',
    photoUrl: '',
    phone: '',
    schoolName: '',
    grade: 'দশম শ্রেণী (Class 10)',
    rollNo: '',
    subjectGroup: 'বিজ্ঞান বিভাগ (Science)',
    address: 'নওগাঁ সদর, নওগাঁ',
  });

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Load from Firestore
    const unsubProfile = subscribeUserProfile(user.uid, (existing) => {
      if (existing) {
        setProfile(existing);
      } else {
        // Pre-fill with Google info
        setProfile((prev) => ({
          ...prev,
          uid: user.uid,
          email: user.email || '',
          studentName: prev.studentName || user.displayName || '',
          photoUrl: prev.photoUrl || user.photoURL || '',
        }));
      }
    });

    const unsubCerts = subscribeUserCertificates(user.uid, (certs) => {
      setCertificates(certs);
    });

    return () => {
      unsubProfile();
      unsubCerts();
    };
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ছবির আকার সর্বোচ্চ ২ মেগাবাইট হতে পারবে।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProfile((prev) => ({ ...prev, photoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setIsSaving(true);
      await saveUserProfile({
        ...profile,
        uid: user.uid,
        email: user.email || profile.email,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('প্রোফাইল সংরক্ষণে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-gray-100 ether-card">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-[#2c5f2d]/10 text-[#2c5f2d] flex items-center justify-center font-black text-3xl shadow-md">
            <User className="w-10 h-10 text-[#2c5f2d]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
            শিক্ষার্থী প্রোফাইল লগইন
          </h2>
          <p className="text-gray-600 text-sm font-medium mb-6 leading-relaxed">
            আপনার প্রোফাইল তথ্য পূরণ করতে এবং কুইজের শীর্ষ ১০ বা কোর্স সমাপ্তি সনদপত্র দেখতে আপনার গুগল জিমেইল দিয়ে সাইন ইন করুন।
          </p>

          <button
            onClick={signInWithGoogle}
            className="w-full py-4 rounded-2xl bg-[#2c5f2d] hover:bg-[#224b23] text-white font-bold text-base shadow-xl flex items-center justify-center gap-3 transition-all"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5 bg-white rounded-full p-0.5"
            />
            <span>জিমেইল দিয়ে লগইন করুন</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#2c5f2d] via-[#245025] to-[#183919] rounded-[2.5rem] p-6 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-4 border-[#ffd700] shadow-xl bg-gray-100 shrink-0">
              <img
                src={profile.photoUrl || user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ffd700]/25 text-[#ffd700] text-xs font-black mb-2 border border-[#ffd700]/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ইথাগোরাস নিবন্ধিত শিক্ষার্থী</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {profile.studentName || user.displayName || 'নাম প্রদান করুন'}
              </h2>
              <p className="text-gray-200 text-xs sm:text-sm font-medium mt-1">
                {profile.schoolName ? `${profile.schoolName} • ` : ''}{profile.grade}
              </p>
              <p className="text-gray-300 text-xs font-mono">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="block text-xl font-black text-[#ffd700]">{certificates.length}</span>
              <span className="text-[11px] font-bold text-gray-200">অর্জিত সনদপত্র</span>
            </div>
            <button
              onClick={() => navigate('#/quiz')}
              className="px-5 py-3 rounded-2xl bg-[#ffd700] hover:bg-[#e6c200] text-gray-950 font-black text-xs shadow-lg transition-all"
            >
              কুইজ খেলুন ও সনদ অর্জন করুন
            </button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl font-bold text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>আপনার প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Edit Profile Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#2c5f2d]" />
                শিক্ষার্থী প্রোফাইল বিবরণ
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                আপনার সঠিক একাডেমিক ও ব্যক্তিগত তথ্য প্রদান করুন। এটি সনদপত্রে ব্যবহৃত হবে।
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Photo Upload Row */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 shrink-0 border">
                <img
                  src={profile.photoUrl || user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2c5f2d] text-white text-xs font-bold hover:bg-[#224b23]">
                  <Upload className="w-3 h-3" />
                  <span>প্রোফাইল ছবি আপলোড</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <input
                  type="url"
                  placeholder="অথবা ছবির URL দিন"
                  value={profile.photoUrl || ''}
                  onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  শিক্ষার্থীর পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদা: তাহমিদ হাসান"
                  value={profile.studentName}
                  onChange={(e) => setProfile({ ...profile, studentName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2c5f2d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  সচল মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  placeholder="০১৭xxxxxxxx"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2c5f2d] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  পিতার নাম
                </label>
                <input
                  type="text"
                  placeholder="পিতার নাম"
                  value={profile.fatherName}
                  onChange={(e) => setProfile({ ...profile, fatherName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  মাতার নাম
                </label>
                <input
                  type="text"
                  placeholder="মাতার নাম"
                  value={profile.motherName}
                  onChange={(e) => setProfile({ ...profile, motherName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  বিদ্যালয় / কলেজের নাম *
                </label>
                <input
                  type="text"
                  placeholder="উদা: নওগাঁ জিলা স্কুল"
                  value={profile.schoolName}
                  onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  শ্রেণী রোল নং
                </label>
                <input
                  type="text"
                  placeholder="উদা: ১২"
                  value={profile.rollNo}
                  onChange={(e) => setProfile({ ...profile, rollNo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  শ্রেণী / ব্যাচ
                </label>
                <select
                  value={profile.grade}
                  onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                >
                  <option value="নবম শ্রেণী (Class 9)">নবম শ্রেণী (Class 9)</option>
                  <option value="দশম শ্রেণী (Class 10 - SSC 2026)">দশম শ্রেণী (Class 10 - SSC 2026)</option>
                  <option value="একাদশ শ্রেণী (HSC 1st Year)">একাদশ শ্রেণী (HSC 1st Year)</option>
                  <option value="দ্বাদশ শ্রেণী (HSC 2nd Year)">দ্বাদশ শ্রেণী (HSC 2nd Year)</option>
                  <option value="অলিম্পিয়াড ফাউন্ডেশন">অলিম্পিয়াড ফাউন্ডেশন</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  বিভাগ / সাবজেক্ট গ্রুপ
                </label>
                <select
                  value={profile.subjectGroup}
                  onChange={(e) => setProfile({ ...profile, subjectGroup: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                >
                  <option value="বিজ্ঞান বিভাগ (Science)">বিজ্ঞান বিভাগ (Science)</option>
                  <option value="ব্যবসায় শিক্ষা (Commerce)">ব্যবসায় শিক্ষা (Commerce)</option>
                  <option value="মানবিক বিভাগ (Humanities)">মানবিক বিভাগ (Humanities)</option>
                  <option value="সাধারণ শিক্ষা (General)">সাধারণ শিক্ষা (General)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                স্থায়ী / বর্তমান ঠিকানা
              </label>
              <input
                type="text"
                placeholder="নওগাঁ সদর, নওগাঁ"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 rounded-2xl bg-[#2c5f2d] hover:bg-[#224b23] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#ffd700]" />
                <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল আপডেট করুন'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Certificate Showcase */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#ffd700]" />
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    অর্জিত অফিসিয়াল সনদপত্র
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    আপনার প্রোফাইল সার্টিফিকেট গ্যালারি
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#2c5f2d]">
                {certificates.length} টি
              </span>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-10 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm">
                  এখনো কোনো সনদপত্র পাওয়া যায়নি
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                  কুইজ খেলায় অংশগ্রহণ করে শীর্ষ ১০ জনের মধ্যে স্থান অর্জন করুন অথবা কোনো কোর্স সফলভাবে সম্পন্ন করলে আপনার সনদপত্র এখানে প্রদর্শিত হবে।
                </p>
                <button
                  onClick={() => navigate('#/quiz')}
                  className="px-5 py-2.5 rounded-xl bg-[#2c5f2d] text-white text-xs font-bold hover:bg-[#224b23] shadow transition-all inline-block mt-2"
                >
                  মেধা যাচাই কুইজে অংশ নিন
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl border-2 border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 hover:border-[#2c5f2d] transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2c5f2d] text-[#ffd700] flex items-center justify-center shrink-0 shadow-md">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold bg-[#ffd700] text-gray-950 px-2 py-0.5 rounded-full inline-block mb-1">
                          {cert.type === 'merit_top10' ? 'শীর্ষ ১০ মেধা সনদ' : 'কোর্স সমাপন সনদ'}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm leading-snug">{cert.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{cert.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500 font-mono">
                          <span>নং: {cert.certificateNumber}</span>
                          <span>•</span>
                          <span>তারিখ: {cert.issueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200/70 mt-3 flex justify-end">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="px-4 py-2 rounded-xl bg-[#2c5f2d] hover:bg-[#224b23] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>সনদপত্র দেখুন ও প্রিন্ট করুন</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Certificate Print & Preview Modal */}
      {selectedCert && (
        <CertificateView
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};
