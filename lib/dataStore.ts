import {
  Slide,
  QuizQuestionWithAnswer,
  LeaderboardEntry,
  BookingSubmission,
  ContactSettings,
  SocialSettings,
  DirectorProfile,
  TeacherProfile,
} from './types';

export const INITIAL_CONTACT_SETTINGS: ContactSettings = {
  phone: '০১৭০০-০০০০০০, ০১৮০০-০০০০০০',
  whatsapp: '+8801700000000',
  email: 'info@ethagoras-naogaon.edu.bd',
  address: 'চকদেবপাড়া, বালুডাঙ্গা বাস স্ট্যান্ড সংলগ্ন, নওগাঁ সদর, নওগাঁ।',
  updatedAt: new Date().toISOString(),
};

export const INITIAL_SOCIAL_SETTINGS: SocialSettings = {
  facebookUrl: 'https://facebook.com/ethagoras.naogaon',
  instagramUrl: 'https://instagram.com/ethagoras.naogaon',
  youtubeUrl: 'https://youtube.com/@ethagoras-naogaon',
  updatedAt: new Date().toISOString(),
};

export const INITIAL_DIRECTOR_PROFILE: DirectorProfile = {
  id: 'dir-1',
  name: 'প্রকৌশলী মো: রফিকুল ইসলাম',
  designation: 'প্রতিষ্ঠাতা ও ব্যবস্থাপনা পরিচালক',
  qualifications: 'বিএসসি ইন সিভিল ইঞ্জিনিয়ারিং (বুয়েট), এমবিএ (ঢাকা বিশ্ববিদ্যালয়)',
  message:
    'ইথাগোরাস প্রাইভেট শুধু একটি সাধারণ কোচিং সেন্টার নয়; এটি নওগাঁর ভবিষ্যৎ প্রজন্মের স্বপ্ন গড়ার একটি আধুনিক ডিজিটাল অঙ্গন। আমরা প্রতিটি শিক্ষার্থীর ভেতরকার সুপ্ত প্রতিভাকে জাগ্রত করে বিজ্ঞান ও যুক্তির শক্তিতে বলীয়ান করে তুলি। নৈতিক মূল্যবোধ ও কঠোর শৃঙ্খলার মাধ্যমে আমরা তাদের আগামী প্রতিযোগিতামূলক বিশ্বের জন্য প্রস্তুত করছি।',
  photoUrl:
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
  phone: '০১৭০০-১২২৩৩৪',
  email: 'director@ethagoras-naogaon.edu.bd',
  updatedAt: new Date().toISOString(),
};

export const INITIAL_TEACHERS: TeacherProfile[] = [
  {
    id: 't-1',
    name: 'অধ্যাপক ড. আহমেদ উল্লাহ',
    subject: 'উচ্চতর গণিত ও অলিম্পিয়াড উইং',
    qualifications: 'এমএসসি (গণিত, ঢাবি), পিএইচডি',
    experience: '১৫ বছরের পাঠদান অভিজ্ঞতা',
    bio: 'জাতীয় গণিত অলিম্পিয়াড মেন্টর এবং বোর্ড পরীক্ষার পরীক্ষক। জ্যামিতি ও ত্রিকোণমিতির জটিল সমীকরণকে আনন্দদায়ক উপস্থাপনায় পারদর্শী।',
    photoUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    phone: '০১৭০১২৩৪৫৬৭',
    displayOrder: 1,
  },
  {
    id: 't-2',
    name: 'মো: নাজমুল হুদা',
    subject: 'পদার্থবিজ্ঞান (Physics)',
    qualifications: 'বিএসসি ও এমএসসি (পদার্থবিজ্ঞান, রাজশাহী বিশ্ববিদ্যালয়)',
    experience: '১০ বছরের শিক্ষকতা অভিজ্ঞতা',
    bio: 'থিওরিটিক্যাল ও প্র্যাকটিক্যাল ফিজিক্স সিমুলেশনের মাধ্যমে শিক্ষার্থীদের প্রতিটি সূত্র বাস্তব প্রয়োগের মাধ্যমে শেখান।',
    photoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    phone: '০১৭০৯৮৭৬৫৪৩',
    displayOrder: 2,
  },
  {
    id: 't-3',
    name: 'ফারহানা ইয়াসমিন',
    subject: 'রসায়ন ও জীববিজ্ঞান',
    qualifications: 'এমএসসি (রসায়ন বিভাগ, চট্টগ্রাম বিশ্ববিদ্যালয়)',
    experience: '৮ বছরের বিশেষায়িত অভিজ্ঞতা',
    bio: 'মেডিকেল ও ডেন্টাল ভর্তি পরীক্ষায় অংশ নিতে আগ্রহী শিক্ষার্থীদের রসায়ন ও বায়োলজির গভীরে গিয়ে দক্ষ করে তোলেন।',
    photoUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    phone: '০১৮১১২৩৪৫৬৭',
    displayOrder: 3,
  },
  {
    id: 't-4',
    name: 'তানভীর আহমেদ চৌধুরী',
    subject: 'ইংরেজি গ্রামার ও কমিউনিকেশন',
    qualifications: 'বিএ (অনার্স) ও এমএ (ইংরেজি, জাহাঙ্গীরনগর বিশ্ববিদ্যালয়)',
    experience: '৭ বছরের শিক্ষকতা ও কর্পোরেট ট্রেইনিং',
    bio: 'ইংলিশ ল্যাঙ্গুয়েজ ক্লাবের প্রতিষ্ঠাতা মেন্টর। শিক্ষার্থীদের জড়তা কাটিয়ে ইংরেজি বলা ও নির্ভুল লেখার কৌশল শেখান।',
    photoUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    phone: '০১৯১১২২৩৩৪৪',
    displayOrder: 4,
  },
];

