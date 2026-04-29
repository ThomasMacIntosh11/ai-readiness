import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { calculateCategoryScores, calculateOverallScore, maturityFromScore } from "@/lib/scoring";
import type { Answers } from "@/lib/answers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, organization, role, email, answers } = body as {
      fullName: string;
      organization: string;
      role?: string;
      email: string;
      answers: Answers;
    };

    if (!fullName || !organization || !email || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const overallScore = calculateOverallScore(answers);
    const categoryScores = calculateCategoryScores(answers);
    const maturity = maturityFromScore(overallScore);

    const { error: dbError } = await getSupabase().from("submissions").insert({
      full_name: fullName,
      organization,
      role: role ?? null,
      email,
      overall_score: overallScore,
      maturity_label: maturity.label,
      category_scores: categoryScores,
      answers,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
