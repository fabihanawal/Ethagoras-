import React from 'react';
import { BookOpen, Check, ArrowRight, Star, Sparkles, Award } from 'lucide-react';
import { Course } from '../lib/types';
import { INITIAL_COURSES } from '../lib/dataStore';

interface CoursesSectionProps {
  navigate: (route: string) => void;
  courses?: Course[];
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ navigate, courses = INITIAL_COURSES }) => {
  const displayCourses = courses.length > 0 ? courses : INITIAL_COURSES;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2c5f2d]/10 text-[#2c5f2d] font-bold text-xs uppercase tracking-wider mb-3">
          <BookOpen className="w-4 h-4 text-[#2c5f2d]" />
          <span>আমাদের জনপ্রিয় কোর্সসমূহ</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
          আপনার শিক্ষাজীবনের সঠিক দিকনির্দেশনা
        </h2>
        <p className="text-gray-600 font-medium text-base sm:text-lg">
          অভিজ্ঞ শিক্ষক ও সুনির্দিষ্ট পরিকল্পনার মাধ্যমে প্রতিটি বিষয়ের গভীরে পৌঁছানোর জন্য আমাদের বিশেষ প্রোগ্রাম। কোর্স সমাপ্তির পর দেওয়া হয় অফিসিয়াল সনদপত্র।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCourses.map((c) => (
          <div
            key={c.id}
            className={`rounded-[2.5rem] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative bg-white border ether-card ${
              c.popular
                ? 'border-[#2c5f2d] ring-2 ring-[#2c5f2d]/20 shadow-xl'
                : 'border-gray-200 shadow-md'
            }`}
          >
            {c.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ffd700] to-[#e6c200] text-gray-950 text-xs font-black px-4 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                সর্বাধিক পছন্দ
              </div>
            )}

            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-3">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-xl">
                  {c.level}
                </span>
                <span>{c.duration}</span>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-3 leading-snug">
                {c.title}
              </h3>

              <div className="mb-4">
                <span className="text-2xl font-black text-[#2c5f2d]">{c.price}</span>
              </div>

              <div className="pt-4 border-t border-gray-100 mb-6 space-y-2.5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  অন্তর্ভুক্ত বিষয়সমূহ:
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.subjects?.map((sub, i) => (
                    <span key={i} className="text-xs font-semibold bg-emerald-50 text-[#2c5f2d] px-2.5 py-1 rounded-lg">
                      {sub}
                    </span>
                  ))}
                </div>

                <div className="space-y-2">
                  {c.features?.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                      <Check className="w-4 h-4 text-[#2c5f2d] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('#/admission')}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                c.popular
                  ? 'bg-[#2c5f2d] text-white hover:bg-[#234b24] shadow-md'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <span>ভর্তি আবেদন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
