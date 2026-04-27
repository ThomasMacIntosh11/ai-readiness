import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import type { ScoreRow, Maturity } from "./scoring";

const C = {
  headerBg: "#177ea8",
  accent: "#1d9acc",
  accentLight: "#dbeeff",
  ink: "#1e1e1e",
  muted: "#6b7280",
  mutedLight: "#9ca3af",
  bg: "#eef1f4",
  white: "#ffffff",
  border: "#d7dde5",
  headerSubtext: "#b3dff0",
  greenText: "#1f7a4d",
  greenBg: "#dff4e8",
  amberText: "#946200",
  amberBg: "#fff3cd",
  redText: "#bf2950",
  redBg: "#fde2e8",
} as const;

const STAGES = ["Explorer", "Pilot", "Builder", "Integrator", "Transformer"] as const;

const ENABLER_SHORT: Record<string, string> = {
  strategy: "Strategy and ambition",
  data: "Data and analytics foundation",
  technology: "Technology and AI infrastructure",
  talent: "Talent and digital literacy",
  operating_model: "Operating model and agility",
  governance: "Governance and responsible AI",
  culture: "Culture and change management",
};

type FocusItem = { title: string; subtitle: string };

export type ReportData = {
  participantName: string;
  organization: string;
  role: string;
  overallScore: number;
  maturity: Maturity;
  categoryScores: ScoreRow[];
  stageDescription: string;
  stageHeadline: string;
  recommendations: { subtitle: string; items: FocusItem[] };
  domainAverages: Record<string, number>;
  logoData?: string | null;
};

function scoreStatus(score: number) {
  if (score < 50) return { label: "Growth opportunity", text: C.redText, bg: C.redBg };
  if (score <= 80) return { label: "Developing", text: C.amberText, bg: C.amberBg };
  return { label: "Strong", text: C.greenText, bg: C.greenBg };
}

async function loadLogoData(): Promise<string | null> {
  try {
    const resp = await fetch("/adaptovate-logo.png");
    const blob = await resp.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ── Shared layout pieces ───────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ backgroundColor: C.headerBg, paddingHorizontal: 36, paddingVertical: 18 }}>
      <Text style={{ fontSize: 13, color: C.white, fontFamily: "Helvetica-Bold" }}>{title}</Text>
    </View>
  );
}

function PageFooter({ pageNum }: { pageNum: number }) {
  return (
    <View style={{ position: "absolute", bottom: 24, left: 36, right: 36 }}>
      <View style={{ borderTopWidth: 0.5, borderTopColor: C.border, paddingTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 8, color: C.muted }}>AI Readiness Assessment  ·  Confidential</Text>
        <Text style={{ fontSize: 8, color: C.muted }}>{pageNum}</Text>
      </View>
    </View>
  );
}

