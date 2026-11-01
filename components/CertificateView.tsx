import React from 'react';
import { Award, Printer, X, Download, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';
import { Certificate } from '../lib/types';

interface CertificateViewProps {
  certificate: Certificate;
  onClose: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const isMerit = certificate.type === 'merit_top10';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl relative my-auto">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-[#ffd700]" />
            <h3 className="text-lg font-black text-gray-900">
              অফিসিয়াল সনদপত্র প্রদর্শন ও প্রিন্ট
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#2c5f2d] hover:bg-[#224b23] text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4 text-[#ffd700]" />
              <span>প্রিন্ট / PDF ডাউনলোড</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div 
          id="certificate-print-area"
          className="relative bg-[#fffdf7] border-[10px] border-[#2c5f2d] rounded-2xl p-6 sm:p-12 text-center shadow-xl overflow-hidden"
          style={{ minHeight: '520px' }}
        >
          {/* Inner Golden Border */}
          <div className="absolute inset-2 border-2 border-[#ffd700] rounded-xl pointer-events-none" />
          <div className="absolute inset-3 border border-[#2c5f2d]/20 rounded-lg pointer-events-none" />

          {/* Background Watermark Crest */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-[280px] font-black text-[#2c5f2d]">ই</span>
          </div>

          {/* Certificate Header */}
          <div className="relative z-10 space-y-2 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2c5f2d] text-[#ffd700] flex items-center justify-center font-black text-2xl shadow-md">
                ই
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-black text-[#2c5f2d] tracking-tight leading-none">
                  ইথাগোরাস প্রাইভেট
                </h1>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Ether Education Platform • Naogaon Campus
                </p>
              </div>
            </div>

            <div className="pt-3">
              <span className={`inline-block px-6 py-1 rounded-full text-xs font-black tracking-widest uppercase border ${
                isMerit 
                  ? 'bg-amber-50 text-amber-900 border-amber-300' 
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}>
                {isMerit ? '★ মেধা ও শ্রেষ্ঠত্ব সনদপত্র ★' : '★ কোর্স সমাপন ও প্রশংসাপত্র ★'}
              </span>
            </div>
          </div>

          {/* Recipient Statement */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-4 my-6">
            <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wider">
              অত্যন্ত আনন্দের সাথে প্রত্যয়ন করা যাচ্ছে যে,
            </p>

            <h2 className="text-3xl sm:text-4xl font-black text-[#2c5f2d] tracking-tight border-b-2 border-[#ffd700]/70 pb-2 inline-block px-8">
              {certificate.studentName}
            </h2>

            {certificate.rollNo && (
              <p className="text-xs text-gray-600 font-bold">
                রোল / রেজিস্ট্রেশন নং: <span className="font-mono text-gray-900">{certificate.rollNo}</span>
              </p>
            )}

            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed px-4">
              {certificate.description}
            </p>

            {isMerit && certificate.rank && (
              <div className="inline-flex items-center gap-2 bg-[#ffd700]/20 border border-[#ffd700] px-4 py-1.5 rounded-full text-xs font-black text-emerald-950">
                <Sparkles className="w-4 h-4 fill-[#ffd700]" />
                <span>মেধাতালিকায় স্থান: সেরা ১০ (র‍্যাংক #{certificate.rank}) • প্রাপ্ত নম্বর: {certificate.score}%</span>
              </div>
            )}
          </div>

          {/* Certificate Footer / Signatures & Seal */}
          <div className="relative z-10 pt-8 mt-8 border-t border-gray-200 grid grid-cols-3 items-end text-xs">
            
            {/* Left: Verification Info */}
            <div className="text-left space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2c5f2d]" />
                <span>সনদপত্র নং:</span>
              </div>
              <p className="font-mono font-bold text-xs text-gray-900">
                {certificate.certificateNumber}
              </p>
              <p className="text-[10px] text-gray-400">
                ইস্যুর তারিখ: {certificate.issueDate}
              </p>
            </div>

            {/* Center: Golden Hologram Seal */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#ffd700] bg-gradient-to-br from-[#fff7cc] to-[#ffd700] text-[#1f4420] flex flex-col items-center justify-center shadow-lg transform rotate-[-5deg]">
                <Award className="w-6 h-6 text-[#2c5f2d]" />
                <span className="text-[8px] font-black uppercase tracking-tight text-center leading-none mt-1">
                  OFFICIAL<br/>SEAL
                </span>
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1">নওগাঁ সদর শাখা</span>
            </div>

            {/* Right: Director Signature */}
            <div className="text-right space-y-1">
              <div className="inline-block border-b border-gray-400 pb-1 px-4 mb-1">
                <span className="font-serif italic text-sm font-bold text-[#2c5f2d]">
                  Md. Rafiqul Islam
                </span>
              </div>
              <p className="font-black text-[11px] text-gray-900">
                প্রকৌশলী মো: রফিকুল ইসলাম
              </p>
              <p className="text-[10px] text-gray-500 font-semibold">
                প্রতিষ্ঠাতা ও ব্যবস্থাপনা পরিচালক
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
