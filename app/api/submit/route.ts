import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { calculateCategoryScores, calculateOverallScore, maturityFromScore } from "@/lib/scoring";
import type { Answers } from "@/lib/answers";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_EMAIL = "thomas.macintosh@adaptovate.com";

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

    const { error: dbError } = await supabase.from("submissions").insert({
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

    const categoryRows = categoryScores
      .map((c) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${c.enablerName}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">${c.score}%</td></tr>`)
      .join("");

    await resend.emails.send({
      from: "AI Readiness Tool <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      subject: `New AI Readiness Submission — ${organization} (${maturity.label})`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">
          <h2 style="margin-bottom:4px;">New Assessment Submission</h2>
          <p style="color:#6b7280;margin-top:0;">Submitted via the AI Readiness Tool</p>

          <table style="width:100%;border-collapse:collapse;margin-top:24px;">
            <tr><td style="padding:8px 12px;background:#f9fafb;font-weight:600;width:40%;">Name</td><td style="padding:8px 12px;background:#f9fafb;">${fullName}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;">Organization</td><td style="padding:8px 12px;">${organization}</td></tr>
            <tr><td style="padding:8px 12px;background:#f9fafb;font-weight:600;">Role</td><td style="padding:8px 12px;background:#f9fafb;">${role ?? "—"}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;">Email</td><td style="padding:8px 12px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 12px;background:#f9fafb;font-weight:600;">Overall Score</td><td style="padding:8px 12px;background:#f9fafb;">${overallScore}%</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;">Maturity Stage</td><td style="padding:8px 12px;">${maturity.label} (${maturity.range})</td></tr>
          </table>

          <h3 style="margin-top:32px;margin-bottom:8px;">Domain Scores</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:8px 12px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Domain</th>
                <th style="padding:8px 12px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Score</th>
              </tr>
            </thead>
            <tbody>${categoryRows}</tbody>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