function StagePills({ current, stageIdx }: { current: string; stageIdx: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {STAGES.map((stage, i) => {
        const isActive = stage === current;
        const isPast = stageIdx > i;
        return (
          <View
            key={stage}
            style={{
              flex: 1,
              backgroundColor: isActive ? C.accent : isPast ? "#b3dff0" : C.bg,
              borderRadius: 6,
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <Text style={{
              fontSize: 7.5,
              color: isActive ? C.white : isPast ? C.headerBg : C.muted,
              fontFamily: isActive ? "Helvetica-Bold" : "Helvetica",
            }}>
              {stage}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ── Document ──────────────────────────────────────────────────────────────────

function ReportDocument({ data }: { data: ReportData }) {
  const stageIdx = STAGES.indexOf(data.maturity.label as (typeof STAGES)[number]);
  const today = new Date().toLocaleDateString("en-AU", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <Document>

      {/* ── PAGE 1: COVER ────────────────────────────────────────────────────── */}
      <Page size="A4" style={{ fontFamily: "Helvetica", backgroundColor: C.white }}>

        <View style={{
          backgroundColor: C.headerBg,
          paddingHorizontal: 36,
          paddingTop: 32,
          paddingBottom: 26,
          height: 110,
          justifyContent: "space-between",
        }}>
          {data.logoData ? (
            <Image src={data.logoData} style={{ height: 28, width: 114, objectFit: "contain" }} />
          ) : (
            <Text style={{ fontSize: 16, color: C.white, fontFamily: "Helvetica-Bold" }}>Adaptovate</Text>
          )}
          <Text style={{ fontSize: 9, color: C.headerSubtext, letterSpacing: 1 }}>AI Readiness Assessment</Text>
        </View>

        <View style={{ paddingHorizontal: 36, paddingTop: 38, flex: 1 }}>
          <Text style={{ fontSize: 38, color: C.ink, fontFamily: "Helvetica-Bold", lineHeight: 1.1 }}>
            {data.participantName || "Participant"}
          </Text>

          {data.organization ? (
            <Text style={{ fontSize: 13, color: C.muted, marginTop: 10 }}>{data.organization}</Text>
          ) : null}
          {data.role ? (
            <Text style={{ fontSize: 11, color: C.mutedLight, marginTop: 4 }}>{data.role}</Text>
          ) : null}

          {/* Stat cards */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 32 }}>
            <View style={{ flex: 1, backgroundColor: C.accentLight, borderRadius: 12, padding: 20 }}>
              <Text style={{ fontSize: 7.5, color: C.muted, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 10 }}>
                CUMULATIVE SCORE
              </Text>
              <Text style={{ fontSize: 46, color: C.ink, fontFamily: "Helvetica-Bold", lineHeight: 1 }}>
                {data.overallScore}%
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: C.accentLight, borderRadius: 12, padding: 20 }}>
              <Text style={{ fontSize: 7.5, color: C.muted, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 10 }}>
                MATURITY STAGE
              </Text>
              <Text style={{ fontSize: 30, color: C.headerBg, fontFamily: "Helvetica-Bold", lineHeight: 1 }}>
                {data.maturity.label}
              </Text>
              <View style={{
                alignSelf: "flex-start",
                backgroundColor: "#1d9acc22",
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 4,
                marginTop: 10,
              }}>
                <Text style={{ fontSize: 9, color: C.accent, fontFamily: "Helvetica-Bold" }}>
                  Range: {data.maturity.range}
                </Text>
              </View>
            </View>
          </View>

          {/* Stage journey */}
          <View style={{ marginTop: 28 }}>
            <Text style={{ fontSize: 9, color: C.muted, marginBottom: 8 }}>
              Your position on the AI maturity journey
            </Text>
            <StagePills current={data.maturity.label} stageIdx={stageIdx} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 36, paddingBottom: 28, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 8.5, color: C.muted }}>Generated {today}</Text>
          <Text style={{ fontSize: 8.5, color: C.muted }}>Confidential</Text>
        </View>

      </Page>

      {/* ── PAGE 2: MATURITY PROFILE ─────────────────────────────────────────── */}
      <Page size="A4" style={{ fontFamily: "Helvetica", backgroundColor: C.white }}>
        <SectionHeader title="Your AI Maturity Profile" />

        <View style={{ paddingHorizontal: 36, paddingTop: 26 }}>

          <Text style={{ fontSize: 15, color: C.ink, fontFamily: "Helvetica-Bold", lineHeight: 1.45, marginBottom: 16 }}>
            {data.stageHeadline}
          </Text>

          <View style={{ backgroundColor: C.bg, borderRadius: 10, padding: 18, marginBottom: 20 }}>
            <Text style={{ fontSize: 10, color: C.ink, lineHeight: 1.8 }}>
              {data.stageDescription}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 26 }}>
            <View style={{ flex: 1, backgroundColor: C.accentLight, borderRadius: 10, padding: 16 }}>
              <Text style={{ fontSize: 7.5, color: C.muted, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 8 }}>
                CUMULATIVE SCORE
              </Text>
              <Text style={{ fontSize: 32, color: C.ink, fontFamily: "Helvetica-Bold" }}>
                {data.overallScore}%
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: C.accentLight, borderRadius: 10, padding: 16 }}>
              <Text style={{ fontSize: 7.5, color: C.muted, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 8 }}>
                MATURITY STAGE
              </Text>
              <Text style={{ fontSize: 22, color: C.headerBg, fontFamily: "Helvetica-Bold" }}>
                {data.maturity.label}
              </Text>
              <Text style={{ fontSize: 9, color: C.muted, marginTop: 5 }}>
                Range: {data.maturity.range}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 10, color: C.ink, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
            AI maturity journey
          </Text>
          <StagePills current={data.maturity.label} stageIdx={stageIdx} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
            <Text style={{ fontSize: 7.5, color: C.muted }}>← Early stage</Text>
            <Text style={{ fontSize: 7.5, color: C.muted }}>Advanced stage →</Text>
          </View>

        </View>

        <PageFooter pageNum={2} />
      </Page>

      {/* ── PAGE 3: RECOMMENDATIONS ──────────────────────────────────────────── */}
      <Page size="A4" style={{ fontFamily: "Helvetica", backgroundColor: C.white }}>
        <SectionHeader title="What to focus on in the next 90 days" />

        <View style={{ paddingHorizontal: 36, paddingTop: 22 }}>
          <Text style={{ fontSize: 10, color: C.muted, marginBottom: 18 }}>
            {data.recommendations.subtitle}
          </Text>

          {data.recommendations.items.map((item, i) => (
            <View
              key={i}
              style={{
                backgroundColor: C.bg,
                borderRadius: 10,
                padding: 20,
                marginBottom: 12,
                flexDirection: "row",
                gap: 16,
                alignItems: "flex-start",
                borderLeftWidth: 3,
                borderLeftColor: C.accent,
              }}
            >
              <View style={{
                backgroundColor: C.accent,
                borderRadius: 8,
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Text style={{ fontSize: 14, color: C.white, fontFamily: "Helvetica-Bold" }}>
                  {i + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: C.ink, fontFamily: "Helvetica-Bold", marginBottom: 6 }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 10, color: C.muted, lineHeight: 1.65 }}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <PageFooter pageNum={3} />
      </Page>

      {/* ── PAGE 4: DOMAIN SCORES ────────────────────────────────────────────── */}
      <Page size="A4" style={{ fontFamily: "Helvetica", backgroundColor: C.white }}>
        <SectionHeader title="Your 7 Domain Scores" />

        <View style={{ paddingHorizontal: 36, paddingTop: 20 }}>
          {data.categoryScores.map((row) => {
            const avg = data.domainAverages[row.enablerId] ?? 0;
            const s = scoreStatus(row.score);
            const shortName = ENABLER_SHORT[row.enablerId] ?? row.enablerName;

            return (
              <View key={row.enablerId} style={{ backgroundColor: C.bg, borderRadius: 8, padding: 14, marginBottom: 8 }}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ fontSize: 9.5, color: C.ink, fontFamily: "Helvetica-Bold" }}>
                      {shortName}
                    </Text>
                    <Text style={{ fontSize: 16, color: C.ink, fontFamily: "Helvetica-Bold", marginTop: 3 }}>
                      {row.score}%
                    </Text>
                  </View>
                  <View style={{ backgroundColor: s.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5 }}>
                    <Text style={{ fontSize: 7, color: s.text, fontFamily: "Helvetica-Bold", letterSpacing: 0.4 }}>
                      {s.label.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={{ height: 6, backgroundColor: "#d9dde3", borderRadius: 3, overflow: "hidden" }}>
                  {row.score > 0 && (
                    <View style={{ height: 6, backgroundColor: C.accent, borderRadius: 3, width: `${row.score}%` }} />
                  )}
                </View>

                {/* Avg label */}
                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  <View style={{ width: `${avg}%` }} />
                  <Text style={{ fontSize: 6.5, color: C.muted }}>↑ avg ({avg}%)</Text>
                </View>

              </View>
            );
          })}

          <Text style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>
            avg. = Industry benchmark average
          </Text>
        </View>

        <PageFooter pageNum={4} />
      </Page>

    </Document>
  );
}

export async function generatePdf(data: Omit<ReportData, "logoData">): Promise<void> {
  const logoData = await loadLogoData();
  const { pdf } = await import("@react-pdf/renderer");
  const blob = await pdf(<ReportDocument data={{ ...data, logoData }} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "AI-Readiness-Assessment-Report.pdf";
  a.click();
  URL.revokeObjectURL(url);
}
