// File: edge/compute-score/index.ts
// Edge function stub: /api/compute-score
// - Validates request
// - Ensures supabase client exists before use
// - Calls a placeholder RPC or performs secure scoring server-side
// Note: Fill SUPABASE_URL and SERVICE_ROLE (or use env) in deployment.

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE") || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.warn("Supabase env not configured for compute-score edge function.");
}

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false }, global: { fetch } })
  : null;

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.answers)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    if (!supabase) {
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), { status: 500 });
    }

    // Example: call a stored procedure that computes score securely in DB
    // Replace "compute_quiz_score" with actual RPC name or implement logic here.
    const { data, error } = await supabase.rpc("compute_quiz_score", {
      answers: body.answers,
      quiz_id: body.quiz_id ?? null
    });

    if (error) {
      console.error("Scoring error:", error);
      return new Response(JSON.stringify({ error: "Scoring failed" }), { status: 502 });
    }

    // Optionally store result in 'results' table (ensure RLS policies)
    // await supabase.from("results").insert({ user_id: body.user_id, quiz_id: body.quiz_id, score: data.score });

    return new Response(JSON.stringify({ ok: true, result: data }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
});
