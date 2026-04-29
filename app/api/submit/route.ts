import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { calculateCategoryScores, calculateOverallScore, maturityFromScore } from "@/lib/scoring";
import type { Answers } from "@/lib/answers";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    }),
  });
  const data = await res.json();
  return data.success === true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  try {
    const body = await req.json();
    const { fullName, organization, role, email, answers, turnstileToken } = body as {
      fullName: string;
      organization: string;
      role?: string;
      email: string;
      answers: Answers;
      turnstileToken: string;
    };

    if (!turnstileToken || !(await verifyTurnstile(turnstileToken, ip))) {
      return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
    }

    if (!fullName?.trim() || !organization?.trim() || !email?.trim() || !answers) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (fullName.trim().length > 100) {
      return NextResponse.json({ error: "Name is too long." }, { status: 400 });
    }
    if (organization.trim().length > 200) {
      return NextResponse.json({ error: "Organization name is too long." }, { status: 400 });
    }
    if (role && role.length > 100) {
      return NextResponse.json({ error: "Role is too long." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (typeof answers !== "object" || Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
    }

    const overallScore = calculateOverallScore(answers);
    const categoryScores = calculateCategoryScores(answers);
    const maturity = maturityFromScore(overallScore);

    const { error: dbError } = await getSupabase().from("submissions").insert({
      full_name: fullName.trim(),
      organization: organization.trim(),
      role: role?.trim() ?? null,
      email: email.toLowerCase().trim(),
      overall_score: overallScore,
      maturity_label: maturity.label,
      category_scores: categoryScores,
      answers,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
