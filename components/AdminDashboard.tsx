import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Share2,
  Database,
  Image,
  Users,
  Copy,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  MapPin,
  Globe,
  Upload,
  UserPlus,
  GraduationCap,
  MessageSquare,
  LogIn,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import {
  Slide,
  BookingSubmission,
  ContactSettings,
  SocialSettings,
  DirectorProfile,
  TeacherProfile,
} from '../lib/types';
import {
  updateContactSettings,
  updateSocialSettings,
  updateAdminEmails,
  updateDirector,
  saveTeacher,
  deleteTeacher,
  saveSlide,
  deleteSlide,
  updateBookingStatus,
  seedInitialDataToFirestore,
} from '../lib/firestoreService';

interface AdminDashboardProps {
  slides: Slide[];
  bookings: BookingSubmission[];
  contactSettings: ContactSettings;
  socialSettings: SocialSettings;
  director: DirectorProfile;
  teachers: TeacherProfile[];
  navigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  slides,
  bookings,
  contactSettings,
  socialSettings,
  director,
  teachers,
  navigate,
}) => {
  const { user, isAdmin, adminEmails, signInWithGoogle, signOut } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'contact_social' | 'director' | 'teachers' | 'slides' | 'bookings' | 'admin_emails' | 'quickshare'
  >('contact_social');

  // Copied link toast
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Status messages
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Forms local states
  const [contactForm, setContactForm] = useState<ContactSettings>(contactSettings);
  const [socialForm, setSocialForm] = useState<SocialSettings>(socialSettings);
  const [directorForm, setDirectorForm] = useState<DirectorProfile>(director);

  // Teacher modal / form
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfile | null>(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  // New Slide modal
  const [showAddSlide, setShowAddSlide] = useState(false);
  const [newSlide, setNewSlide] = useState<Partial<Slide>>({
    title: '',
    subtitle: '',
    badge: 'নতুন শিক্ষাবর্ষ',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'ভর্তি আবেদন',
    ctaLink: '#/admission',
    active: true,
  });

  // Admin emails management
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Bookings filter
  const [bookingFilter, setBookingFilter] = useState<'all' | 'Pending' | 'Approved' | 'Contacted'>('all');

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Convert uploaded image file to Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onReady: (dataUrl: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ছবির আকার সর্বোচ্চ ২ মেগাবাইট হতে পারবে।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onReady(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Contact & Social
  const handleSaveContactAndSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContactSettings(contactForm);
      await updateSocialSettings(socialForm);
      showNotification('প্রতিষ্ঠান ও সোশ্যাল মিডিয়া তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      alert('তথ্য সংরক্ষণে ত্রুটি দেখা দিয়েছে।');
    }
  };

  // Save Director Profile
  const handleSaveDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDirector(directorForm);
      showNotification('পরিচালকের প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      alert('পরিচালকের তথ্য সংরক্ষণে ত্রুটি দেখা দিয়েছে।');
    }
  };

  // Save Teacher
  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    try {
      await saveTeacher(editingTeacher);
      setIsTeacherModalOpen(false);
      setEditingTeacher(null);
      showNotification('শিক্ষকের তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      alert('শিক্ষকের তথ্য সংরক্ষণে ত্রুটি হয়েছে।');
    }
  };

  // Add Admin Email
  const handleAddAdminEmail = async () => {
    const emailToAdd = newAdminEmail.trim().toLowerCase();
    if (!emailToAdd || !emailToAdd.includes('@')) {
      alert('একটি সঠিক জিমেইল আইডি প্রবেশ করান।');
      return;
    }
    if (adminEmails.includes(emailToAdd)) {
      alert('এই ইমেইলটি ইতিমধ্যে অ্যাডমিন তালিকায় যুক্ত আছে।');
      return;
    }
    try {
      const updated = [...adminEmails, emailToAdd];
      await updateAdminEmails(updated);
      setNewAdminEmail('');
      showNotification(`এডমিন ইমেইল (${emailToAdd}) সফলভাবে যুক্ত হয়েছে!`);
    } catch (err) {
      alert('এডমিন ইমেইল যুক্ত করতে সমস্যা হয়েছে।');
    }
  };

  // Remove Admin Email
  const handleRemoveAdminEmail = async (emailToRemove: string) => {
    if (emailToRemove === 'kajalvai0@gmail.com') {
      alert('ডিফল্ট এডমিন ইমেইল (kajalvai0@gmail.com) মুছে ফেলা যাবে না।');
      return;
    }
    if (confirm(`আপনি কি ${emailToRemove} কে এডমিন তালিকা থেকে মুছে ফেলতে চান?`)) {
      try {
        const updated = adminEmails.filter((e) => e !== emailToRemove);
        await updateAdminEmails(updated);
        showNotification(`এডমিন ইমেইল (${emailToRemove}) সরানো হয়েছে।`);
      } catch (err) {
        alert('ইমেইল সরাতে সমস্যা হয়েছে।');
      }
    }
  };

  // Add Slide
  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.title || !newSlide.imageUrl) {
      alert('স্লাইড শিরোনাম ও ছবির ইউআরএল আবশ্যক!');
      return;
    }
    const slideItem: Slide = {
      id: `slide-${Date.now()}`,
      title: newSlide.title || '',
      subtitle: newSlide.subtitle || '',
      badge: newSlide.badge || '',
      imageUrl: newSlide.imageUrl || '',
      ctaText: newSlide.ctaText || 'বিস্তারিত দেখুন',
      ctaLink: newSlide.ctaLink || '#/courses',
      displayOrder: slides.length + 1,
      active: true,
    };
    try {
      await saveSlide(slideItem);
      setShowAddSlide(false);
      showNotification('নতুন স্লাইড সফলভাবে যুক্ত হয়েছে!');
    } catch (err) {
      alert('স্লাইড যোগ করতে সমস্যা হয়েছে।');
    }
  };

  // Quick Share Copy
  const handleCopyLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}/${path}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(path);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  // Authentication Gate Check
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-gray-100 ether-card">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-[#ffd700]/20 text-[#2c5f2d] flex items-center justify-center font-black text-3xl shadow-md">
            <Lock className="w-10 h-10 text-[#2c5f2d]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
            অ্যাডমিন প্যানেল লগইন
          </h2>
          <p className="text-gray-600 text-sm font-medium mb-6 leading-relaxed">
            এই প্যানেলে প্রবেশ করতে অনুগ্রহ করে আপনার অনুমোদিত জিমেইল আইডি (যেমন:{' '}
            <span className="font-mono font-bold text-[#2c5f2d]">kajalvai0@gmail.com</span>) ব্যবহার করে লগইন করুন।
          </p>

          <button
            onClick={signInWithGoogle}
            className="w-full py-4 rounded-2xl bg-[#2c5f2d] hover:bg-[#224b23] text-white font-bold text-base shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5 bg-white rounded-full p-0.5"
            />
            <span>এডমিন জিমেইল দিয়ে সাইন ইন করুন</span>
          </button>
        </div>
      </div>
    );
  }

  // Not an admin email
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-red-100 ether-card">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            অনুমতি নেই (Access Restricted)
          </h2>
          <p className="text-gray-600 text-sm font-medium mb-4">
            আপনি বর্তমানে <span className="font-bold text-gray-900">{user.email}</span> হিসেবে লগইন আছেন। এই আইডিটি অ্যাডমিন তালিকায় তালিকাভুক্ত নয়।
          </p>
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-4 rounded-2xl mb-6 text-left">
            💡 অনুমোদিত ডিফল্ট এডমিন আইডি:{' '}
            <span className="font-mono font-bold">kajalvai0@gmail.com</span>। আপনি অন্য একাউন্টে সুইচ করতে পারেন।
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={signOut}
              className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold"
            >
              লগআউট করুন
            </button>
            <button
              onClick={signInWithGoogle}
              className="px-6 py-2.5 rounded-xl bg-[#2c5f2d] text-white text-sm font-bold shadow"
            >
              অন্য আইডি দিয়ে লগইন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#2c5f2d] via-[#245025] to-[#183919] rounded-[2.5rem] p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/25 text-[#ffd700] text-xs font-bold mb-3 border border-[#ffd700]/50">
              <ShieldCheck className="w-4 h-4" />
              <span>Firebase Verified Admin: {user.email}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
              ইথাগোরাস কেন্দ্রীয় অ্যাডমিন কন্ট্রোল
            </h2>
            <p className="text-gray-200 text-sm sm:text-base font-medium max-w-2xl">
              প্রতিষ্ঠানের পরিচালক ও শিক্ষক প্রোফাইল, ফেসবুক/ইউটিউব লিংক, মোবাইল ও হোয়াটসঅ্যাপ নম্বর, স্লাইডার এবং ভর্তি আবেদন পরিচালনা করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={async () => {
                try {
                  await seedInitialDataToFirestore();
                  showNotification('প্রাথমিক ডাটাবেজ রেকর্ডসমূহ ফায়ারবেসে সফলভাবে সংরক্ষিত হয়েছে!');
                } catch (e) {
                  alert('ডাটা সিড করতে সমস্যা হয়েছে।');
                }
              }}
              className="px-3.5 py-2.5 bg-[#ffd700] hover:bg-[#e6c200] text-gray-950 text-xs font-black rounded-2xl shadow transition-all flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>ডিফল্ট ডাটা ক্লাউডে সিঙ্ক করুন</span>
            </button>
            <button
              onClick={signOut}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all flex items-center gap-2"
            >
              <span>লগআউট ({user.displayName?.split(' ')[0] || 'Admin'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl font-bold text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('contact_social')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'contact_social' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Phone className="w-4 h-4" />
          প্রতিষ্ঠান ও সোশ্যাল তথ্য
        </button>

        <button
          onClick={() => setActiveTab('director')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'director' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          পরিচালকের প্রোফাইল
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'teachers' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          শিক্ষকমণ্ডলী ({teachers.length})
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'slides' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Image className="w-4 h-4" />
          হিরো স্লাইডার ({slides.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'bookings' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          ভর্তি আবেদন ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('admin_emails')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'admin_emails' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          এডমিন জিমেইল তালিকা
        </button>

        <button
          onClick={() => setActiveTab('quickshare')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'quickshare' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Share2 className="w-4 h-4" />
          Quick Share
        </button>
      </div>

      {/* Tab 1: Institution Contact & Social Links */}
      {activeTab === 'contact_social' && (
        <form onSubmit={handleSaveContactAndSocial} className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md space-y-8">
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-1 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#2c5f2d]" />
              প্রতিষ্ঠানের যোগাযোগের তথ্য ও ঠিকানা
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              এখানে পরিবর্তন করা তথ্যসমূহ সরাসরি ওয়েবসাইটের ফুটার ও কন্টাক্ট সেকশনে প্রদর্শিত হবে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                মোবাইল নম্বরসমূহ (Mobile Phone) *
              </label>
              <input
                type="text"
                required
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2c5f2d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                হোয়াটসঅ্যাপ নম্বর (WhatsApp Number) *
              </label>
              <input
                type="text"
                required
                value={contactForm.whatsapp}
                onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                placeholder="+8801700000000"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2c5f2d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                অফিসিয়াল ইমেইল (Official Email)
              </label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2c5f2d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                প্রতিষ্ঠানের সম্পূর্ণ ঠিকানা (Physical Address) *
              </label>
              <input
                type="text"
                required
                value={contactForm.address}
                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2c5f2d] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2c5f2d]" />
              সোশ্যাল মিডিয়া পেজ লিংকসমূহ (Facebook, Instagram, YouTube)
            </h4>
            <p className="text-xs text-gray-500 font-medium mb-4">
              ফুটারের সোশ্যাল আইকনগুলোর ব্যাকগ্রাউন্ড লিংক এখান থেকে হালনাগাদ করতে পারেন।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ফেসবুক পেজ লিংক (Facebook URL)
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={socialForm.facebookUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, facebookUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ইনস্টাগ্রাম প্রোফাইল লিংক (Instagram URL)
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={socialForm.instagramUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, instagramUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ইউটিউব চ্যানেল লিংক (YouTube URL)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@..."
                  value={socialForm.youtubeUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, youtubeUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-[#2c5f2d] hover:bg-[#224b23] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#ffd700]" />
              <span>যোগাযোগ ও সোশ্যাল তথ্য সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Director Profile Editor */}
      {activeTab === 'director' && (
        <form onSubmit={handleSaveDirector} className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md space-y-6">
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-1 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#2c5f2d]" />
              প্রতিষ্ঠানের পরিচালক প্রোফাইল সম্পাদনা
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              পরিচালকের ছবি আপলোড বা ইউআরএল দিয়ে বার্তা ও তথ্য পরিবর্তন করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Photo preview and upload */}
            <div className="md:col-span-4 space-y-3 text-center">
              <div className="w-48 h-56 mx-auto rounded-3xl overflow-hidden border-4 border-gray-200 shadow-md relative bg-gray-100">
                {directorForm.photoUrl ? (
                  <img src={directorForm.photoUrl} alt="Director" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    ছবি নেই
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  সরাসরি ছবি আপলোড করুন
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold border border-gray-300 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>ডিভাইস থেকে ছবি বেছে নিন</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (dataUrl) => setDirectorForm({ ...directorForm, photoUrl: dataUrl }))}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  অথবা ছবির লিংক (Photo URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={directorForm.photoUrl}
                  onChange={(e) => setDirectorForm({ ...directorForm, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>
            </div>

            {/* Profile fields */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পরিচালকের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={directorForm.name}
                    onChange={(e) => setDirectorForm({ ...directorForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পদবী (Designation) *
                  </label>
                  <input
                    type="text"
                    required
                    value={directorForm.designation}
                    onChange={(e) => setDirectorForm({ ...directorForm, designation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  শিক্ষাগত যোগ্যতা (Qualifications)
                </label>
                <input
                  type="text"
                  value={directorForm.qualifications}
                  onChange={(e) => setDirectorForm({ ...directorForm, qualifications: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  পরিচালকের দিকনির্দেশনামূলক বার্তা (Message) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={directorForm.message}
                  onChange={(e) => setDirectorForm({ ...directorForm, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ফোন নম্বর
                  </label>
                  <input
                    type="text"
                    value={directorForm.phone || ''}
                    onChange={(e) => setDirectorForm({ ...directorForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ইমেইল আইডি
                  </label>
                  <input
                    type="email"
                    value={directorForm.email || ''}
                    onChange={(e) => setDirectorForm({ ...directorForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-[#2c5f2d] hover:bg-[#224b23] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#ffd700]" />
              <span>পরিচালক প্রোফাইল সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Teachers Management */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                প্রতিষ্ঠানের শিক্ষকবৃন্দ (Faculty Profiles)
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                নতুন শিক্ষক যোগ করুন, ছবি ও বিবরণ সম্পাদনা বা মুছে ফেলুন
              </p>
            </div>
            <button
              onClick={() => {
                setEditingTeacher({
                  id: `t-${Date.now()}`,
                  name: '',
                  subject: '',
                  qualifications: '',
                  experience: '',
                  bio: '',
                  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
                  phone: '',
                  displayOrder: teachers.length + 1,
                });
                setIsTeacherModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#2c5f2d] text-white font-bold text-xs sm:text-sm shadow hover:bg-[#224b23] flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#ffd700]" />
              নতুন শিক্ষক যোগ করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-md p-5 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-inner">
                    <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold bg-[#ffd700] text-gray-950 px-2 py-0.5 rounded-full inline-block mb-1">
                      {teacher.subject}
                    </span>
                    <h4 className="font-bold text-gray-900 text-base leading-snug">{teacher.name}</h4>
                    <p className="text-xs text-[#2c5f2d] font-semibold">{teacher.qualifications}</p>
                    <p className="text-xs text-gray-500 mt-1">{teacher.experience}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                  <button
                    onClick={() => {
                      setEditingTeacher(teacher);
                      setIsTeacherModalOpen(true);
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`আপনি কি "${teacher.name}" শিক্ষকের তথ্য মুছে ফেলতে চান?`)) {
                        await deleteTeacher(teacher.id);
                        showNotification('শিক্ষক প্রোফাইল মুছে ফেলা হয়েছে।');
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Edit Modal */}
          {isTeacherModalOpen && editingTeacher && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    শিক্ষকের তথ্য ও ছবি সম্পাদনা
                  </h3>
                  <button
                    onClick={() => {
                      setIsTeacherModalOpen(false);
                      setEditingTeacher(null);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveTeacher} className="space-y-4">
                  {/* Photo upload and preview */}
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-200 shrink-0 border">
                      <img src={editingTeacher.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2c5f2d] text-white text-xs font-bold hover:bg-[#234b24]">
                        <Upload className="w-3 h-3" />
                        <span>ছবি আপলোড করুন</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (dataUrl) =>
                              setEditingTeacher({ ...editingTeacher, photoUrl: dataUrl })
                            )
                          }
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="অথবা ফটো URL দিন"
                        value={editingTeacher.photoUrl}
                        onChange={(e) => setEditingTeacher({ ...editingTeacher, photoUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">শিক্ষকের নাম *</label>
                      <input
                        type="text"
                        required
                        value={editingTeacher.name}
                        onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">পাঠদানের বিষয় *</label>
                      <input
                        type="text"
                        required
                        value={editingTeacher.subject}
                        onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                      <input
                        type="text"
                        value={editingTeacher.qualifications}
                        onChange={(e) => setEditingTeacher({ ...editingTeacher, qualifications: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">অভিজ্ঞতা</label>
                      <input
                        type="text"
                        value={editingTeacher.experience}
                        onChange={(e) => setEditingTeacher({ ...editingTeacher, experience: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">সংক্ষিপ্ত পরিচিতি ও দিকনির্দেশনা (Bio)</label>
                    <textarea
                      rows={2}
                      value={editingTeacher.bio || ''}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTeacherModalOpen(false);
                        setEditingTeacher(null);
                      }}
                      className="px-4 py-2 rounded-xl text-gray-600 text-xs font-bold hover:bg-gray-100"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-[#2c5f2d] text-white text-xs font-bold shadow hover:bg-[#224b23]"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Slide Manager */}
      {activeTab === 'slides' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900">
              হোমপেজ হিরো স্লাইডসমূহ
            </h3>
            <button
              onClick={() => setShowAddSlide(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#2c5f2d] text-white font-bold text-xs sm:text-sm shadow hover:bg-[#224b23] flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-[#ffd700]" />
              নতুন স্লাইড যোগ করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 bg-gray-900">
                  <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover brightness-90" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      s.active ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-gray-200'
                    }`}>
                      {s.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>
                  {s.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#ffd700] text-gray-950 text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                        {s.badge}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">{s.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{s.subtitle}</p>
                    <div className="text-xs text-gray-500 font-medium">
                      CTA: <span className="font-bold text-[#2c5f2d]">{s.ctaText}</span> ({s.ctaLink})
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                    <button
                      onClick={async () => {
                        await saveSlide({ ...s, active: !s.active });
                        showNotification('স্লাইডের স্থিতি পরিবর্তিত হয়েছে।');
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700"
                    >
                      {s.active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('আপনি কি এই স্লাইডটি মুছে ফেলতে চান?')) {
                          await deleteSlide(s.id);
                          showNotification('স্লাইড মুছে ফেলা হয়েছে।');
                        }
                      }}
                      className="text-red-600 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Slide Modal */}
          {showAddSlide && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">নতুন হোম স্লাইড তৈরি করুন</h3>
                  <button onClick={() => setShowAddSlide(false)} className="p-1 rounded-lg text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddSlide} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">স্লাইড শিরোনাম *</label>
                    <input
                      type="text"
                      required
                      value={newSlide.title}
                      onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">উপশিরোনাম</label>
                    <input
                      type="text"
                      value={newSlide.subtitle}
                      onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">ছবির লিংক *</label>
                    <input
                      type="url"
                      required
                      value={newSlide.imageUrl}
                      onChange={(e) => setNewSlide({ ...newSlide, imageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowAddSlide(false)}
                      className="px-4 py-2 rounded-xl text-gray-600 text-sm font-bold"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-[#2c5f2d] text-white text-sm font-bold shadow"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-gray-900">ভর্তি আবেদনসমূহ (Bookings)</h3>
              <p className="text-xs text-gray-500 font-medium">অনলাইনে শিক্ষার্থীদের দাখিলকৃত আবেদন তালিকা</p>
            </div>

            <div className="flex gap-2">
              {(['all', 'Pending', 'Approved', 'Contacted'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    bookingFilter === st
                      ? 'bg-[#2c5f2d] text-white border-[#2c5f2d]'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {st === 'all' ? 'সব' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">আইডি ও তারিখ</th>
                    <th className="px-6 py-4">শিক্ষার্থীর তথ্য</th>
                    <th className="px-6 py-4">প্রতিষ্ঠান ও শ্রেণী</th>
                    <th className="px-6 py-4">কোর্স ও শিফট</th>
                    <th className="px-6 py-4">স্থিতি</th>
                    <th className="px-6 py-4 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium">
                        কোনো আবেদন পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/70">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-xs text-[#2c5f2d] bg-emerald-50 px-2 py-0.5 rounded">
                            {b.id}
                          </span>
                          <div className="text-[11px] text-gray-400 mt-1">{b.submittedAt}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{b.studentName}</div>
                          <div className="text-xs text-gray-500">অভিভাবক: {b.guardianName}</div>
                          <div className="text-xs text-emerald-800 font-semibold">{b.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{b.schoolName}</div>
                          <div className="text-xs text-gray-500">{b.grade}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-[#2c5f2d]">{b.courseSelected}</div>
                          <div className="text-xs text-gray-500">{b.shiftPreference} Shift</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            b.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                          {b.status !== 'Approved' && (
                            <button
                              onClick={async () => {
                                await updateBookingStatus(b.id, 'Approved');
                                showNotification('আবেদনটি অনুমোদিত হয়েছে।');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
                            >
                              অনুমোদন
                            </button>
                          )}
                          {b.status !== 'Contacted' && (
                            <button
                              onClick={async () => {
                                await updateBookingStatus(b.id, 'Contacted');
                                showNotification('যোগাযোগ স্থিতি আপডেট করা হয়েছে।');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs"
                            >
                              যোগাযোগ
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Admin Emails Manager */}
      {activeTab === 'admin_emails' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md space-y-6">
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2c5f2d]" />
              অনুমোদিত এডমিন জিমেইল আইডি ব্যবস্থাপনা
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              প্রাথমিক এডমিন হিসেবে <span className="font-mono font-bold text-[#2c5f2d]">kajalvai0@gmail.com</span> সক্রিয় রয়েছে। প্রয়োজন অনুযায়ী আরও এডমিন যুক্ত বা বাদ দেওয়া যাবে।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="নতুন এডমিনের জিমেইল আইডি (যেমন: user@gmail.com)"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
            />
            <button
              onClick={handleAddAdminEmail}
              className="px-6 py-2.5 rounded-xl bg-[#2c5f2d] hover:bg-[#224b23] text-white text-sm font-bold shadow flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-[#ffd700]" />
              <span>এডমিন যোগ করুন</span>
            </button>
          </div>

          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              বর্তমান এডমিনদের তালিকা ({adminEmails.length}):
            </h4>
            <div className="space-y-2">
              {adminEmails.map((email) => (
                <div
                  key={email}
                  className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#2c5f2d]/10 text-[#2c5f2d] flex items-center justify-center font-bold text-xs">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-gray-900">{email}</span>
                      {email === 'kajalvai0@gmail.com' && (
                        <span className="ml-2 bg-[#ffd700] text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                          ডিফল্ট সুপার এডমিন
                        </span>
                      )}
                      {user.email?.toLowerCase() === email.toLowerCase() && (
                        <span className="ml-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          আপনি
                        </span>
                      )}
                    </div>
                  </div>

                  {email !== 'kajalvai0@gmail.com' && (
                    <button
                      onClick={() => handleRemoveAdminEmail(email)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1"
                      title="এডমিন সরান"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>সরান</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Quick Share */}
      {activeTab === 'quickshare' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md">
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              ক্লায়েন্ট ও অভিভাবক কুইক শেয়ার ইউটিলিটি
            </h3>
            <p className="text-gray-600 text-sm font-medium">
              অভিভাবক, শিক্ষার্থী বা ক্লায়েন্টদের নির্দিষ্ট পেজ বা ফিচারে সরাসরি পাঠানোর জন্য এক ক্লিকে লিংক কপি করুন।
            </p>
          </div>

          <div className="space-y-4 max-w-3xl">
            {[
              { title: 'হোম পেজ ও স্লাইডার', path: '#/', desc: 'মূল ল্যান্ডিং পেজ ও হিরো স্লাইড প্রদর্শন' },
              { title: 'শিক্ষক ও পরিচালক প্রোফাইল', path: '#/faculty', desc: 'প্রতিষ্ঠানের শিক্ষক ও পরিচালকের পরিচিতি' },
              { title: 'অনলাইন ভর্তি ফর্ম', path: '#/admission', desc: 'সরাসরি ভর্তি আবেদন পেজ' },
              { title: 'স্মার্ট কুইজ পরীক্ষা', path: '#/quiz', desc: 'মেধা যাচাই ও শীর্ষ ৫ লিডারবোর্ড' },
              { title: 'কোর্স ক্যাটালগ', path: '#/courses', desc: 'সকল ব্যাচ ও মেন্টর তালিকা' },
            ].map((linkItem) => (
              <div
                key={linkItem.path}
                className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{linkItem.title}</h4>
                  <p className="text-xs text-gray-500 font-medium">{linkItem.desc}</p>
                  <code className="text-xs text-[#2c5f2d] font-semibold mt-1 inline-block">
                    {linkItem.path}
                  </code>
                </div>

                <button
                  onClick={() => handleCopyLink(linkItem.path)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    copiedLink === linkItem.path
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {copiedLink === linkItem.path ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      কপি হয়েছে!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      লিংক কপি
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
