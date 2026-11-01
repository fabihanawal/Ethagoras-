import React, { useState } from 'react';
import { BookOpen, Award, UserCheck, ShieldCheck, Menu, X, PhoneCall, Sparkles, LogIn, LogOut, Users, User } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { ContactSettings } from '../lib/types';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  contactSettings?: ContactSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate, contactSettings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();

  const navItems = [
    { label: 'হোম (Home)', route: '#/' },
    { label: 'কোর্সসমূহ (Courses)', route: '#/courses' },
    { label: 'শিক্ষক ও পরিচালক', route: '#/faculty', icon: Users },
    { label: 'কুইজ ইঞ্জিন (Quiz)', route: '#/quiz' },
    { label: 'অনলাইন ভর্তি', route: '#/admission' },
    { label: 'অ্যাডমিন', route: '#/admin', icon: ShieldCheck, adminOnly: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => navigate('#/')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2c5f2d] to-[#1f4420] text-[#ffd700] flex items-center justify-center font-bold text-2xl shadow-lg shadow-[#2c5f2d]/20 group-hover:scale-105 transition-transform duration-300">
              ই
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#2c5f2d]">
                  ইথাগোরাস
                </span>
                <span className="text-xs bg-[#ffd700]/20 text-[#2c5f2d] border border-[#ffd700]/50 font-bold px-2 py-0.5 rounded-full">
                  প্রাইভেট
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                Ether Education • নওগাঁ শাখা
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#2c5f2d] text-white shadow-md shadow-[#2c5f2d]/20'
                      : 'text-gray-700 hover:text-[#2c5f2d] hover:bg-gray-100/70'
                  }`}
                >
                  {item.icon && <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ffd700]' : 'text-gray-500'}`} />}
                  <span>{item.label}</span>
                  {item.adminOnly && (
                    <span className="text-[9px] bg-amber-400 text-gray-950 px-1.5 py-0.2 rounded font-black">
                      ADMIN
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Auth & Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Phone */}
            <a
              href={`tel:${contactSettings?.phone?.split(',')[0]?.trim() || '01700000000'}`}
              className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 hover:border-[#2c5f2d] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#2c5f2d]" />
              <span className="max-w-[120px] truncate">{contactSettings?.phone?.split(',')[0] || '০১৭০০-০০০০০০'}</span>
            </a>

            {/* Google Authentication Control */}
            {user ? (
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 pl-3 rounded-2xl border border-gray-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-xl object-cover ring-2 ring-[#2c5f2d]/30"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-[#2c5f2d] text-[#ffd700] flex items-center justify-center font-bold text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col text-left mr-1">
                  <span className="text-xs font-bold text-gray-900 leading-tight max-w-[100px] truncate">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <span className={`text-[10px] font-bold ${isAdmin ? 'text-amber-600' : 'text-emerald-700'}`}>
                    {isAdmin ? '🛡️ অ্যাডমিন' : '👤 শিক্ষার্থী'}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  title="লগআউট"
                  className="p-1.5 rounded-xl hover:bg-gray-200 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-white border border-gray-300 hover:border-[#2c5f2d] text-gray-800 font-bold px-3.5 py-2 rounded-2xl shadow-sm text-xs flex items-center gap-2 transition-all hover:bg-gray-50"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                <span>লগইন (Gmail)</span>
              </button>
            )}

            {/* Admission CTA */}
            <button
              onClick={() => navigate('#/admission')}
              className="bg-gradient-to-r from-[#ffd700] to-[#e6c200] text-gray-950 font-black px-4 py-2.5 rounded-2xl shadow-md shadow-[#ffd700]/25 hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-950" />
              <span>ভর্তি আবেদন</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {!user ? (
              <button
                onClick={signInWithGoogle}
                className="bg-white border border-gray-300 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#2c5f2d]" />
                <span>লগইন</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('#/admin')}
                className="text-xs font-bold px-2 py-1.5 rounded-xl bg-gray-100 flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5 text-[#2c5f2d]" />
                <span className="max-w-[70px] truncate">{user.displayName?.split(' ')[0] || 'User'}</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-[#2c5f2d] hover:bg-gray-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {user && (
            <div className="p-3 bg-emerald-50 rounded-2xl flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full" />
                )}
                <div>
                  <p className="text-xs font-bold text-gray-900">{user.displayName || user.email}</p>
                  <p className="text-[10px] text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="text-xs text-red-600 font-bold px-3 py-1 bg-white rounded-lg border border-red-200"
              >
                লগআউট
              </button>
            </div>
          )}

          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => {
                navigate(item.route);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                currentRoute === item.route
                  ? 'bg-[#2c5f2d] text-white'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon && <item.icon className="w-4 h-4 text-[#ffd700]" />}
                <span>{item.label}</span>
              </div>
              {item.adminOnly && (
                <span className="text-[10px] bg-[#ffd700] text-gray-950 px-2 py-0.5 rounded font-bold">
                  ADMIN
                </span>
              )}
            </button>
          ))}

          <div className="pt-2">
            <button
              onClick={() => {
                navigate('#/admission');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#ffd700] text-gray-900 font-black py-3 rounded-xl text-center shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              ভর্তি ফরম পূরণ করুন
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
