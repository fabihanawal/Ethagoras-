import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Mail,
  X,
  FileText,
  Landmark,
  Smartphone,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { StudyNote, PaymentSettings, ContactSettings, NoteOrder } from '../lib/types';
import { addNoteOrder } from '../lib/firestoreService';

interface NotesLibrarySectionProps {
  notes: StudyNote[];
  paymentSettings: PaymentSettings;
  contactSettings: ContactSettings;
  compactHomePreview?: boolean;
  navigate?: (route: string) => void;
}

export const NotesLibrarySection: React.FC<NotesLibrarySectionProps> = ({
  notes,
  paymentSettings,
  contactSettings,
  compactHomePreview = false,
  navigate,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reader modal for Free Hook Note
  const [readingNote, setReadingNote] = useState<StudyNote | null>(null);

  // Payment & Paid Version modal
  const [buyingNote, setBuyingNote] = useState<StudyNote | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Order submission state
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryPreference: 'WhatsApp' as 'WhatsApp' | 'Email' | 'Both',
    paymentMethod: 'bKash' as 'bKash' | 'Nagad' | 'Bank',
    transactionId: '',
    senderNumber: '',
  });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<NoteOrder | null>(null);

  const activeNotes = useMemo(() => notes.filter((n) => n.active !== false), [notes]);

  const classOptions = useMemo(() => {
    return ['all', ...Array.from(new Set(activeNotes.map((n) => n.classLevel)))];
  }, [activeNotes]);

  const subjectOptions = useMemo(() => {
    return ['all', ...Array.from(new Set(activeNotes.map((n) => n.subject)))];
  }, [activeNotes]);

  const filteredNotes = useMemo(() => {
    return activeNotes.filter((note) => {
      const matchClass = selectedClass === 'all' || note.classLevel === selectedClass;
      const matchSubject = selectedSubject === 'all' || note.subject === selectedSubject;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.subject.toLowerCase().includes(q) ||
        note.chapter.toLowerCase().includes(q) ||
        note.freeHookContent.toLowerCase().includes(q);
      return matchClass && matchSubject && matchSearch;
    });
  }, [activeNotes, selectedClass, selectedSubject, searchQuery]);

  const displayedNotes = compactHomePreview ? filteredNotes.slice(0, 3) : filteredNotes;
  const cleanWhatsapp = (contactSettings?.whatsapp || '+8801700000000').replace(/[^0-9]/g, '');

  const handleCopy = (label: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const openBuyModal = (note: StudyNote) => {
    setReadingNote(null);
    setBuyingNote(note);
    setSubmittedOrder(null);
    setOrderError(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyingNote) return;

    if (!orderForm.customerName.trim() || !orderForm.customerPhone.trim() || !orderForm.transactionId.trim()) {
      setOrderError('আপনার নাম, হোয়াটসঅ্যাপ নম্বর এবং পেমেন্ট ট্রানজেকশন আইডি (TrxID) আবশ্যক।');
      return;
    }

    if (
      (orderForm.deliveryPreference === 'Email' || orderForm.deliveryPreference === 'Both') &&
      !orderForm.customerEmail.trim()
    ) {
      setOrderError('ইমেইলে নোটস পেতে অনুগ্রহ করে আপনার সঠিক ইমেইল এড্রেস লিখুন।');
      return;
    }

    try {
      setOrderSubmitting(true);
      setOrderError(null);

      const order: NoteOrder = {
        id: `NOTE-${Date.now().toString().slice(-6)}`,
        noteId: buyingNote.id,
        noteTitle: buyingNote.title,
        noteClass: buyingNote.classLevel,
        noteSubject: buyingNote.subject,
        price: buyingNote.price,
        customerName: orderForm.customerName.trim(),
        customerPhone: orderForm.customerPhone.trim(),
        customerEmail: orderForm.customerEmail.trim(),
        deliveryPreference: orderForm.deliveryPreference,
        paymentMethod: orderForm.paymentMethod,
        transactionId: orderForm.transactionId.trim(),
        senderNumber: orderForm.senderNumber.trim(),
        submittedAt: new Date().toLocaleString('bn-BD'),
        status: 'Pending',
      };

      await addNoteOrder(order);
      setSubmittedOrder(order);
    } catch (err) {
      console.error('Order submit error:', err);
      setOrderError('তথ্য জমা দিতে সমস্যা হয়েছে। সরাসরি নিচের হোয়াটসঅ্যাপ বাটনে পেমেন্ট তথ্য পাঠান।');
    } finally {
      setOrderSubmitting(false);
    }
  };

  const buildWhatsappMessage = (note: StudyNote, order?: NoteOrder | null) => {
    if (order) {
      return `আসসালামু আলাইকুম, আমি ইথাগোরাস থেকে পেইড নোটস কিনেছি।\n\nনোটস: ${order.noteTitle} (${order.noteClass})\nমূল্য: ${order.price}\nঅর্ডার আইডি: ${order.id}\nপেমেন্ট মাধ্যম: ${order.paymentMethod}\nTrxID: ${order.transactionId}\nগ্রাহকের নাম: ${order.customerName}\nহোয়াটসঅ্যাপ: ${order.customerPhone}${
        order.customerEmail ? `\nইমেইল: ${order.customerEmail}` : ''
      }\nডেলিভারি মাধ্যম: ${order.deliveryPreference}`;
    }
    return `আসসালামু আলাইকুম, আমি "${note.title}" (${note.classLevel} · ${note.price}) পেইড নোটসটি নিতে পেমেন্ট করেছি। অনুগ্রহ করে আমার ইমেইল বা হোয়াটসঅ্যাপে সম্পূর্ণ PDF নোটস পাঠিয়ে দিন।`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-bold text-[#2c5f2d]">
            স্মার্ট নোটস লাইব্রেরি · ফ্রী হুক নোটস ও পেইড পূর্ণাঙ্গ সংস্করণ
          </p>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            ক্লাস ও বিষয়ভিত্তিক ফ্রী হুক নোটস
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            প্রথমে প্রতিটি বিষয়ের গুরুত্বপূর্ণ অংশ ফ্রী হুক নোটস হিসেবে পড়ে দেখুন। পছন্দ হলে বিকাশ, নগদ বা ব্যাংক একাউন্টে পেমেন্ট করে হোয়াটসঅ্যাপে জানালেই সম্পূর্ণ PDF নোটস আপনার ইমেইল বা হোয়াটসঅ্যাপে পৌঁছে যাবে।
          </p>
        </div>

        {compactHomePreview && navigate && (
          <button
            onClick={() => navigate('#/notes')}
            className="text-sm font-bold text-[#2c5f2d] hover:underline flex items-center gap-1.5 shrink-0 whitespace-nowrap"
          >
            <span>সকল নোটস লাইব্রেরি দেখুন</span>
            <ArrowRight className="w-4 h-4 text-[#ffd700]" />
          </button>
        )}
      </div>

      {/* Filters & Search Bar */}
      {!compactHomePreview && (
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Class Filter Tabs */}
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
                  {cls === 'all' ? 'সকল ক্লাস' : cls}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বিষয় বা অধ্যায় খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-500">বিষয়:</span>
            {subjectOptions.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap shrink-0 ${
                  selectedSubject === sub
                    ? 'bg-[#2c5f2d] text-white border-[#2c5f2d]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {sub === 'all' ? 'সব বিষয়' : sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {displayedNotes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-500 font-medium">
          নির্বাচিত শ্রেণী বা বিষয়ে কোনো নোটস পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedNotes.map((note) => (
            <article
              key={note.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                {/* Unboxed clean metadata line */}
                <div className="flex items-center justify-between gap-2 text-xs text-gray-500 font-semibold">
                  <span className="truncate">{note.classLevel} · {note.subject}</span>
                  <span className="text-gray-900 font-black tabular-nums shrink-0">{note.price}</span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-snug mb-1">
                    {note.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {note.chapter} · {note.totalPages} · {note.authorTeacher}
                  </p>
                </div>

                {/* Free Hook Preview Box */}
                <div className="bg-[#f9fafb] rounded-2xl p-4 border border-gray-200 space-y-2">
                  <p className="text-xs font-black text-[#2c5f2d]">
                    {note.freeHookTitle || 'ফ্রী হুক নোটস প্রিভিউ'}
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line line-clamp-4">
                    {note.freeHookContent}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setReadingNote(note)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Eye className="w-3.5 h-3.5 text-[#2c5f2d]" />
                  <span>ফ্রী হুক পড়ুন</span>
                </button>
                <button
                  onClick={() => openBuyModal(note)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#2c5f2d] hover:bg-[#234b24] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Lock className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>পেইড ভার্সন নিন ({note.price})</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal 1: Free Hook Note Reader */}
      {readingNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-[#2c5f2d]">
                  {readingNote.classLevel} · {readingNote.subject} · {readingNote.chapter}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  {readingNote.title}
                </h3>
              </div>
              <button
                onClick={() => setReadingNote(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 space-y-2.5">
                <p className="text-sm font-black text-[#2c5f2d] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{readingNote.freeHookTitle || 'ফ্রী হুক নোটস'}</span>
                </p>
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                  {readingNote.freeHookContent}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-2.5">
                <p className="text-xs font-black text-gray-900">
                  পেইড পূর্ণাঙ্গ নোটসে যা যা থাকছে ({readingNote.totalPages}):
                </p>
                <ul className="space-y-2">
                  {readingNote.paidHighlights?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#2c5f2d] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600 font-medium">
                সম্পূর্ণ PDF মূল্য:{' '}
                <span className="text-lg font-black text-[#2c5f2d] tabular-nums">{readingNote.price}</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setReadingNote(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
                >
                  বন্ধ করুন
                </button>
                <button
                  onClick={() => openBuyModal(readingNote)}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#2c5f2d] hover:bg-[#234b24] text-white text-xs sm:text-sm font-bold shadow flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>পুরো নোটস কিনুন (পেমেন্ট তথ্য দেখুন)</span>
                  <ArrowRight className="w-4 h-4 text-[#ffd700]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Paid Version Purchase — bKash, Nagad, Bank + WhatsApp/Email Delivery */}
      {buyingNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-[#2c5f2d]">
                  সম্পূর্ণ পেইড নোটস সংগ্রহ · {buyingNote.classLevel} · {buyingNote.subject}
                </p>
                <h3 className="text-xl font-black text-gray-900 mt-1">
                  {buyingNote.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {buyingNote.totalPages} · নির্ধারিত মূল্য:{' '}
                  <span className="font-black text-[#2c5f2d] text-sm tabular-nums">{buyingNote.price}</span>
                </p>
              </div>
              <button
                onClick={() => setBuyingNote(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Account Numbers: bKash, Nagad, Bank */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-800">
                ১. নিচের যেকোনো একাউন্টে নির্ধারিত ফি ({buyingNote.price}) পেমেন্ট করুন:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* bKash */}
                <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-pink-700 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      বিকাশ (bKash)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('bkash', paymentSettings.bkashNumber)}
                      className="text-[11px] font-bold text-pink-700 hover:underline flex items-center gap-1"
                    >
                      {copiedField === 'bkash' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'bkash' ? 'কপি হয়েছে' : 'কপি'}
                    </button>
                  </div>
                  <p className="font-mono font-black text-base text-gray-900 tabular-nums">
                    {paymentSettings.bkashNumber}
                  </p>
                  <p className="text-[11px] text-gray-600">{paymentSettings.bkashAccountType}</p>
                </div>

                {/* Nagad */}
                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-orange-700 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      নগদ (Nagad)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('nagad', paymentSettings.nagadNumber)}
                      className="text-[11px] font-bold text-orange-700 hover:underline flex items-center gap-1"
                    >
                      {copiedField === 'nagad' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'nagad' ? 'কপি হয়েছে' : 'কপি'}
                    </button>
                  </div>
                  <p className="font-mono font-black text-base text-gray-900 tabular-nums">
                    {paymentSettings.nagadNumber}
                  </p>
                  <p className="text-[11px] text-gray-600">{paymentSettings.nagadAccountType}</p>
                </div>

                {/* Bank Account */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#2c5f2d] flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" />
                      ব্যাংক একাউন্ট
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('bank', paymentSettings.bankAccountNumber)}
                      className="text-[11px] font-bold text-[#2c5f2d] hover:underline flex items-center gap-1"
                    >
                      {copiedField === 'bank' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'bank' ? 'কপি হয়েছে' : 'কপি'}
                    </button>
                  </div>
                  <p className="font-mono font-black text-sm text-gray-900 tabular-nums break-all">
                    {paymentSettings.bankAccountNumber}
                  </p>
                  <p className="text-[11px] text-gray-700 font-semibold">
                    {paymentSettings.bankName} ({paymentSettings.bankBranch})
                  </p>
                  <p className="text-[10px] text-gray-600">
                    নাম: {paymentSettings.bankAccountName}
                    {paymentSettings.bankRoutingNumber ? ` · রাউটিং: ${paymentSettings.bankRoutingNumber}` : ''}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 leading-relaxed">
                {paymentSettings.paymentInstructions ||
                  'পেমেন্ট সম্পন্ন করার পর হোয়াটসঅ্যাপ নাম্বারে জানালে আপনার ইমেইল বা হোয়াটসঅ্যাপে সম্পূর্ণ নোটস (PDF) পাঠিয়ে দেওয়া হবে।'}
              </p>
            </div>

            {/* Step 2: Order Confirmation or Submitted View */}
            {submittedOrder ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2c5f2d] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-black text-gray-900 text-base">
                      আপনার পেমেন্ট তথ্য সফলভাবে জমা হয়েছে! (অর্ডার: {submittedOrder.id})
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700">
                      এখন দ্রুত নোটস পেতে নিচের বাটনে ক্লিক করে হোয়াটসঅ্যাপে ({contactSettings.whatsapp}) বার্তা পাঠান। যাচাই করার পরপরই আপনার{' '}
                      <strong>{submittedOrder.deliveryPreference === 'Email' ? 'ইমেইলে' : submittedOrder.deliveryPreference === 'Both' ? 'হোয়াটসঅ্যাপ ও ইমেইলে' : 'হোয়াটসঅ্যাপে'}</strong>{' '}
                      সম্পূর্ণ নোটস পাঠিয়ে দেওয়া হবে।
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                      buildWhatsappMessage(buyingNote, submittedOrder)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1fb857] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>হোয়াটসঅ্যাপে পেমেন্ট তথ্য পাঠান</span>
                  </a>
                  <button
                    onClick={() => setBuyingNote(null)}
                    className="px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-xs sm:text-sm"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4 pt-2 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-800">
                  ২. পেমেন্ট তথ্য ও নোটস ডেলিভারির ঠিকানা দিন:
                </p>

                {orderError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                    {orderError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      value={orderForm.customerName}
                      onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                      placeholder="শিক্ষার্থীর পুরো নাম"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">হোয়াটসঅ্যাপ নম্বর *</label>
                    <input
                      type="tel"
                      required
                      value={orderForm.customerPhone}
                      onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                      placeholder="017xxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">ইমেইল এড্রেস (ইমেইলে পেতে চাইলে)</label>
                    <input
                      type="email"
                      value={orderForm.customerEmail}
                      onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                      placeholder="example@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">কীভাবে নোটস নিতে চান?</label>
                    <select
                      value={orderForm.deliveryPreference}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          deliveryPreference: e.target.value as 'WhatsApp' | 'Email' | 'Both',
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white font-medium"
                    >
                      <option value="WhatsApp">হোয়াটসঅ্যাপে (WhatsApp PDF)</option>
                      <option value="Email">ইমেইলে (Email PDF)</option>
                      <option value="Both">হোয়াটসঅ্যাপ ও ইমেইল উভয়ই</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">পেমেন্ট মাধ্যম *</label>
                    <select
                      value={orderForm.paymentMethod}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          paymentMethod: e.target.value as 'bKash' | 'Nagad' | 'Bank',
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white font-medium"
                    >
                      <option value="bKash">বিকাশ (bKash)</option>
                      <option value="Nagad">নগদ (Nagad)</option>
                      <option value="Bank">ব্যাংক একাউন্ট</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">ট্রানজেকশন আইডি (TrxID / রেফারেন্স) *</label>
                    <input
                      type="text"
                      required
                      value={orderForm.transactionId}
                      onChange={(e) => setOrderForm({ ...orderForm, transactionId: e.target.value })}
                      placeholder="উদা: BKH8921X বা ব্যাংক রেফারেন্স"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2c5f2d]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                      buildWhatsappMessage(buyingNote)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2c5f2d] hover:underline"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন ({contactSettings.whatsapp})</span>
                  </a>

                  <button
                    type="submit"
                    disabled={orderSubmitting}
                    className="px-6 py-3 rounded-2xl bg-[#2c5f2d] hover:bg-[#234b24] text-white font-bold text-xs sm:text-sm shadow flex items-center gap-2 whitespace-nowrap"
                  >
                    <FileText className="w-4 h-4 text-[#ffd700]" />
                    <span>{orderSubmitting ? 'জমা হচ্ছে...' : 'পেমেন্ট কনফার্ম ও সাবমিট করুন'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
