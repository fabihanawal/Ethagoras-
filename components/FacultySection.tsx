import React from 'react';
import { Award, GraduationCap, Phone, Mail, BookOpen, Quote, Sparkles, UserCheck } from 'lucide-react';
import { DirectorProfile, TeacherProfile } from '../lib/types';

interface FacultySectionProps {
  director: DirectorProfile;
  teachers: TeacherProfile[];
  navigate: (route: string) => void;
}

export const FacultySection: React.FC<FacultySectionProps> = ({
  director,
  teachers,
  navigate,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2c5f2d]/10 text-[#2c5f2d] font-bold text-xs uppercase tracking-wider mb-3">
          <GraduationCap className="w-4 h-4 text-[#2c5f2d]" />
          <span>প্রাজ্ঞ ও অভিজ্ঞ মেন্টরবৃন্দ</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
          আমাদের পরিচালক ও শিক্ষকমণ্ডলী
        </h2>
        <p className="text-gray-600 font-medium text-base sm:text-lg">
          নওগাঁর শীর্ষস্থানীয় শিক্ষক ও অভিজ্ঞ প্রকৌশলীদের নিবিড় তত্ত্বাবধানে আপনার সন্তানের একাডেমিক শ্রেষ্ঠত্ব নিশ্চিত করি।
        </p>
      </div>

      {/* 1. Director's Special Showcase Profile */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-white via-white to-emerald-50/50 rounded-[3rem] p-6 sm:p-12 border border-emerald-100 shadow-2xl relative overflow-hidden ether-card">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd700]/10 rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2c5f2d]/5 rounded-full blur-3xl -z-0" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Director Photo */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-64 h-72 sm:w-80 sm:h-96 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-gray-100 relative">
                  <img
                    src={director.photoUrl}
                    alt={director.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="bg-[#ffd700] text-gray-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      পরিচালক
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Director Message & Bio */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2c5f2d] text-[#ffd700] text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>প্রতিষ্ঠাতা ও পরিচালকের বার্তা</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {director.name}
              </h3>

              <div className="text-sm font-bold text-[#2c5f2d]">
                {director.designation}
              </div>

              <div className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200">
                🎓 {director.qualifications}
              </div>

              <div className="pt-2 relative">
                <Quote className="w-10 h-10 text-emerald-200 absolute -top-4 -left-2 -z-0 opacity-40" />
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium relative z-10 italic">
                  "{director.message}"
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 text-xs font-semibold text-gray-600">
                {director.phone && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                    <Phone className="w-3.5 h-3.5 text-[#2c5f2d]" />
                    <span>{director.phone}</span>
                  </div>
                )}
                {director.email && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                    <Mail className="w-3.5 h-3.5 text-[#2c5f2d]" />
                    <span>{director.email}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Teachers / Faculty Team */}
      <section>
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
              সম্মানিত শিক্ষকমণ্ডলী
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              অভিজ্ঞ মেন্টরদের সাথে সরাসরি ক্লাসরুম ও অনলাইন সমস্যা সমাধান
            </p>
          </div>
          <span className="text-xs font-bold bg-[#2c5f2d]/10 text-[#2c5f2d] px-3.5 py-1.5 rounded-2xl">
            মোট শিক্ষক: {teachers.length} জন
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group ether-card"
            >
              <div>
                {/* Photo */}
                <div className="h-64 overflow-hidden relative bg-gray-100">
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#ffd700] text-gray-950 font-black text-[11px] px-3 py-1 rounded-full shadow-md">
                    {teacher.subject}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <h4 className="text-lg font-black text-gray-900 group-hover:text-[#2c5f2d] transition-colors leading-snug">
                    {teacher.name}
                  </h4>
                  
                  <p className="text-xs font-bold text-[#2c5f2d] bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                    {teacher.qualifications}
                  </p>

                  <div className="text-xs text-gray-500 font-semibold flex items-center gap-1.5 pt-1">
                    <Award className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span>{teacher.experience}</span>
                  </div>

                  {teacher.bio && (
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed pt-1 font-medium">
                      {teacher.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => navigate('#/admission')}
                  className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-[#2c5f2d] hover:text-white text-gray-800 text-xs font-bold border border-gray-200 hover:border-[#2c5f2d] transition-all flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  ব্যাচে ভর্তি আবেদন
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
