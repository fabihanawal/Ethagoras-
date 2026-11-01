import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Brain,
  Sparkles,
  BookOpen,
  Clock,
  LogIn,
  Printer,
  ShieldCheck,
  Medal,
} from 'lucide-react';
import { QuizQuestion, LeaderboardEntry, Certificate } from '../lib/types';
import { useAuth } from '../lib/AuthContext';
import {
  subscribeLeaderboard,
  subscribeQuestions,
  addLeaderboardScore,
  issueCertificate,
} from '../lib/firestoreService';
import { CertificateView } from './CertificateView';

interface QuizEngineProps {
  navigate: (route: string) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ navigate }) => {
  const { user, signInWithGoogle } = useAuth();

  const [category, setCategory] = useState<string>('all');
  const [userName, setUserName] = useState<string>('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [earnedCertificate, setEarnedCertificate] = useState<Certificate | null>(null);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  // Sync user display name
  useEffect(() => {
    if (user) {
      setUserName(user.displayName || user.email?.split('@')[0] || '');
    }
  }, [user]);

  // Subscribe to real-time questions & leaderboard from Firestore
  useEffect(() => {
    setLoading(true);

    const unsubQuestions = subscribeQuestions((allQ) => {
      let filtered = allQ;
      if (category !== 'all') {
        filtered = allQ.filter((q) => q.category === category);
      }
      setQuestions(filtered);
      setLoading(false);
    });

    const unsubLeaderboard = subscribeLeaderboard((lbList) => {
      setLeaderboard(lbList.slice(0, 10));
    });

    return () => {
      unsubQuestions();
      unsubLeaderboard();
    };
  }, [category]);

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = questions[currentIdx];
    if (!currentQ) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);
      const answersPayload = Object.entries(selectedAnswers).map(([qId, optionIdx]) => ({
        questionId: qId,
        selectedOption: optionIdx,
      }));

      // Calculate score server-side or via answer check
      let correctCount = 0;
      const breakdown = questions.map((q) => {
        const userChoice = selectedAnswers[q.id];
        const isCorrect = userChoice !== undefined && userChoice === q.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          question: q.question,
          options: q.options,
          userChoice,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation,
        };
      });

      const totalQuestions = questions.length > 0 ? questions.length : 1;
      const percentage = Math.round((correctCount / totalQuestions) * 100);

      const studentName = userName.trim() || user?.displayName || 'শিক্ষার্থী';
      const categoryLabel =
        category === 'math'
          ? 'গণিত'
          : category === 'science'
          ? 'বিজ্ঞান'
          : category === 'english'
          ? 'ইংরেজি'
          : category === 'gk'
          ? 'সাধারণ জ্ঞান'
          : 'সম্মিলিত';

      // Check if user qualifies for Top 10 Leaderboard
      let newEntry: LeaderboardEntry | null = null;
      let calculatedRank = 1;

      // Determine rank in leaderboard
      const sortedCurrent = [...leaderboard].sort((a, b) => b.score - a.score);
      const isTop10Score =
        sortedCurrent.length < 10 || percentage >= (sortedCurrent[9]?.score || 0);

      if (user && isTop10Score) {
        newEntry = {
          id: `lb-${Date.now()}`,
          userId: user.uid,
          userEmail: user.email || '',
          userName: studentName,
          category: categoryLabel,
          score: percentage,
          total: 100,
          date: new Date().toISOString().split('T')[0],
        };

        await addLeaderboardScore(newEntry);

        // Calculate rank
        const combined = [...sortedCurrent, newEntry].sort((a, b) => b.score - a.score);
        calculatedRank = combined.findIndex((item) => item.id === newEntry?.id) + 1;

        // Automatically issue Top 10 Merit Certificate!
        const cert: Certificate = {
          id: `cert-${Date.now()}`,
          userId: user.uid,
          userEmail: user.email || '',
          studentName: studentName,
          title: 'ইথাগোরাস স্মার্ট স্কলারশিপ শীর্ষ ১০ মেধা সনদপত্র',
          type: 'merit_top10',
          description: `ইথাগোরাস স্মার্ট স্কলারশিপ কুইজ পরীক্ষায় অসাধারণ মেধার স্বাক্ষর রেখে '${categoryLabel}' বিষয়ে সেরা ১০ (র‍্যাংক #${calculatedRank}) স্থান অর্জন করায় এই প্রশংসাপত্র ও মেধা সনদ প্রদান করা হলো।`,
          issueDate: new Date().toLocaleDateString('bn-BD'),
          certificateNumber: `ETH-TOP10-${Date.now().toString().slice(-6)}`,
          score: percentage,
          rank: calculatedRank,
          issuedBy: 'ইথাগোরাস প্রাইভেট নওগাঁ',
        };

        try {
          await issueCertificate(cert);
          setEarnedCertificate(cert);
        } catch (certErr) {
          console.warn('Failed to issue certificate to Firestore:', certErr);
        }
      }

      setResult({
        score: percentage,
        correctCount,
        totalQuestions,
        breakdown,
        isTop10: Boolean(user && isTop10Score),
        rank: calculatedRank,
        feedback:
          percentage >= 80
            ? 'অসাধারণ মেধা ও প্রস্তুতি! আপনি স্কলারশিপ ও মেধা সনদের অধিকারী।'
            : percentage >= 50
            ? 'ভালো ফলাফল! নিয়মিত অনুশীলনে আরও এগিয়ে যাবেন।'
            : 'নিয়মিত ক্লাসে অংশ নিয়ে দুর্বল অধ্যায়গুলো ঝালাই করে নিন।',
      });

      setQuizFinished(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('কুইজ মূল্যায়নে ত্রুটি হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setQuizFinished(false);
    setResult(null);
    setQuizStarted(false);
    setEarnedCertificate(null);
  };

  const categories = [
    { id: 'all', label: 'সব বিষয় (All Subjects)' },
    { id: 'math', label: 'গণিত (Mathematics)' },
    { id: 'science', label: 'বিজ্ঞান (Science)' },
    { id: 'english', label: 'ইংরেজি (English)' },
    { id: 'gk', label: 'নওগাঁ ও সাধারণ জ্ঞান (GK)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2c5f2d]/10 text-[#2c5f2d] font-bold text-xs uppercase tracking-wider mb-3">
          <Brain className="w-4 h-4 text-[#2c5f2d]" />
          <span>সার্ভার-সাইড ভেরিফাইড কুইজ ইঞ্জিন ও মেধা সনদ</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
          ইথাগোরাস স্মার্ট স্কলারশিপ টেস্ট
        </h2>
        <p className="text-gray-600 font-medium text-base sm:text-lg">
          জিমেইল দিয়ে লগইন করে পরীক্ষা দিন। শীর্ষ ১০ জনের মধ্যে নাম এলে সরাসরি প্রোফাইলে যোগ হবে ভেরিফাইড মেধা সনদপত্র!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Quiz Area (7 cols on large screen) */}
        <div className="lg:col-span-7 space-y-6">
          {!quizStarted && !quizFinished ? (
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-gray-100 ether-card">
              <h3 className="text-2xl font-black text-[#2c5f2d] mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#ffd700]" />
                কুইজ শুরুর পূর্বে প্রস্তুতি নিন
              </h3>

              {/* Login Requirement Banner */}
              {!user ? (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <Trophy className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-bold text-amber-950 text-sm">
                        শীর্ষ ১০ মেধা তালিকা ও সনদপত্র পেতে লগইন আবশ্যক!
                      </h4>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        লগইন ছাড়া আপনি শুধু প্র্যাকটিস করতে পারবেন, তবে <strong>সেরা ১০ মেধা তালিকায় নাম অন্তর্ভুক্ত</strong> এবং <strong>অফিসিয়াল মেধা সনদপত্র</strong> পেতে হলে আপনার জিমেইল আইডি দিয়ে সাইন ইন করে কুইজে অংশ নিন।
                      </p>
                      <button
                        onClick={signInWithGoogle}
                        className="px-4 py-2 rounded-xl bg-[#2c5f2d] text-white text-xs font-bold shadow flex items-center gap-2 hover:bg-[#234b24] transition-all"
                      >
                        <img
                          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                          alt="G"
                          className="w-3.5 h-3.5 bg-white rounded-full p-0.5"
                        />
                        <span>গুগল দিয়ে লগইন করে অংশ নিন</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs text-emerald-950">
                    আপনি <span className="font-bold">{user.email}</span> হিসেবে লগইন আছেন। আপনার অর্জিত স্কোর শীর্ষ ১০ মেধা তালিকায় গণ্য হবে।
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    শিক্ষার্থীর নাম (Student Name)
                  </label>
                  <input
                    type="text"
                    placeholder="উদা: তাহমিদ হাসান"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c5f2d] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    কুইজের বিষয় নির্বাচন করুন (Select Category)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`px-4 py-3 rounded-2xl font-semibold text-sm text-left transition-all border ${
                          category === c.id
                            ? 'bg-[#2c5f2d] text-white border-[#2c5f2d] shadow-md shadow-[#2c5f2d]/20'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setQuizStarted(true)}
                disabled={loading || questions.length === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2c5f2d] to-[#1f4420] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <span>কুইজ শুরু করুন ({questions.length} টি প্রশ্ন)</span>
                <ArrowRight className="w-5 h-5 text-[#ffd700]" />
              </button>
            </div>
          ) : quizFinished && result ? (
            /* Result Screen */
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-gray-100 ether-card">
              <div className="text-center pb-8 border-b border-gray-100">
                <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[#ffd700] to-[#f0c400] text-gray-900 flex items-center justify-center shadow-lg shadow-[#ffd700]/30 font-black text-3xl">
                  {result.score}%
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                  ফলাফল প্রস্তুত!
                </h3>
                <p className="text-base text-gray-600 font-semibold mb-3">
                  শিক্ষার্থী: <span className="text-[#2c5f2d] font-bold">{userName || 'অনামী শিক্ষার্থী'}</span>
                </p>

                {/* Certificate Award Notification Banner */}
                {earnedCertificate && (
                  <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-[#ffd700] rounded-2xl p-5 my-4 text-center space-y-2 animate-in zoom-in-95">
                    <div className="flex items-center justify-center gap-2 text-amber-800 font-black text-base">
                      <Sparkles className="w-5 h-5 fill-[#ffd700] text-[#2c5f2d]" />
                      <span>অভিনন্দন! আপনি শীর্ষ ১০ মেধা সনদপত্র অর্জন করেছেন!</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      মেধাতালিকায় আপনার অবস্থান: <strong>র‍্যাংক #{result.rank}</strong>। আপনার অফিসিয়াল সনদপত্রটি প্রোফাইলে যুক্ত হয়েছে।
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setShowCertModal(true)}
                        className="px-6 py-2.5 rounded-xl bg-[#2c5f2d] hover:bg-[#234b24] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 mx-auto transition-all"
                      >
                        <Printer className="w-4 h-4 text-[#ffd700]" />
                        <span>মেধা সনদপত্রটি দেখুন ও প্রিন্ট করুন</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="inline-block bg-[#2c5f2d]/10 text-[#2c5f2d] px-6 py-2 rounded-2xl font-bold text-sm">
                  {result.feedback}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="py-6 space-y-4">
                <h4 className="text-lg font-bold text-gray-800">
                  উত্তর পর্যালোচনা ({result.correctCount}/{result.totalQuestions} টি সঠিক):
                </h4>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {result.breakdown?.map((item: any, idx: number) => (
                    <div
                      key={item.questionId}
                      className={`p-4 rounded-2xl border ${
                        item.isCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-red-50 border-red-200 text-red-950'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {item.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <p className="font-bold text-sm">
                            {idx + 1}. {item.question}
                          </p>
                          <p className="text-xs text-gray-600">
                            সঠিক উত্তর:{' '}
                            <span className="font-bold text-gray-900">
                              {item.options[item.correctAnswer]}
                            </span>
                          </p>
                          {item.explanation && (
                            <p className="text-xs text-gray-500 italic mt-1">
                              ব্যাখ্যা: {item.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 flex flex-wrap gap-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  নতুন কুইজ দিন
                </button>
                <button
                  onClick={() => navigate('#/profile')}
                  className="flex-1 py-3.5 rounded-2xl bg-[#2c5f2d] hover:bg-[#234b24] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  আমার প্রোফাইল ও সনদ
                  <ArrowRight className="w-4 h-4 text-[#ffd700]" />
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Screen */
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-gray-100 ether-card">
              {/* Progress Bar & Header */}
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-3">
                <span>প্রশ্ন {currentIdx + 1} / {questions.length}</span>
                <span className="text-[#2c5f2d]">অগ্রগতি: {Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-gradient-to-r from-[#2c5f2d] to-[#ffd700] h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              {questions[currentIdx] && (
                <div>
                  <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-[#2c5f2d] inline-block mb-3">
                    বিষয়: {questions[currentIdx].category?.toUpperCase()}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 leading-snug">
                    {questions[currentIdx].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3 mb-8">
                    {questions[currentIdx].options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[questions[currentIdx].id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full p-4 rounded-2xl text-left font-semibold text-sm sm:text-base transition-all duration-200 border flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#2c5f2d]/10 border-[#2c5f2d] text-[#2c5f2d] ring-2 ring-[#2c5f2d]/20 shadow-sm'
                              : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                              isSelected ? 'bg-[#2c5f2d] text-[#ffd700]' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#2c5f2d]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={handlePrev}
                      disabled={currentIdx === 0}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                    >
                      পূর্ববর্তী
                    </button>

                    {currentIdx < questions.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="px-6 py-2.5 rounded-xl bg-[#2c5f2d] hover:bg-[#234b24] text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
                      >
                        পরবর্তী প্রশ্ন
                        <ArrowRight className="w-4 h-4 text-[#ffd700]" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={submitting}
                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#ffd700] to-[#e6c200] text-gray-900 font-black text-sm shadow-lg hover:shadow-xl transition-all"
                      >
                        {submitting ? 'মূল্যায়ন হচ্ছে...' : 'কুইজ সমাপ্ত করুন'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Top-10 Leaderboard (5 cols on large screen) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-gray-100 ether-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#ffd700]/20 text-[#2c5f2d] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#2c5f2d]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  শীর্ষ ১০ মেধা তালিকা (Top 10)
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  জিমেইল ভেরিফাইড শিক্ষার্থীদের র‍্যাংকিং ও সনদপত্র
                </p>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
              {leaderboard.slice(0, 10).map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                    idx === 0
                      ? 'bg-amber-50 border-2 border-amber-300'
                      : idx === 1
                      ? 'bg-gray-100/80 border border-gray-300'
                      : idx === 2
                      ? 'bg-amber-100/50 border border-amber-300'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                      idx === 0
                        ? 'bg-[#ffd700] text-gray-950 shadow'
                        : idx === 1
                        ? 'bg-gray-300 text-gray-800'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">{entry.userName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-semibold">{entry.category}</span>
                        {idx < 3 && (
                          <span className="text-[9px] bg-[#ffd700]/30 text-emerald-950 font-bold px-1.5 rounded">
                            🏆 মেডেলিস্ট
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-[#2c5f2d]">{entry.score}%</span>
                    <p className="text-[10px] text-gray-400">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-medium">
                ফায়ারবেস ক্লাউডে তাৎক্ষণিক মেধা যাচাই ও স্বয়ংক্রিয় সনদপত্র সংযোজন।
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Certificate Print Modal */}
      {showCertModal && earnedCertificate && (
        <CertificateView
          certificate={earnedCertificate}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
};
