import type { NextApiRequest, NextApiResponse } from 'next';
import { SECURE_QUIZ_DATABASE, INITIAL_LEADERBOARD } from '../../lib/dataStore';

// In-memory leaderboard state for runtime session fallback
let currentLeaderboard = [...INITIAL_LEADERBOARD];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { action, category } = req.query;

    if (action === 'questions') {
      // NEVER return correctAnswer to client
      let questions = SECURE_QUIZ_DATABASE.map(({ id, category, question, options }) => ({
        id,
        category,
        question,
        options,
      }));

      if (category && typeof category === 'string' && category !== 'all') {
        questions = questions.filter(q => q.category === category);
      }

      return res.status(200).json({ ok: true, questions });
    }

    // Default GET: return top-5 leaderboard
    const top5 = [...currentLeaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return res.status(200).json({ ok: true, leaderboard: top5 });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { answers, category, userName } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ ok: false, error: 'Invalid answers payload format' });
    }

    let correctCount = 0;
    const breakdown: Array<{ questionId: string; isCorrect: boolean; correctAnswer: number; explanation?: string }> = [];

    for (const item of answers) {
      const q = SECURE_QUIZ_DATABASE.find(x => x.id === item.questionId);
      if (q) {
        const isCorrect = q.correctAnswer === item.selectedOption;
        if (isCorrect) correctCount++;
        breakdown.push({
          questionId: q.id,
          isCorrect,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        });
      }
    }

    const totalQuestions = answers.length > 0 ? answers.length : 1;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    const displayName = (userName && typeof userName === 'string' && userName.trim())
      ? userName.trim()
      : 'শিক্ষার্থী (Anonymous Student)';

    const newEntry = {
      id: `lb-${Date.now()}`,
      userName: displayName,
      category: category || 'সাধারণ',
      score: percentage,
      total: 100,
      date: new Date().toISOString().split('T')[0],
    };

    currentLeaderboard.push(newEntry);
    const top5 = [...currentLeaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return res.status(200).json({
      ok: true,
      result: {
        score: percentage,
        correctCount,
        totalQuestions,
        breakdown,
        feedback: percentage >= 80 ? 'অসাধারণ ফলাফল! স্কলারশিপের জন্য যোগ্য।' : percentage >= 50 ? 'ভালো প্রস্তুতি! আরও অনুশীলনে শীর্ষস্থান সম্ভব।' : 'নিয়মিত ক্লাসে অংশ নিয়ে দুর্বল বিষয়গুলো ঝালাই করে নিন।',
        leaderboard: top5,
      },
    });
  } catch (error: any) {
    console.error('Scoring error in /api/compute-score:', error);
    return res.status(500).json({ ok: false, error: 'Internal scoring error' });
  }
}
