import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Brain, Sparkles, BookOpen, Clock } from 'lucide-react';
import { QuizQuestion, LeaderboardEntry } from '../lib/types';

interface QuizEngineProps {
  navigate: (route: string) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ navigate }) => {
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

  // Fetch questions & leaderboard
  useEffect(() => {
    fetchInitialData();
  }, [category]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch questions without answers
      const qRes = await fetch(`/api/compute-score?action=questions&category=${category}`);
      const qData = await qRes.json();
      if (qData.ok) {
        setQuestions(qData.questions);
      }

      // Fetch top 5 leaderboard
      const lbRes = await fetch('/api/compute-score');
      const lbData = await lbRes.json();
      if (lbData.ok) {
        setLeaderboard(lbData.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load quiz data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = questions[currentIdx];
    if (!currentQ) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);
      const answersPayload = Object.entries(selectedAnswers).map(([qId, optionIdx]) => ({
        questionId: qId,
        selectedOption: optionIdx,
      }));

      const res = await fetch('/api/compute-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answersPayload,
          category: category === 'all' ? 'সম্মিলিত' : category,
          userName: userName || 'অনামী শিক্ষার্থী',
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setResult(data.result);
        setLeaderboard(data.result.leaderboard);
        setQuizFinished(true);
      } else {
        alert('কুইজ স্কোর গণনায় সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      }
    } catch (err) {
      console.error('Error submitting quiz score:', err);
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
          <span>সার্ভার-সাইড ভেরিফাইড কুইজ ইঞ্জিন</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
          ইথাগোরাস স্মার্ট স্কলারশিপ টেস্ট
        </h2>
        <p className="text-gray-600 font-medium text-base sm:text-lg">
          সুরক্ষিত এজ ফাংশনে স্বয়ংক্রিয় মূল্যায়ন। সঠিক উত্তর প্রদান করে নওগাঁ শাখার সেরা ৫ লিডারবোর্ডে নিজের স্থান করে নিন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Quiz Area (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          {!quizStarted && !quizFinished ? (
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-gray-100 ether-card">
              <h3 className="text-2xl font-black text-[#2c5f2d] mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#ffd700]" />
                কুইজ শুরুর পূর্বে প্রস্তুতি নিন
              </h3>
              <p className="text-gray-600 font-medium mb-6 leading-relaxed">
                আপনার নাম ও পছন্দসই বিভাগ নির্বাচন করুন। কুইজ শেষ করার সাথে সাথে এজ ফাংশনের মাধ্যমে নির্ভুলভাবে আপনার স্কোর যাচাই করা হবে।
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    শিক্ষার্থীর পুরো নাম (Student Name)
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

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-amber-900 text-sm font-medium">
                🛡️ <strong>নিরাপত্তা সতর্কতা:</strong> কোনো প্রশ্নের উত্তর ক্লায়েন্ট ডিভাইসে সংরক্ষিত থাকে না। আপনার প্রেরিত উত্তরগুলো এজ এন্ডপয়েন্টে সুরক্ষিতভাবে যাচাই করা হয়।
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
                <p className="text-base text-gray-600 font-semibold mb-4">
                  শিক্ষার্থী: <span className="text-[#2c5f2d] font-bold">{userName || 'অনামী শিক্ষার্থী'}</span>
                </p>
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
                  {result.breakdown?.map((item: any, idx: number) => {
                    const qObj = questions.find(q => q.id === item.questionId);
                    if (!qObj) return null;
                    return (
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
                              {idx + 1}. {qObj.question}
                            </p>
                            <p className="text-xs text-gray-600">
                              সঠিক উত্তর: <span className="font-semibold text-gray-900">{qObj.options[item.correctAnswer]}</span>
                            </p>
                            {item.explanation && (
                              <p className="text-xs text-gray-500 italic mt-1">
                                ব্যাখ্যা: {item.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                  onClick={() => navigate('#/admission')}
                  className="flex-1 py-3.5 rounded-2xl bg-[#2c5f2d] hover:bg-[#234b24] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  ভর্তি আবেদন করুন
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
                    বিষয়: {questions[currentIdx].category.toUpperCase()}
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

        {/* Sidebar: Top-5 Leaderboard */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-gray-100 ether-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#ffd700]/20 text-[#2c5f2d] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#2c5f2d]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  শীর্ষ ৫ লিডারবোর্ড
                </h3>
                <p className="text-xs text-gray-500 font-medium">নওগাঁ জেলা মেধাতালিকা</p>
              </div>
            </div>

            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                    idx === 0
                      ? 'bg-amber-50/80 border border-amber-200'
                      : idx === 1
                      ? 'bg-gray-50 border border-gray-200'
                      : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                      idx === 0
                        ? 'bg-[#ffd700] text-gray-900'
                        : idx === 1
                        ? 'bg-gray-300 text-gray-800'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{entry.userName}</p>
                      <p className="text-xs text-gray-500 font-medium">{entry.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#2c5f2d]">{entry.score}%</span>
                    <p className="text-[10px] text-gray-400">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-medium">
                এজ ফাংশনের মাধ্যমে লাইভ স্কোরবোর্ড স্বয়ংক্রিয়ভাবে আপডেট হয়।
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