export const INITIAL_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    title: 'ইথাগোরাস প্রাইভেট — আগামীর স্বপ্ন গড়ার সেরা ঠিকানা',
    subtitle: 'নওগাঁর শীর্ষস্থানীয় ডিজিটাল কোচিং সেন্টার। দক্ষ শিক্ষক ও আধুনিক শিক্ষা পদ্ধতির নিখুঁত মেলবন্ধন।',
    badge: 'ভর্তি চলছে ২০২৫ শিক্ষাবর্ষ',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'অনলাইন ভর্তি ফরম পূরণ করুন',
    ctaLink: '#/admission',
    displayOrder: 1,
    active: true,
  },
  {
    id: 'slide-2',
    title: 'জ্ঞান ও মেধা যাচাই করুন আমাদের স্মার্ট কুইজ ইঞ্জিনে',
    subtitle: 'গণিত, বিজ্ঞান, ইংরেজি এবং সাধারণ জ্ঞানে আপনার প্রস্তুতি যাচাই করে জিতে নিন স্কলারশিপ।',
    badge: 'সাপ্তাহিক কুইজ কম্পিটিশন',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'কুইজে অংশগ্রহণ করুন',
    ctaLink: '#/quiz',
    displayOrder: 2,
    active: true,
  },
  {
    id: 'slide-3',
    title: 'অভিজ্ঞ মেন্টরশিপ ও নিয়মিত মডেল টেস্ট',
    subtitle: 'এসএসসি, এইচএসসি ও অলিম্পিয়াড প্রস্তুতির জন্য নওগাঁর নির্ভরযোগ্য প্রতিষ্ঠান।',
    badge: 'ডিজিটাল লার্নিং ল্যাব',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'কোর্সসমূহ দেখুন',
    ctaLink: '#/courses',
    displayOrder: 3,
    active: true,
  },
];

