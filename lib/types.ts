export interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  updatedAt?: string;
}

export interface SocialSettings {
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  updatedAt?: string;
}

export interface DirectorProfile {
  id: string;
  name: string;
  designation: string;
  qualifications: string;
  message: string;
  photoUrl: string;
  phone?: string;
  email?: string;
  updatedAt?: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  subject: string;
  qualifications: string;
  experience: string;
  bio?: string;
  photoUrl: string;
  phone?: string;
  displayOrder?: number;
}

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  displayOrder: number;
  active: boolean;
}

export interface QuizQuestion {
  id: string;
  category: 'math' | 'science' | 'english' | 'gk';
  question: string;
  options: string[];
}

export interface QuizQuestionWithAnswer extends QuizQuestion {
  correctAnswer: number;
  explanation?: string;
}

export interface LeaderboardEntry {
  id: string;
  userName: string;
  category: string;
  score: number;
  total: number;
  date: string;
}

export interface BookingSubmission {
  id: string;
  studentName: string;
  guardianName: string;
  phone: string;
  email: string;
  schoolName: string;
  grade: string;
  courseSelected: string;
  shiftPreference: 'Morning' | 'Day' | 'Evening';
  address: string;
  notes?: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Contacted';
}
