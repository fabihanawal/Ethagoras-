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

export interface Course {
  id: string;
  title: string;
  level: string;
  duration: string;
  subjects: string[];
  features: string[];
  price: string;
  popular?: boolean;
  displayOrder?: number;
}

export interface QuizQuestion {
  id: string;
  category: 'math' | 'science' | 'english' | 'gk' | string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  displayOrder?: number;
}

export interface QuizQuestionWithAnswer extends QuizQuestion {
  correctAnswer: number;
  explanation?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  photoUrl?: string;
  phone: string;
  schoolName: string;
  grade: string;
  rollNo: string;
  subjectGroup: string;
  address: string;
  enrolledCourses?: string[];
  completedCourses?: string[];
  updatedAt?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userEmail: string;
  studentName: string;
  title: string;
  type: 'merit_top10' | 'course_completion';
  description: string;
  issueDate: string;
  rollNo?: string;
  certificateNumber: string;
  score?: number;
  rank?: number;
  courseName?: string;
  issuedBy: string;
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

export interface LeaderboardEntry {
  id: string;
  userId?: string;
  userEmail?: string;
  userName: string;
  category: string;
  score: number;
  total: number;
  date: string;
  rank?: number;
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
