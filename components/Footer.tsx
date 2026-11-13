import React from 'react';
import { MapPin, Phone, Mail, Clock, Sparkles, MessageCircle } from 'lucide-react';
import { ContactSettings, SocialSettings } from '../lib/types';

interface FooterProps {
  navigate: (route: string) => void;
  contactSettings?: ContactSettings;
  socialSettings?: SocialSettings;
}

export const Footer: React.FC<FooterProps> = ({
  navigate,
  contactSettings,
  socialSettings,
}) => {
  const phone = contactSettings?.phone || '০১৭০০-০০০০০০, ০১৮০০-০০০০০০';
  const whatsapp = contactSettings?.whatsapp || '+8801700000000';
  const email = contactSettings?.email || 'info@ethagoras-naogaon.edu.bd';
  const address = contactSettings?.address || 'বদলগাছী সদর, বদলগাছী, নওগাঁ।';

  const cleanWhatsappNumber = whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-gray-950 text-white mt-20 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ffd700] text-gray-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-[#ffd700]/20">
                ই
              </div>
              <div>
                <span className="text-2xl font-black text-white">ইথাগোরাস</span>
                <span className="block text-xs text-[#ffd700] font-semibold">
                  Ether Education Platform
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              নওগাঁর প্রথম সারির ডিজিটাল কোচিং প্ল্যাটফর্ম। আধুনিক ক্লাসরুম, অভিজ্ঞ শিক্ষক এবং সুষম কারিকুলাম নিয়ে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>

            {/* Dynamic Social Icons (Facebook, Instagram, YouTube) */}
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                সামাজিক যোগাযোগ মাধ্যম:
              </p>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                {socialSettings?.facebookUrl && (
                  <a
                    href={socialSettings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all flex items-center justify-center border border-[#1877F2]/40 shadow-sm"
                    title="Facebook Page"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}

                {/* Instagram */}
                {socialSettings?.instagramUrl && (
                  <a
                    href={socialSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#E4405F]/20 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all flex items-center justify-center border border-[#E4405F]/40 shadow-sm"
                    title="Instagram Profile"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}

                {/* YouTube */}
                {socialSettings?.youtubeUrl && (
                  <a
                    href={socialSettings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#FF0000]/20 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all flex items-center justify-center border border-[#FF0000]/40 shadow-sm"
                    title="YouTube Channel"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}

                {/* WhatsApp Chat Direct Button */}
                {cleanWhatsappNumber && (
                  <a
                    href={`https://wa.me/${cleanWhatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center border border-[#25D366]/40 shadow-sm"
                    title="WhatsApp Chat"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 pb-1 border-b border-gray-800">
              দ্রুত লিংক
            </h4>
            <ul className="space-y-2 text-sm text-gray-400 font-medium">
              <li>
                <button onClick={() => navigate('#/')} className="hover:text-[#ffd700] transition-colors">
                  হোম পেজ (Home)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/online-batch')} className="hover:text-[#ffd700] transition-colors">
                  অনলাইন লাইভ ব্যাচ (Online Batch)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/notes')} className="hover:text-[#ffd700] transition-colors">
                  ফ্রী ও পেইড নোটস লাইব্রেরি (Notes)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/courses')} className="hover:text-[#ffd700] transition-colors">
                  কোর্স কারিকুলাম (Courses)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/faculty')} className="hover:text-[#ffd700] transition-colors">
                  শিক্ষক ও পরিচালক প্রোফাইল (Faculty)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/quiz')} className="hover:text-[#ffd700] transition-colors">
                  স্মার্ট কুইজ যাচাই (Quiz Engine)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/admission')} className="hover:text-[#ffd700] transition-colors">
                  অনলাইন ভর্তি আবেদন (Admission)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('#/admin')} className="hover:text-[#ffd700] transition-colors">
                  অ্যাডমিন প্যানেল (Admin Panel)
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Location & Dynamic Contact */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 pb-1 border-b border-gray-800">
              ক্যাম্পাস ও যোগাযোগ
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ffd700] shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>হোয়াটসঅ্যাপ: {whatsapp}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#ffd700] shrink-0" />
                <span>{email}</span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 pb-1 border-b border-gray-800">
              অফিস সময়সূচী
            </h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-200">শনিবার — বৃহস্পতিবার</p>
                  <p className="text-xs">সকাল ৮:০০ টা হতে রাত ৮:০০ টা</p>
                </div>
              </div>
              <p className="text-xs text-emerald-400 font-semibold pt-2">
                • শুক্রবার বিশেষ ব্যাচ ও মডেল টেস্ট
              </p>
              <div className="pt-3">
                <button
                  onClick={() => navigate('#/admission')}
                  className="w-full py-2.5 bg-gradient-to-r from-[#ffd700] to-[#e6c200] text-gray-950 font-bold rounded-xl text-xs shadow-md"
                >
                  অনলাইন সিট বুকিং
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} ইথাগোরাস প্রাইভেট (Ether Education Platform). সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4 text-gray-400 font-medium">
            <span>বদলগাছী সদর, বদলগাছী, নওগাঁ।</span>
            <span>•</span>
            <span className="text-[#ffd700]">developed by RSTSBD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
