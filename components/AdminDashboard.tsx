import React, { useState, useEffect } from 'react';
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
  BookOpen,
  Award,
  HelpCircle,
  FileText,
  Printer,
  Sparkles,
  Search,
  Video,
  Landmark,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import {
  Slide,
  BookingSubmission,
  ContactSettings,
  SocialSettings,
  DirectorProfile,
  TeacherProfile,
  Course,
  QuizQuestion,
  Certificate,
  PaymentSettings,
  OnlineBatch,
  StudyNote,
  NoteOrder,
} from '../lib/types';
import {
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_ONLINE_BATCHES,
  INITIAL_STUDY_NOTES,
} from '../lib/dataStore';
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
  subscribeCourses,
  saveCourse,
  deleteCourse,
  subscribeQuestions,
  saveQuestion,
  deleteQuestion,
  subscribeAllCertificates,
  issueCertificate,
  deleteCertificate,
  updatePaymentSettings,
  subscribeOnlineBatches,
  saveOnlineBatch,
  deleteOnlineBatch,
  subscribeNotes,
  saveNote,
  deleteNote,
  subscribeNoteOrders,
  updateNoteOrderStatus,
  deleteNoteOrder,
} from '../lib/firestoreService';
import { CertificateView } from './CertificateView';

interface AdminDashboardProps {
  slides: Slide[];
  bookings: BookingSubmission[];
  contactSettings: ContactSettings;
  socialSettings: SocialSettings;
  paymentSettings?: PaymentSettings;
  director: DirectorProfile;
  teachers: TeacherProfile[];
  courses?: Course[];
  onlineBatches?: OnlineBatch[];
  notes?: StudyNote[];
  noteOrders?: NoteOrder[];
  navigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  slides,
  bookings,
  contactSettings,
  socialSettings,
  paymentSettings,
  director,
  teachers,
  courses,
  onlineBatches,
  notes,
  noteOrders,
  navigate,
}) => {
  const { user, isAdmin, adminEmails, signInWithGoogle, signOut } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    | 'contact_social'
    | 'online_batches'
    | 'notes_library'
    | 'payment_orders'
    | 'courses'
    | 'questions'
    | 'certificates'
    | 'director'
    | 'teachers'
    | 'slides'
    | 'bookings'
    | 'admin_emails'
    | 'quickshare'
  >('contact_social');

  // Copied link toast
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Status messages
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Forms local states
  const [contactForm, setContactForm] = useState<ContactSettings>(contactSettings);
  const [socialForm, setSocialForm] = useState<SocialSettings>(socialSettings);
  const [paymentForm, setPaymentForm] = useState<PaymentSettings>(
    paymentSettings || INITIAL_PAYMENT_SETTINGS
  );
  const [directorForm, setDirectorForm] = useState<DirectorProfile>(director);

  useEffect(() => {
    if (paymentSettings) setPaymentForm(paymentSettings);
  }, [paymentSettings]);

  // Courses state & modal
  const [coursesList, setCoursesList] = useState<Course[]>(courses || []);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseSubjectsText, setCourseSubjectsText] = useState('');
  const [courseFeaturesText, setCourseFeaturesText] = useState('');

  // Online Batches state & modal
  const [onlineBatchesList, setOnlineBatchesList] = useState<OnlineBatch[]>(
    onlineBatches || INITIAL_ONLINE_BATCHES
  );
  const [editingBatch, setEditingBatch] = useState<OnlineBatch | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Study Notes state & modal
  const [notesList, setNotesList] = useState<StudyNote[]>(notes || INITIAL_STUDY_NOTES);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notePaidHighlightsText, setNotePaidHighlightsText] = useState('');

  // Paid Note Orders state
  const [noteOrdersList, setNoteOrdersList] = useState<NoteOrder[]>(noteOrders || []);

  // Quiz Questions state & modal
  const [questionsList, setQuestionsList] = useState<QuizQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState('all');

  // Certificates state & modal
  const [certificatesList, setCertificatesList] = useState<Certificate[]>([]);
  const [isIssueCertModalOpen, setIsIssueCertModalOpen] = useState(false);
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<Certificate | null>(null);
  const [newCertForm, setNewCertForm] = useState<Partial<Certificate>>({
    studentName: '',
    userEmail: '',
    courseName: 'এসএসসি স্পেশাল রিভিশন ব্যাচ',
    rollNo: '',
    type: 'course_completion',
    description: 'ইথাগোরাস প্রাইভেটের নির্ধারিত কোর্স কারিকুলাম সফলভাবে সম্পন্ন করায় এই প্রশংসাপত্র প্রদান করা হলো।',
    issuedBy: 'পরিচালক, ইথাগোরাস প্রাইভেট (নওগাঁ)',
  });

  // Subscribe to real-time collections
  useEffect(() => {
    const unsubCourses = subscribeCourses((data) => setCoursesList(data));
    const unsubQuestions = subscribeQuestions((data) => setQuestionsList(data));
    const unsubCertificates = subscribeAllCertificates((data) => setCertificatesList(data));
    const unsubOnlineBatches = subscribeOnlineBatches((data) => setOnlineBatchesList(data));
    const unsubNotes = subscribeNotes((data) => setNotesList(data));
    const unsubNoteOrders = subscribeNoteOrders((data) => setNoteOrdersList(data));
    return () => {
      unsubCourses();
      unsubQuestions();
      unsubCertificates();
      unsubOnlineBatches();
      unsubNotes();
      unsubNoteOrders();
    };
  }, []);

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

  // Course Handlers
  const handleOpenAddCourse = () => {
    setEditingCourse({
      id: `course-${Date.now()}`,
      title: '',
      level: '৮ম - ১০ম শ্রেণী',
      duration: '৬ মাস',
      subjects: ['সাধারণ গণিত', 'উচ্চতর গণিত', 'পদার্থবিজ্ঞান'],
      features: ['সাপ্তাহিক ও মাসিক টেস্ট', 'স্মার্ট নোটস ও শিট'],
      price: '৳ ৩,৫০০ / মাস',
      popular: false,
      displayOrder: coursesList.length + 1,
    });
    setCourseSubjectsText('সাধারণ গণিত, উচ্চতর গণিত, পদার্থবিজ্ঞান');
    setCourseFeaturesText('সাপ্তাহিক ও মাসিক টেস্ট, স্মার্ট নোটস ও শিট');
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (c: Course) => {
    setEditingCourse({ ...c });
    setCourseSubjectsText((c.subjects || []).join(', '));
    setCourseFeaturesText((c.features || []).join(', '));
    setIsCourseModalOpen(true);
  };

  const handleSaveCourseForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      const subs = courseSubjectsText.split(',').map((s) => s.trim()).filter(Boolean);
      const feats = courseFeaturesText.split(',').map((f) => f.trim()).filter(Boolean);
      const updated: Course = {
        ...editingCourse,
        subjects: subs.length > 0 ? subs : ['সকল বিষয়'],
        features: feats.length > 0 ? feats : ['বিশেষ ক্লাস ও নোট'],
      };
      await saveCourse(updated);
      setIsCourseModalOpen(false);
      setEditingCourse(null);
      showNotification('কোর্স তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      alert('কোর্স সংরক্ষণে সমস্যা হয়েছে।');
    }
  };

  const handleDeleteCourseItem = async (id: string, title: string) => {
    if (confirm(`আপনি কি "${title}" কোর্সটি মুছে ফেলতে চান?`)) {
      try {
        await deleteCourse(id);
        showNotification('কোর্সটি সফলভাবে মুছে ফেলা হয়েছে।');
      } catch (err) {
        alert('কোর্স মুছতে সমস্যা হয়েছে।');
      }
    }
  };

  // Payment Settings Save Handler
  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePaymentSettings(paymentForm);
      showNotification('বিকাশ, নগদ ও ব্যাংক একাউন্ট তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      alert('পেমেন্ট তথ্য সংরক্ষণে সমস্যা হয়েছে।');
    }
  };

  // Online Batch Handlers
  const handleOpenAddBatch = () => {
    setEditingBatch({
      id: `ob-${Date.now()}`,
      title: '',
      classLevel: '৯ম - ১০ম শ্রেণী (SSC)',
      subject: '',
      schedule: 'শনি, সোম, বুধ · রাত ৮:০০ টা',
      platform: 'Google Meet / Zoom Live',
      meetingLink: 'https://meet.google.com/',
      instructor: '',
      monthlyFee: '৳ ১,৫০০ / মাস',
      description: '',
      nextTopic: '',
      active: true,
      displayOrder: onlineBatchesList.length + 1,
    });
    setIsBatchModalOpen(true);
  };

  const handleSaveBatchForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    try {
      await saveOnlineBatch(editingBatch);
      setIsBatchModalOpen(false);
      setEditingBatch(null);
      showNotification('অনলাইন ব্যাচের তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      alert('অনলাইন ব্যাচ সংরক্ষণে সমস্যা হয়েছে।');
    }
  };

  const handleDeleteBatchItem = async (id: string, title: string) => {
    if (confirm(`আপনি কি "${title}" অনলাইন ব্যাচটি মুছে ফেলতে চান?`)) {
      try {
        await deleteOnlineBatch(id);
        showNotification('অনলাইন ব্যাচটি মুছে ফেলা হয়েছে।');
      } catch (err) {
        alert('অনলাইন ব্যাচ মুছতে সমস্যা হয়েছে।');
      }
    }
  };

  // Study Notes Handlers
  const handleOpenAddNote = () => {
    setEditingNote({
      id: `note-${Date.now()}`,
      title: '',
      classLevel: '৯ম - ১০ম শ্রেণী (SSC)',
      subject: 'গণিত',
      chapter: '',
      freeHookTitle: 'ফ্রী হুক নোট: গুরুত্বপূর্ণ সূত্র ও প্রিভিউ',
      freeHookContent: '',
      paidHighlights: [
        'সম্পূর্ণ অধ্যায়ের কালারফুল PDF লেকচার নোটস',
        'বিগত বোর্ড পরীক্ষার সৃজনশীল ও MCQ সমাধান',
      ],
      totalPages: '৪৫ পৃষ্ঠা PDF',
      price: '৳ ১৫০',
      authorTeacher: director.name || 'ইথাগোরাস টিম',
      active: true,
      displayOrder: notesList.length + 1,
    });
    setNotePaidHighlightsText(
      'সম্পূর্ণ অধ্যায়ের কালারফুল PDF লেকচার নোটস\nবিগত বোর্ড পরীক্ষার সৃজনশীল ও MCQ সমাধান'
    );
    setIsNoteModalOpen(true);
  };

  const handleOpenEditNote = (n: StudyNote) => {
    setEditingNote({ ...n });
    setNotePaidHighlightsText((n.paidHighlights || []).join('\n'));
    setIsNoteModalOpen(true);
  };

  const handleSaveNoteForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    try {
      const highlights = notePaidHighlightsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      await saveNote({
        ...editingNote,
        paidHighlights: highlights.length > 0 ? highlights : ['সম্পূর্ণ অধ্যায়ভিত্তিক PDF নোটস'],
      });
      setIsNoteModalOpen(false);
      setEditingNote(null);
      showNotification('ফ্রী হুক ও পেইড নোটস সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      alert('নোটস সংরক্ষণে সমস্যা হয়েছে।');
    }
  };

  const handleDeleteNoteItem = async (id: string, title: string) => {
    if (confirm(`আপনি কি "${title}" নোটসটি মুছে ফেলতে চান?`)) {
      try {
        await deleteNote(id);
        showNotification('নোটসটি মুছে ফেলা হয়েছে।');
      } catch (err) {
        alert('নোটস মুছতে সমস্যা হয়েছে।');
      }
    }
  };

  // Quiz Question Handlers
  const handleOpenAddQuestion = () => {
    setEditingQuestion({
      id: `q-${Date.now()}`,
      category: 'math',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      displayOrder: questionsList.length + 1,
    });
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: QuizQuestion) => {
    const opts = q.options?.length === 4 ? [...q.options] : [...(q.options || []), '', '', '', ''].slice(0, 4);
    setEditingQuestion({
      ...q,
      options: opts,
    });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestionForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    if (editingQuestion.options.some((opt) => !opt.trim())) {
      alert('অনুগ্রহ করে ৪টি বিকল্প অপশনই পূরণ করুন।');
      return;
    }
    try {
      await saveQuestion(editingQuestion);
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      showNotification('কুইজ প্রশ্ন সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      alert('প্রশ্ন সংরক্ষণে সমস্যা হয়েছে।');
    }
  };

  const handleDeleteQuestionItem = async (id: string, qText: string) => {
    if (confirm(`আপনি কি এই প্রশ্নটি মুছে ফেলতে চান?\n"${qText.substring(0, 40)}..."`)) {
      try {
        await deleteQuestion(id);
        showNotification('প্রশ্নটি মুছে ফেলা হয়েছে।');
      } catch (err) {
        alert('প্রশ্ন মুছতে সমস্যা হয়েছে।');
      }
    }
  };

  // Certificate Issuance Handlers
  const handleIssueCertificateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertForm.studentName || !newCertForm.userEmail) {
      alert('শিক্ষার্থীর নাম ও জিমেইল আইডি আবশ্যক!');
      return;
    }
    try {
      const certId = `cert-${Date.now()}`;
      const prefix = newCertForm.type === 'merit_top10' ? 'ETH-MERIT' : 'ETH-CRS';
      const year = new Date().getFullYear();
      const rand = Math.floor(1000 + Math.random() * 9000);
      const certNum = `${prefix}-${year}-${rand}`;

      const certificate: Certificate = {
        id: certId,
        userId: newCertForm.userEmail.trim().toLowerCase(),
        userEmail: newCertForm.userEmail.trim().toLowerCase(),
        studentName: newCertForm.studentName.trim(),
        title: newCertForm.type === 'merit_top10' ? 'মেধা ও শ্রেষ্ঠত্ব সনদপত্র' : 'কোর্স সমাপন প্রশংসাপত্র',
        type: (newCertForm.type as 'merit_top10' | 'course_completion') || 'course_completion',
        description: newCertForm.description || 'ইথাগোরাস প্রাইভেটের নির্ধারিত কোর্স সফলভাবে সম্পন্ন করায় এই প্রশংসাপত্র প্রদান করা হলো।',
        issueDate: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
        rollNo: newCertForm.rollNo?.trim() || undefined,
        certificateNumber: certNum,
        courseName: newCertForm.courseName || 'ইথাগোরাস স্পেশাল কোর্স',
        issuedBy: newCertForm.issuedBy || 'পরিচালক, ইথাগোরাস প্রাইভেট (নওগাঁ)',
      };

      await issueCertificate(certificate);
      setIsIssueCertModalOpen(false);
      setNewCertForm({
        studentName: '',
        userEmail: '',
        courseName: 'এসএসসি স্পেশাল রিভিশন ব্যাচ',
        rollNo: '',
        type: 'course_completion',
        description: 'ইথাগোরাস প্রাইভেটের নির্ধারিত কোর্স কারিকুলাম সফলভাবে সম্পন্ন করায় এই প্রশংসাপত্র প্রদান করা হলো।',
        issuedBy: 'পরিচালক, ইথাগোরাস প্রাইভেট (নওগাঁ)',
      });
      showNotification(`সনদপত্র (${certNum}) সফলভাবে ইস্যু করা হয়েছে!`);
      setSelectedCertForPreview(certificate);
    } catch (err) {
      alert('সনদপত্র ইস্যু করতে সমস্যা হয়েছে।');
    }
  };

  const handleDeleteCert = async (id: string, name: string) => {
    if (confirm(`আপনি কি "${name}" এর সনদপত্রটি মুছে ফেলতে চান?`)) {
      try {
        await deleteCertificate(id);
        showNotification('সনদপত্রটি মুছে ফেলা হয়েছে।');
      } catch (err) {
        alert('সনদপত্র মুছতে সমস্যা হয়েছে।');
      }
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
          onClick={() => setActiveTab('online_batches')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'online_batches' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Video className="w-4 h-4" />
          অনলাইন ব্যাচ ({onlineBatchesList.length})
        </button>

        <button
          onClick={() => setActiveTab('notes_library')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'notes_library' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          ফ্রী ও পেইড নোটস ({notesList.length})
        </button>

        <button
          onClick={() => setActiveTab('payment_orders')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'payment_orders' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          পেমেন্ট ও নোট অর্ডার ({noteOrdersList.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'courses' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          কোর্স ব্যবস্থাপনা ({coursesList.length})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'questions' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          কুইজ প্রশ্ন ব্যাংক ({questionsList.length})
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'certificates' ? 'bg-[#2c5f2d] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Award className="w-4 h-4" />
          সনদপত্র ইস্যু ({certificatesList.length})
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

      {/* Tab: Online Batches Management */}
      {activeTab === 'online_batches' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-[#2c5f2d]" />
                অনলাইন লাইভ ব্যাচ ব্যবস্থাপনা
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                অনলাইনে ভর্তি হওয়া শিক্ষার্থীদের জন্য লাইভ ক্লাস রুটিন, মিটিং লিংক (Google Meet/Zoom) ও ব্যাচের তথ্য সম্পাদনা করুন।
              </p>
            </div>
            <button
              onClick={handleOpenAddBatch}
              className="px-4 py-2.5 rounded-2xl bg-[#2c5f2d] hover:bg-[#224b23] text-white font-bold text-xs sm:text-sm shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#ffd700]" />
              <span>নতুন অনলাইন ব্যাচ যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {onlineBatchesList.map((batch) => (
              <div
                key={batch.id}
                className="bg-gray-50 rounded-3xl p-6 border border-gray-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                    <span>{batch.classLevel} · {batch.subject}</span>
                    <span className="text-[#2c5f2d] font-black">{batch.monthlyFee}</span>
                  </div>
                  <h4 className="text-lg font-black text-gray-900">{batch.title}</h4>
                  <p className="text-xs text-gray-600">{batch.description}</p>
                  <div className="text-xs text-gray-700 space-y-1 pt-2 border-t border-gray-200">
                    <p><strong>সময়:</strong> {batch.schedule}</p>
                    <p><strong>মাধ্যম:</strong> {batch.platform}</p>
                    <p><strong>শিক্ষক:</strong> {batch.instructor}</p>
                    <p className="truncate"><strong>ক্লাস লিংক:</strong> {batch.meetingLink}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className={`text-xs font-bold ${batch.active !== false ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {batch.active !== false ? '● সক্রিয়' : '○ নিষ্ক্রিয়'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingBatch({ ...batch });
                        setIsBatchModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#2c5f2d]" />
                      <span>এডিট</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBatchItem(batch.id, batch.title)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Free Hook & Paid Notes Management */}
      {activeTab === 'notes_library' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2c5f2d]" />
                ফ্রী হুক নোটস ও পেইড ভার্সন ব্যবস্থাপনা
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                বিভিন্ন ক্লাস ও বিষয়ের ফ্রী হুক নোটস এবং সম্পূর্ণ পেইড নোটসের মূল্য ও বিবরণ সংযোজন বা সম্পাদনা করুন।
              </p>
            </div>
            <button
              onClick={handleOpenAddNote}
              className="px-4 py-2.5 rounded-2xl bg-[#2c5f2d] hover:bg-[#224b23] text-white font-bold text-xs sm:text-sm shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#ffd700]" />
              <span>নতুন নোটস যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notesList.map((note) => (
              <div
                key={note.id}
                className="bg-gray-50 rounded-3xl p-6 border border-gray-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                    <span>{note.classLevel} · {note.subject}</span>
                    <span className="text-[#2c5f2d] font-black">{note.price} ({note.totalPages})</span>
                  </div>
                  <h4 className="text-lg font-black text-gray-900">{note.title}</h4>
                  <p className="text-xs text-gray-500">{note.chapter} · {note.authorTeacher}</p>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs text-gray-700 line-clamp-3 whitespace-pre-line">
                    <strong className="text-[#2c5f2d] block mb-1">{note.freeHookTitle}</strong>
                    {note.freeHookContent}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className={`text-xs font-bold ${note.active !== false ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {note.active !== false ? '● প্রকাশিত' : '○ খসড়া'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditNote(note)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#2c5f2d]" />
                      <span>এডিট</span>
                    </button>
                    <button
                      onClick={() => handleDeleteNoteItem(note.id, note.title)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Payment Numbers (bKash, Nagad, Bank) & Note Orders */}
      {activeTab === 'payment_orders' && (
        <div className="space-y-8">
          {/* Payment Account Numbers Config */}
          <form onSubmit={handleSavePaymentSettings} className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md space-y-6">
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-1 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#2c5f2d]" />
                বিকাশ, নগদ ও ব্যাংক একাউন্ট নম্বর সেটিংস
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                শিক্ষার্থীরা পেইড নোটস নেওয়ার জন্য ক্লিক করলে নিচের এই নম্বরগুলো প্রদর্শিত হবে।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">বিকাশ নম্বর (bKash) *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.bkashNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bkashNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">বিকাশ একাউন্টের ধরণ</label>
                <input
                  type="text"
                  value={paymentForm.bkashAccountType}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bkashAccountType: e.target.value })}
                  placeholder="পার্সোনাল (Send Money) / মার্চেন্ট"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">নগদ নম্বর (Nagad) *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.nagadNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, nagadNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">নগদ একাউন্টের ধরণ</label>
                <input
                  type="text"
                  value={paymentForm.nagadAccountType}
                  onChange={(e) => setPaymentForm({ ...paymentForm, nagadAccountType: e.target.value })}
                  placeholder="পার্সোনাল (Send Money)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ব্যাংকের নাম (Bank Name) *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.bankName}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">শাখা (Branch)</label>
                <input
                  type="text"
                  value={paymentForm.bankBranch}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bankBranch: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">একাউন্ট হোল্ডারের নাম *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.bankAccountName}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bankAccountName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ব্যাংক একাউন্ট নম্বর *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.bankAccountNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bankAccountNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">পেমেন্ট ও ডেলিভারি নির্দেশনা</label>
              <textarea
                rows={2}
                value={paymentForm.paymentInstructions || ''}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentInstructions: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#2c5f2d] hover:bg-[#224b23] text-white font-bold text-sm shadow flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-[#ffd700]" />
                <span>পেমেন্ট একাউন্ট তথ্য সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>

          {/* Note Purchase Orders Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
            <div>
              <h3 className="text-xl font-black text-gray-900">পেইড নোটস অর্ডার ও ডেলিভারি তালিকা</h3>
              <p className="text-xs text-gray-500 font-medium">
                যারা বিকাশ, নগদ বা ব্যাংকে পে করে ফরম সাবমিট করেছে তাদের হোয়াটসঅ্যাপ বা ইমেইলে PDF নোটস পাঠিয়ে ডেলিভারড মার্ক করুন।
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">অর্ডার ও তারিখ</th>
                    <th className="py-3 px-4">ক্রেতার তথ্য</th>
                    <th className="py-3 px-4">নোটস ও মূল্য</th>
                    <th className="py-3 px-4">পেমেন্ট (TrxID)</th>
                    <th className="py-3 px-4">ডেলিভারি মাধ্যম</th>
                    <th className="py-3 px-4">স্থিতি</th>
                    <th className="py-3 px-4 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {noteOrdersList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-gray-400 font-medium">
                        এখনও কোনো পেইড নোটস অর্ডার আসেনি।
                      </td>
                    </tr>
                  ) : (
                    noteOrdersList.map((order) => {
                      const customerWa = order.customerPhone.replace(/[^0-9]/g, '');
                      const waUrl = `https://wa.me/${customerWa.startsWith('88') ? customerWa : `88${customerWa}`}?text=${encodeURIComponent(
                        `আসসালামু আলাইকুম ${order.customerName}, আপনার "${order.noteTitle}" নোটসের পেমেন্ট (${order.transactionId}) নিশ্চিত হয়েছে। নিচে সম্পূর্ণ PDF নোটস সংযুক্ত করা হলো।`
                      )}`;
                      return (
                        <tr key={order.id} className="hover:bg-gray-50/70">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-[#2c5f2d]">{order.id}</span>
                            <span className="block text-[10px] text-gray-400">{order.submittedAt}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900">{order.customerName}</div>
                            <div className="text-[11px] text-emerald-800 font-semibold">{order.customerPhone}</div>
                            {order.customerEmail && <div className="text-[11px] text-gray-500">{order.customerEmail}</div>}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 max-w-[180px] truncate">{order.noteTitle}</div>
                            <div className="text-[11px] text-gray-500">{order.noteClass} · {order.price}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-gray-900">{order.paymentMethod}</span>
                            <span className="block font-mono text-[11px] text-[#2c5f2d]">{order.transactionId}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold">{order.deliveryPreference}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366] text-white font-bold text-[11px]"
                              title="গ্রাহকের হোয়াটসঅ্যাপে পাঠান"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                            {order.customerEmail && (
                              <a
                                href={`mailto:${order.customerEmail}?subject=${encodeURIComponent(
                                  `Ethagoras Full Notes PDF: ${order.noteTitle}`
                                )}&body=${encodeURIComponent(
                                  `প্রিয় ${order.customerName},\nআপনার ক্রয়কৃত "${order.noteTitle}" (${order.noteClass}) সম্পূর্ণ PDF নোটস এই ইমেইলের সাথে পাঠানো হলো।`
                                )}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px]"
                                title="গ্রাহকের ইমেইলে পাঠান"
                              >
                                <Mail className="w-3 h-3" />
                                <span>Email</span>
                              </a>
                            )}
                            {order.status !== 'Delivered' && (
                              <button
                                onClick={async () => {
                                  await updateNoteOrderStatus(order.id, 'Delivered');
                                  showNotification('অর্ডারটি Delivered হিসেবে চিহ্নিত হয়েছে।');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px]"
                              >
                                ডেলিভারড
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (confirm('এই অর্ডারটি মুছে ফেলতে চান?')) {
                                  await deleteNoteOrder(order.id);
                                  showNotification('অর্ডারটি মুছে ফেলা হয়েছে।');
                                }
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg inline-flex"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Courses Management */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2c5f2d]" />
                কোর্স ও ব্যাচ ব্যবস্থাপনা
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                নতুন কোর্স সংযোজন, ফি ও মেয়াদ নির্ধারণ, বিষয়াবলী এবং সুবিধা সম্পাদনা করুন।
              </p>
            </div>
            <button
              onClick={handleOpenAddCourse}
              className="px-4 py-2.5 rounded-2xl bg-[#2c5f2d] hover:bg-[#224b23] text-white font-bold text-xs sm:text-sm shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#ffd700]" />
              <span>নতুন কোর্স যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesList.map((course) => (
              <div
                key={course.id}
                className="bg-gray-50 rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {course.level}
                    </span>
                    {course.popular && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ffd700] text-gray-950 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        জনপ্রিয়
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-black text-gray-900 mb-2 leading-tight">
                    {course.title}
                  </h4>

                  <div className="flex items-center justify-between text-xs font-bold text-gray-600 mb-4 pb-3 border-b border-gray-200">
                    <span>মেয়াদ: {course.duration}</span>
                    <span className="text-[#2c5f2d] text-sm font-black">{course.price}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase">বিষয়সমূহ:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {course.subjects?.map((sub, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-white px-2 py-0.5 rounded-lg border border-gray-200 text-gray-700 font-medium"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase">সুবিধাসমূহ:</p>
                      <ul className="text-xs text-gray-600 space-y-1 mt-1">
                        {course.features?.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleOpenEditCourse(course)}
                    className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold flex items-center gap-1"
                    title="সম্পাদনা করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#2c5f2d]" />
                    <span>এডিট</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCourseItem(course.id, course.title)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1"
                    title="কোর্স মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Quiz Questions Bank */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#2c5f2d]" />
                কুইজ প্রশ্ন ব্যাংক ও কন্টেন্ট ব্যবস্থাপনা
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                অনলাইন কুইজ ইঞ্জিনের প্রশ্নাবলী, বিকল্প উত্তর ও সমাধান সরাসরি এখান থেকে পরিচালনা করুন।
              </p>
            </div>
            <button
              onClick={handleOpenAddQuestion}
              className="px-4 py-2.5 rounded-2xl bg-[#2c5f2d] hover:bg-[#224b23] text-white font-bold text-xs sm:text-sm shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#ffd700]" />
              <span>নতুন প্রশ্ন যোগ করুন</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'সকল বিষয়' },
              { id: 'math', label: 'গণিত' },
              { id: 'science', label: 'বিজ্ঞান' },
              { id: 'english', label: 'ইংরেজি' },
              { id: 'gk', label: 'সাধারণ জ্ঞান' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setQuestionCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  questionCategoryFilter === cat.id
                    ? 'bg-[#2c5f2d] text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {questionsList
              .filter((q) => questionCategoryFilter === 'all' || q.category === questionCategoryFilter)
              .map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-gray-50 rounded-2xl p-5 border border-gray-200 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#2c5f2d]/10 text-[#2c5f2d] font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-gray-200 text-gray-800">
                        {q.category}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                        {q.question}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditQuestion(q)}
                        className="p-1.5 rounded-lg text-[#2c5f2d] hover:bg-emerald-50 text-xs font-bold"
                        title="প্রশ্ন সম্পাদনা করুন"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestionItem(q.id, q.question)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold"
                        title="প্রশ্ন মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
                    {q.options?.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctAnswer;
                      return (
                        <div
                          key={oIdx}
                          className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 ${
                            isCorrect
                              ? 'bg-emerald-100/70 border border-emerald-400 text-emerald-900 font-bold'
                              : 'bg-white border border-gray-200 text-gray-700'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {['ক', 'খ', 'গ', 'ঘ'][oIdx] || oIdx + 1}
                          </span>
                          <span className="truncate">{opt}</span>
                          {isCorrect && (
                            <span className="ml-auto text-[10px] bg-emerald-700 text-white px-1.5 py-0.5 rounded">
                              সঠিক উত্তর
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 font-medium">
                      <span className="font-bold">ব্যাখ্যা:</span> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab: Certificates Management */}
      {activeTab === 'certificates' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ffd700]" />
                অফিসিয়াল সনদপত্র ও প্রশংসাপত্র রেকর্ড
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                কুইজের সেরা ১০ মেধা সনদ এবং কোর্স সম্পন্নকারী শিক্ষার্থীদের সনদপত্র সরাসরি ইস্যু ও প্রিন্ট করুন।
              </p>
            </div>
            <button
              onClick={() => setIsIssueCertModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#ffd700] hover:bg-[#e6c200] text-gray-950 font-black text-xs sm:text-sm shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন সনদপত্র ইস্যু করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold text-[10px] tracking-wider rounded-xl">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">সনদপত্র নং</th>
                  <th className="py-3 px-4">শিক্ষার্থীর নাম</th>
                  <th className="py-3 px-4">জিমেইল / ইমেইল</th>
                  <th className="py-3 px-4">ধরণ ও কোর্স</th>
                  <th className="py-3 px-4">ইস্যু তারিখ</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certificatesList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                      কোনো সনদপত্র এখনও ইস্যু করা হয়নি।
                    </td>
                  </tr>
                ) : (
                  certificatesList.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#2c5f2d]">
                        {cert.certificateNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {cert.studentName}
                        {cert.rollNo && (
                          <span className="block text-[10px] text-gray-400">রোল: {cert.rollNo}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {cert.userEmail}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            cert.type === 'merit_top10'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {cert.type === 'merit_top10' ? '🏆 মেধা সেরা ১০' : '🎓 কোর্স সমাপন'}
                        </span>
                        <span className="block text-[11px] text-gray-600 font-medium mt-0.5 truncate max-w-[180px]">
                          {cert.courseName || cert.title}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{cert.issueDate}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedCertForPreview(cert)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#2c5f2d] text-white font-bold text-[11px] hover:bg-[#224b23] inline-flex items-center gap-1 shadow-sm"
                          title="সনদপত্র দেখুন ও প্রিন্ট করুন"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#ffd700]" />
                          <span>প্রিন্ট / ভিউ</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCert(cert.id, cert.studentName)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold"
                          title="সনদপত্র মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
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
                          <div className="text-xs text-gray-600 font-medium mt-0.5">
                            {b.learningMode === 'Online' ? 'অনলাইন লাইভ ব্যাচ' : 'অফলাইন ক্যাম্পাস'} · {b.shiftPreference} Shift
                          </div>
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
              { title: 'অনলাইন লাইভ ব্যাচ পোর্টাল', path: '#/online-batch', desc: 'অনলাইন ভর্তি ও লাইভ ক্লাসরুম পোর্টাল' },
              { title: 'ফ্রী হুক ও পেইড নোটস লাইব্রেরি', path: '#/notes', desc: 'সকল ক্লাস ও বিষয়ের ফ্রী হুক এবং পেইড নোটস' },
              { title: 'শিক্ষক ও পরিচালক প্রোফাইল', path: '#/faculty', desc: 'প্রতিষ্ঠানের শিক্ষক ও পরিচালকের পরিচিতি' },
              { title: 'অনলাইন ভর্তি ফর্ম', path: '#/admission', desc: 'সরাসরি ভর্তি আবেদন পেজ' },
              { title: 'স্মার্ট কুইজ পরীক্ষা', path: '#/quiz', desc: 'মেধা যাচাই ও শীর্ষ ১০ লিডারবোর্ড' },
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

      {/* Course Edit/Create Modal */}
      {isCourseModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2c5f2d]" />
                {editingCourse.id ? 'কোর্স তথ্য সম্পাদনা' : 'নতুন কোর্স সংযোজন'}
              </h3>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourseForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">কোর্সের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  placeholder="যেমন: এসএসসি স্পেশাল গণিত ও বিজ্ঞান ব্যাচ"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2c5f2d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">শ্রেণী / স্তর *</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.level}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                    placeholder="যেমন: ৮ম - ১০ম শ্রেণী"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">কোর্সের মেয়াদ *</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    placeholder="যেমন: ৬ মাস / ১ বছর"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">কোর্স ফি *</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                    placeholder="যেমন: ৳ ৩,৫০০ / মাস"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={editingCourse.popular || false}
                      onChange={(e) => setEditingCourse({ ...editingCourse, popular: e.target.checked })}
                      className="w-4 h-4 rounded text-[#2c5f2d] focus:ring-[#2c5f2d]"
                    />
                    <span>জনপ্রিয় কোর্স ব্যাজ দেখান</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  বিষয়সমূহ (কমা দিয়ে লিখুন)
                </label>
                <input
                  type="text"
                  value={courseSubjectsText}
                  onChange={(e) => setCourseSubjectsText(e.target.value)}
                  placeholder="সাধারণ গণিত, উচ্চতর গণিত, পদার্থবিজ্ঞান"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  বিশেষ সুবিধাসমূহ (কমা দিয়ে লিখুন)
                </label>
                <input
                  type="text"
                  value={courseFeaturesText}
                  onChange={(e) => setCourseFeaturesText(e.target.value)}
                  placeholder="সাপ্তাহিক টেস্ট, স্মার্ট ডিজিটাল ক্লাসরুম, মডেল টেস্ট"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2c5f2d] hover:bg-[#224b23] text-white text-xs font-bold shadow flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#ffd700]" />
                  <span>কোর্স সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Question Edit/Create Modal */}
      {isQuestionModalOpen && editingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#2c5f2d]" />
                কুইজ প্রশ্ন সম্পাদনা
              </h3>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestionForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">বিষয় / ক্যাটাগরি *</label>
                  <select
                    value={editingQuestion.category}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  >
                    <option value="math">গণিত (Math)</option>
                    <option value="science">বিজ্ঞান (Science)</option>
                    <option value="english">ইংরেজি (English)</option>
                    <option value="gk">সাধারণ জ্ঞান (General Knowledge)</option>
                    <option value="bangla">বাংলা (Bangla)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">সঠিক বিকল্প অপশন *</label>
                  <select
                    value={editingQuestion.correctAnswer}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-emerald-400 bg-emerald-50 text-emerald-950 font-bold text-sm"
                  >
                    <option value={0}>অপশন ১ (ক)</option>
                    <option value={1}>অপশন ২ (খ)</option>
                    <option value={2}>অপশন ৩ (গ)</option>
                    <option value={3}>অপশন ৪ (ঘ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">প্রশ্নের বিবরণ *</label>
                <textarea
                  rows={2}
                  required
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  placeholder="প্রশ্নের পুরো লাইনটি এখানে লিখুন..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2c5f2d]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">বিকল্প উত্তরসমূহ (৪টি অপশন) *</label>
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        editingQuestion.correctAnswer === idx
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {['ক', 'খ', 'গ', 'ঘ'][idx]}
                    </span>
                    <input
                      type="text"
                      required
                      value={editingQuestion.options[idx] || ''}
                      onChange={(e) => {
                        const newOpts = [...editingQuestion.options];
                        newOpts[idx] = e.target.value;
                        setEditingQuestion({ ...editingQuestion, options: newOpts });
                      }}
                      placeholder={`বিকল্প ${['ক', 'খ', 'গ', 'ঘ'][idx]}`}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">সমাধান বা ব্যাখ্যা (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={editingQuestion.explanation || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  placeholder="শিক্ষার্থীরা কুইজ শেষ করার পর এই ব্যাখ্যা দেখতে পাবে"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2c5f2d] hover:bg-[#224b23] text-white text-xs font-bold shadow flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#ffd700]" />
                  <span>প্রশ্ন সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Certificate Modal */}
      {isIssueCertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ffd700]" />
                শিক্ষার্থীকে সনদপত্র ইস্যু করুন
              </h3>
              <button
                onClick={() => setIsIssueCertModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueCertificateForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">সনদপত্রের ধরণ *</label>
                <select
                  value={newCertForm.type}
                  onChange={(e) => setNewCertForm({ ...newCertForm, type: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
                >
                  <option value="course_completion">কোর্স সমাপন প্রশংসাপত্র (Course Completion)</option>
                  <option value="merit_top10">মেধা ও শ্রেষ্ঠত্ব সনদপত্র (Merit / Top 10)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">শিক্ষার্থীর পুরো নাম *</label>
                  <input
                    type="text"
                    required
                    value={newCertForm.studentName}
                    onChange={(e) => setNewCertForm({ ...newCertForm, studentName: e.target.value })}
                    placeholder="যেমন: মো: তানভীর হোসেন"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">শিক্ষার্থীর জিমেইল *</label>
                  <input
                    type="email"
                    required
                    value={newCertForm.userEmail}
                    onChange={(e) => setNewCertForm({ ...newCertForm, userEmail: e.target.value })}
                    placeholder="student@gmail.com"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                  <span className="text-[10px] text-gray-400">এই জিমেইল আইডির প্রোফাইলে সনদ যুক্ত হবে</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">কোর্সের নাম *</label>
                  <input
                    type="text"
                    required
                    value={newCertForm.courseName}
                    onChange={(e) => setNewCertForm({ ...newCertForm, courseName: e.target.value })}
                    placeholder="যেমন: এসএসসি রিভিশন ব্যাচ"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">রোল / রেজিস্ট্রেশন নম্বর</label>
                  <input
                    type="text"
                    value={newCertForm.rollNo}
                    onChange={(e) => setNewCertForm({ ...newCertForm, rollNo: e.target.value })}
                    placeholder="যেমন: ETH-2026-054"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">সনদের বিবরণী / বাণী *</label>
                <textarea
                  rows={2}
                  required
                  value={newCertForm.description}
                  onChange={(e) => setNewCertForm({ ...newCertForm, description: e.target.value })}
                  placeholder="সনদপত্রের মূল বিবরণী..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsIssueCertModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2c5f2d] hover:bg-[#224b23] text-white text-xs font-bold shadow flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-[#ffd700]" />
                  <span>সনদপত্র ইস্যু ও সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Print & Preview Modal */}
      {selectedCertForPreview && (
        <CertificateView
          certificate={selectedCertForPreview}
          onClose={() => setSelectedCertForPreview(null)}
        />
      )}

      {/* Online Batch Edit/Create Modal */}
      {isBatchModalOpen && editingBatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-[#2c5f2d]" />
                <span>অনলাইন ব্যাচ তথ্য সম্পাদনা</span>
              </h3>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBatchForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ব্যাচের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={editingBatch.title}
                  onChange={(e) => setEditingBatch({ ...editingBatch, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">শ্রেণী / ক্লাস *</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.classLevel}
                    onChange={(e) => setEditingBatch({ ...editingBatch, classLevel: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">বিষয়সমূহ *</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.subject}
                    onChange={(e) => setEditingBatch({ ...editingBatch, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ক্লাস সময়সূচী *</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.schedule}
                    onChange={(e) => setEditingBatch({ ...editingBatch, schedule: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">মাসিক ফি *</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.monthlyFee}
                    onChange={(e) => setEditingBatch({ ...editingBatch, monthlyFee: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ক্লাস প্ল্যাটফর্ম</label>
                  <input
                    type="text"
                    value={editingBatch.platform}
                    onChange={(e) => setEditingBatch({ ...editingBatch, platform: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">শিক্ষক</label>
                  <input
                    type="text"
                    value={editingBatch.instructor}
                    onChange={(e) => setEditingBatch({ ...editingBatch, instructor: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">লাইভ ক্লাস লিংক (Google Meet / Zoom URL)</label>
                <input
                  type="url"
                  value={editingBatch.meetingLink}
                  onChange={(e) => setEditingBatch({ ...editingBatch, meetingLink: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">পরবর্তী ক্লাসের টপিক (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={editingBatch.nextTopic || ''}
                  onChange={(e) => setEditingBatch({ ...editingBatch, nextTopic: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ব্যাচের সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={2}
                  value={editingBatch.description}
                  onChange={(e) => setEditingBatch({ ...editingBatch, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingBatch.active !== false}
                  onChange={(e) => setEditingBatch({ ...editingBatch, active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#2c5f2d]"
                />
                <span>ব্যাচটি ওয়েবসাইটে সক্রিয় রাখুন</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2c5f2d] text-white text-xs font-bold shadow flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#ffd700]" />
                  <span>ব্যাচ সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Study Note Edit/Create Modal */}
      {isNoteModalOpen && editingNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2c5f2d]" />
                <span>ফ্রী হুক ও পেইড নোটস সম্পাদনা</span>
              </h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNoteForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">নোটসের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">শ্রেণী / ক্লাস *</label>
                  <input
                    type="text"
                    required
                    value={editingNote.classLevel}
                    onChange={(e) => setEditingNote({ ...editingNote, classLevel: e.target.value })}
                    placeholder="৯ম - ১০ম শ্রেণী (SSC)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">বিষয় *</label>
                  <input
                    type="text"
                    required
                    value={editingNote.subject}
                    onChange={(e) => setEditingNote({ ...editingNote, subject: e.target.value })}
                    placeholder="উচ্চতর গণিত"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">অধ্যায়</label>
                  <input
                    type="text"
                    value={editingNote.chapter}
                    onChange={(e) => setEditingNote({ ...editingNote, chapter: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">পেইড মূল্য *</label>
                  <input
                    type="text"
                    required
                    value={editingNote.price}
                    onChange={(e) => setEditingNote({ ...editingNote, price: e.target.value })}
                    placeholder="৳ ১৫০"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">মোট পৃষ্ঠা</label>
                  <input
                    type="text"
                    value={editingNote.totalPages}
                    onChange={(e) => setEditingNote({ ...editingNote, totalPages: e.target.value })}
                    placeholder="৪৮ পৃষ্ঠা PDF"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">প্রণয়নকারী</label>
                  <input
                    type="text"
                    value={editingNote.authorTeacher}
                    onChange={(e) => setEditingNote({ ...editingNote, authorTeacher: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ফ্রী হুক নোট শিরোনাম</label>
                <input
                  type="text"
                  value={editingNote.freeHookTitle}
                  onChange={(e) => setEditingNote({ ...editingNote, freeHookTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ফ্রী হুক নোটস কন্টেন্ট (সবাই ফ্রিতে পড়বে) *</label>
                <textarea
                  rows={5}
                  required
                  value={editingNote.freeHookContent}
                  onChange={(e) => setEditingNote({ ...editingNote, freeHookContent: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">পেইড ভার্সনে যা থাকছে (প্রতিটি পয়েন্ট নতুন লাইনে লিখুন)</label>
                <textarea
                  rows={3}
                  value={notePaidHighlightsText}
                  onChange={(e) => setNotePaidHighlightsText(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingNote.active !== false}
                  onChange={(e) => setEditingNote({ ...editingNote, active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#2c5f2d]"
                />
                <span>নোটসটি ওয়েবসাইটে প্রকাশ করুন</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2c5f2d] text-white text-xs font-bold shadow flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#ffd700]" />
                  <span>নোটস সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
