// File: edge/compute-score/index.ts
// Secure scoring logic is served via /pages/api/compute-score.ts in Next.js
// This file serves as the Deno/Edge compatibility reference for deployment.

export interface QuizAnswerPayload {
  questionId: string;
  selectedOption: number;
}

export interface ScoreRequestBody {
  quiz_id?: string;
  user_id?: string;
  userName?: string;
  category?: string;
  answers: QuizAnswerPayload[];
}

export async function computeSecureScore(body: ScoreRequestBody) {
  if (!body || !Array.isArray(body.answers)) {
    throw new Error("Invalid payload: answers array required");
  }
  // Server-side scoring calculation reference
  return {
    ok: true,
    processedCount: body.answers.length,
  };
}