export const SECURE_QUIZ_DATABASE: QuizQuestionWithAnswer[] = [
  {
    id: 'm1',
    category: 'math',
    question: 'পীথাগোরাসের উপপাদ্য অনুযায়ী, সমকোণী ত্রিভুজের ক্ষেত্রে কোন সম্পর্কটি সঠিক?',
    options: ['অতিভুজ² = লম্ব² + ভূমি²', 'অতিভুজ = লম্ব + ভূমি', 'লম্ব² = অতিভুজ² + ভূমি²', 'ভূমি² = লম্ব² + অতিভুজ²'],
    correctAnswer: 0,
    explanation: 'সমকোণী ত্রিভুজের অতিভুজের উপর অঙ্কিত বর্গক্ষেত্র অপর দুই বাহুর উপর অঙ্কিত বর্গক্ষেত্রদ্বয়ের সমষ্টির সমান।',
  },
  {
    id: 'm2',
    category: 'math',
    question: 'একটি সমবাহু ত্রিভুজের প্রতিটি কোণের মান কত ডিগ্রী?',
    options: ['৪৫°', '৬০°', '৯০°', '১০০°'],
    correctAnswer: 1,
    explanation: 'ত্রিভুজের তিন কোণের সমষ্টি ১৮০°। সমবাহু ত্রিভুজের তিন কোণ সমান হওয়ায় প্রতিটি কোণ ১৮০/৩ = ৬০°।',
  },
  {
    id: 'm3',
    category: 'math',
    question: 'log₁₀(1000) এর মান কত?',
    options: ['১', '২', '৩', '১০'],
    correctAnswer: 2,
    explanation: '১০³ = ১০০০, অতএব log₁₀(1000) = ৩।',
  },
  {
    id: 's1',
    category: 'science',
    question: 'পদার্থের চতুর্থ অবস্থাকে কী বলা হয়?',
    options: ['কঠিন', 'তরল', 'প্লাজমা', 'গ্যাসীয়'],
    correctAnswer: 2,
    explanation: 'উচ্চ তাপমাত্রায় আয়নিত গ্যাসীয় অবস্থাকে প্লাজমা অবস্থা বলা হয়।',
  },
  {
    id: 's2',
    category: 'science',
    question: 'মানবদেহের বৃহত্তম অঙ্গ কোনটি?',
    options: ['যকৃৎ (Liver)', 'ত্বক (Skin)', 'হৃৎপিণ্ড (Heart)', 'ফুসফুস (Lungs)'],
    correctAnswer: 1,
    explanation: 'মানবদেহের সামগ্রিক বাহ্যিক বৃহত্তম অঙ্গ হলো ত্বক।',
  },
  {
    id: 'e1',
    category: 'english',
    question: 'Which of the following is the synonym of "Diligent"?',
    options: ['Lazy', 'Industrious', 'Careless', 'Slow'],
    correctAnswer: 1,
    explanation: '"Diligent" means hardworking or industrious.',
  },
  {
    id: 'e2',
    category: 'english',
    question: 'Identify the correct passive form: "She sings a melodious song."',
    options: [
      'A melodious song is sung by her.',
      'A melodious song was sung by her.',
      'She is singing a song.',
      'A song had sung by her.',
    ],
    correctAnswer: 0,
    explanation: 'Present simple passive voice structure: Object + is/am/are + past participle (V3) + by + Subject.',
  },
  {
    id: 'gk1',
    category: 'gk',
    question: 'নওগাঁ জেলার বিখ্যাত পাহাড়পুর বৌদ্ধ বিহারের অপর নাম কী?',
    options: ['শালবন বিহার', 'সোমপুর মহাবিহার', 'ময়নামতি বিহার', 'আনন্দ বিহার'],
    correctAnswer: 1,
    explanation: 'পাল রাজা ধর্মপাল অষ্টম শতকের শেষের দিকে নওগাঁর বদলগাছীতে সোমপুর মহাবিহার প্রতিষ্ঠা করেন।',
  },
  {
    id: 'gk2',
    category: 'gk',
    question: 'নওগাঁ জেলা কোন বিভাগে অবস্থিত?',
    options: ['রংপুর', 'রাজশাহী', 'ঢাকা', 'খুলনা'],
    correctAnswer: 1,
    explanation: 'নওগাঁ জেলা রাজশাহী বিভাগের বরেন্দ্র অঞ্চলের একটি ঐতিহ্যবাহী জেলা।',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', userName: 'তানভীর আহমেদ (Tanvir)', category: 'বিজ্ঞান', score: 95, total: 100, date: '২০২৫-০১-১০' },
  { id: 'lb-2', userName: 'সাদিয়া জাহান (Sadia)', category: 'গণিত', score: 92, total: 100, date: '২০২৫-০১-১২' },
  { id: 'lb-3', userName: 'রাকিবুল হাসান (Rakib)', category: 'ইংরেজি', score: 88, total: 100, date: '২০২৫-০১-১৫' },
  { id: 'lb-4', userName: 'আফরিন সুলতানা (Afrin)', category: 'সাধারণ জ্ঞান', score: 85, total: 100, date: '২০২৫-০১-১৬' },
  { id: 'lb-5', userName: 'মাহমুদ উল্লাহ (Mahmud)', category: 'গণিত', score: 82, total: 100, date: '২০২৫-০১-১৮' },
];

export const INITIAL_BOOKINGS: BookingSubmission[] = [
  {
    id: 'book-1',
    studentName: 'আসিফ রায়হান',
    guardianName: 'মো: রফিকুল ইসলাম',
    phone: '01712345678',
    email: 'asif.naogaon@gmail.com',
    schoolName: 'নওগাঁ জেলা স্কুল',
    grade: 'দশম শ্রেণী (SSC 2026)',
    courseSelected: 'বিজ্ঞান বিশেষ ব্যাচ (Special Science Batch)',
    shiftPreference: 'Morning',
    address: 'চকদেবপাড়া, নওগাঁ সদর',
    notes: 'গণিত ও পদার্থবিজ্ঞানে বিশেষ জোর দেওয়া প্রয়োজন।',
    submittedAt: '২০২৫-০১-২০ ১০:৩০ AM',
    status: 'Approved',
  },
  {
    id: 'book-2',
    studentName: 'নুসরাত জাহান মীম',
    guardianName: 'নাজমুন নাহার',
    phone: '01898765432',
    email: 'nusrat.mim@gmail.com',
    schoolName: 'নওগাঁ সরকারি বালিকা উচ্চ বিদ্যালয়',
    grade: 'নবম শ্রেণী',
    courseSelected: 'অল-ইন-ওয়ান ফাউন্ডেশন কোর্স',
    shiftPreference: 'Evening',
    address: 'ডিগ্রির মোড়, নওগাঁ',
    notes: 'সন্ধ্যার ব্যাচ অগ্রাধিকার।',
    submittedAt: '২০২৫-০১-২১ ০৪:১৫ PM',
    status: 'Pending',
  },
];
