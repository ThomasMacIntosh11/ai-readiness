import React from "react";
import {
  Document, Page, View, Text, Image,
  Svg, Path, Line, Circle, Rect,
} from "@react-pdf/renderer";
import type { ScoreRow, Maturity } from "./scoring";

// ── Brand colours ─────────────────────────────────────────────────────────────

const C = {
  headerBg:    "#177ea8",
  accent:      "#1d9acc",
  accentLight: "#e8f6fd",
  accentMid:   "#b3dff0",
  ink:         "#1e1e1e",
  muted:       "#6b7280",
  mutedLight:  "#9ca3af",
  bg:          "#eef1f4",
  white:       "#ffffff",
  border:      "#d7dde5",
  headerSub:   "#b3dff0",
  greenText:   "#1f7a4d",
  greenBg:     "#dff4e8",
  amberText:   "#946200",
  amberBg:     "#fff3cd",
  redText:     "#bf2950",
  redBg:       "#fde2e8",
} as const;

const STAGES = ["Explorer", "Pilot", "Builder", "Integrator", "Transformer"] as const;

const ENABLER_SHORT: Record<string, string> = {
  strategy:       "Strategy and ambition",
  data:           "Data and analytics foundation",
  technology:     "Technology and AI infrastructure",
  talent:         "Talent and digital literacy",
  operating_model:"Operating model and agility",
  governance:     "Governance and responsible AI",
  culture:        "Culture and change management",
};

type FocusItem = { title: string; subtitle: string };

export type ReportData = {
  participantName: string;
  organization:   string;
  role:           string;
  overallScore:   number;
  maturity:       Maturity;
  categoryScores: ScoreRow[];
  stageDescription: string;
  stageHeadline:  string;
  recommendations:{ subtitle: string; items: FocusItem[] };
  domainAverages: Record<string, number>;
  logoData?:      string | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreStatus(score: number) {
  if (score < 50)  return { label: "Growth opportunity", text: C.redText,   bg: C.redBg   };
  if (score <= 80) return { label: "Developing",         text: C.amberText, bg: C.amberBg };
  return               { label: "Strong",               text: C.greenText, bg: C.greenBg };
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function bezierPoint(t: number) {
  const p0 = { x: 48, y: 250 }, p1 = { x: 190, y: 232 },
        p2 = { x: 328, y: 120 }, p3 = { x: 672, y: 62  };
  const u = 1 - t;
  return {
    x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
    y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y,
  };
}

function scoreToT(score: number) {
  const targetX = 48 + 624 * clamp(score, 0, 100) / 100;
  let lo = 0, hi = 1;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (bezierPoint(mid).x < targetX) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

async function loadLogoData(): Promise<string | null> {
  try {
    const resp = await fetch("/adv-logo.png");
    const blob = await resp.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

// ── Shared components ─────────────────────────────────────────────────────────

function PageHeader({ title }: { title: string }) {
  return (
    <View style={{ backgroundColor: C.headerBg, paddingHorizontal: 36, paddingVertical: 16 }}>
      <Text style={{ fontSize: 13, color: C.white, fontFamily: "Helvetica-Bold" }}>{title}</Text>
    </View>
  );
}

function PageFooter({ n }: { n: number }) {
  return (
    <View style={{ position: "absolute", bottom: 22, left: 36, right: 36 }}>
      <View style={{ borderTopWidth: 0.4, borderTopColor: C.border, paddingTop: 7, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 8, color: C.muted }}>AI Readiness Assessment  ·  Confidential</Text>
        <Text style={{ fontSize: 8, color: C.muted }}>{n}</Text>
      </View>
    </View>
  );
}

function StagePills({ current, stageIdx }: { current: string; stageIdx: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {STAGES.map((s, i) => {
        const active = s === current;
        const past   = stageIdx > i;
        return (
          <View key={s} style={{ flex: 1, backgroundColor: active ? C.accent : past ? C.accentMid : C.bg, borderRadius: 6, paddingVertical: 8, alignItems: "center" }}>
            <Text style={{ fontSize: 7.5, color: active ? C.white : past ? C.headerBg : C.muted, fontFamily: active ? "Helvetica-Bold" : "Helvetica" }}>
              {s}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ── Maturity journey SVG chart ────────────────────────────────────────────────

function MaturityChart({ score, current, stageIdx }: { score: number; current: string; stageIdx: number }) {
  const t      = scoreToT(score);
  const marker = bezierPoint(t);
  const sepXs  = [1, 2, 3, 4].map(i => 48 + 624 * i / 5);

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Stage name labels above the chart */}
      <View style={{ flexDirection: "row", paddingHorizontal: 0, marginBottom: 2 }}>
        {STAGES.map((s) => {
          const active = s === current;
          return (
            <View key={s} style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: 7.5, color: active ? C.headerBg : C.muted, fontFamily: active ? "Helvetica-Bold" : "Helvetica" }}>
                {s}
              </Text>
              {active && (
                <View style={{ height: 2, width: 36, backgroundColor: C.accent, borderRadius: 1, marginTop: 2 }} />
              )}
            </View>
          );
        })}
      </View>

      {/* SVG chart */}
      <Svg viewBox="0 0 740 280" style={{ width: "100%", height: 160 }}>
        {/* Grid lines */}
        <Line x1="48" y1="80"  x2="690" y2="80"  stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 8" />
        <Line x1="48" y1="140" x2="690" y2="140" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 8" />
        <Line x1="48" y1="200" x2="690" y2="200" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 8" />

        {/* Stage separators */}
        {sepXs.map((x, i) => (
          <Line key={i} x1={x} y1="50" x2={x} y2="250" stroke="#9ca3af" strokeWidth="1" strokeDasharray="5 8" />
        ))}

        {/* Axes */}
        <Line x1="48" y1="250" x2="690" y2="250" stroke={C.ink} strokeWidth="3" />
        <Line x1="48" y1="40"  x2="48"  y2="250" stroke={C.ink} strokeWidth="3" />

        {/* Area under curve */}
        <Path
          d="M 48 250 C 190 232, 328 120, 672 62 L 672 250 L 48 250 Z"
          fill={C.accent}
          fillOpacity="0.12"
        />

        {/* Bezier curve */}
        <Path
          d="M 48 250 C 190 232, 328 120, 672 62"
          fill="none"
          stroke={C.accent}
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Marker outer glow */}
        <Circle cx={marker.x} cy={marker.y} r="20" fill={C.accent} fillOpacity="0.15" />
        {/* Marker ring */}
        <Circle cx={marker.x} cy={marker.y} r="16" fill="none" stroke={C.accent} strokeOpacity="0.35" strokeWidth="4" />
        {/* Marker dot */}
        <Circle cx={marker.x} cy={marker.y} r="10" fill={C.accent} />
      </Svg>

      {/* Axis label row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 2 }}>
        <Text style={{ fontSize: 7, color: C.muted }}>← Early stage</Text>
        <Text style={{ fontSize: 9, color: C.ink, fontFamily: "Helvetica-Bold" }}>Organization Maturity</Text>
        <Text style={{ fontSize: 7, color: C.muted }}>Advanced stage →</Text>
      </View>
    </View>
  );
}

// ── Report document ───────────────────────────────────────────────────────────

function ReportDocument({ data }: { data: ReportData }) {
  const stageIdx = STAGES.indexOf(data.maturity.label as typeof STAGES[number]);
  const today    = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Document>

      {/* ── PAGE 1: COVER ──────────────────────────────────────────────────── */}
      <Page size="A4" style={{ fontFamily: "Helvetica", backgroundColor: C.white }}>

        {/* Header bar */}
        <View style={{ backgroundColor: C.headerBg, paddingHorizontal: 36, paddingTop: 30, paddingBottom: 24, height: 105, justifyContent: "space-between" }}>
          {data.logoData
            ? <Image src={data.logoData} style={{ height: 44, width: 44, objectFit: "contain" }} />
            : <Text style={{ fontSize: 18, color: C.white, fontFamily: "Helvetica-Bold" }}>Adaptovate</Text>
          }
          <Text style={{ fontSize: 9, color: C.headerSub, letterSpacing: 1.2 }}>AI Readiness Assessment</Text>
        </View>

        <View style={{ paddingHorizontal: 36, paddingTop: 36, flex: 1 }}>
          <Text style={{ fontSize: 38, color: C.ink, fontFamily: "Helvetica-Bold", lineHeight: 1.1 }}>
            {data.participantName || "Participant"}
          </Text>
          {data.organization
            ? <Text style={{ fontSize: 13, color: C.muted, marginTop: 10 }}>{data.organization}</Text>
            : null}
          {data.role
            ? <Text style={{ fontSize: 11, color: C.mutedLight, marginTop: 4 }}>{data.role}</Text>
            : null}

          {/* Score + stage cards */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 30 }}>
            <View style={{ flex: 1, backgroundColor: C.accentLight, borderRadius: 12, padding: 20 }}>
              <Text style={{ fontSize: 7.5, color: C.muted, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 10 }}>CUMULATIVE SCORE</Text>
              <Text style={{ fontSize: 46, color: C.ink, fontFamily: "Helvetica-Bold", lineHeight: 1 }}>{data.overallScore}%</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: C.accentLight, borderRadius: 12, padding: 20 }}>
              <Text style={{ fontSize: 7.5, color: C.muted, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 10 }}>MATURITY STAGE</Text>
              <Text style={{ fontSize: 28, color: C.headerBg, fontFamily: "Helvetica-Bold", lineHeight: 1 }}>{data.maturity.label}</Text>
              <View style={{ alignSelf: "flex-start", backgroundColor: C.accentLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 10, borderWidth: 1, borderColor: C.accentMid }}>
                <Text style={{ fontSize: 9, color: C.accent, fontFamily: "Helvetica-Bold" }}>Range: {data.maturity.range}</Text>
              </View>
            </View>
          </View>

          {/* Stage pills */}
          <View style={{ marginTop: 26 }}>
            <Text style={{ fontSize: 8.5, color: C.muted, marginBottom: 8 }}>Your position on the AI maturity journey</Text>
            <StagePills current={data.maturity.label} stageIdx={stageIdx} />
          </View>

          {/* Stage description */}
          <View style={{ marginTop: 24, backgroundColor: C.bg, borderRadius: 10, padding: 18, borderLeftWidth: 3, borderLeftColor: C.accent }}>
            <Text style={{ fontSize: 10, color: C.ink, lineHeight: 1.75 }}>{data.stageDescription}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 36, paddingBottom: 26, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 8.5, color: C.muted }}>Generated {today}</Text>
          <Text style={{ fontSize: 8.5, color: C.muted }}>Confidential</Text>
        </View>

      </Page>

      {/* ── PAGE 2: MATURITY PROFILE ────────────────────────────────────────── */}
      <Page size="A4" style={{ fontFamily: "Helvetica", backgroundColor: C.white }}>
        <PageHeader title="Your AI Maturity Profile" />

        <View style={{ paddingHorizontal: 36, paddingTop: 24 }}>
          <Text style={{ fontSize: 15, color: C.ink, fontFamily: "Helvetica-Bold", lineHeight: 1.45, marginBottom: 20 }}>
            {data.stageHeadline}
          </Text>

          {/* Maturity journey chart */}
          <View style={{ backgroundColor: C.accentLight, borderRadius: 12, padding: 16, marginBottom: 22 }}>
            <MaturityChart score={data.overallScore} current={data.maturity.label} stageIdx={stageIdx} />
          </View>

          {/* Score cards */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 22 }}>
            <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 10, padding: 16 }}>
              <Text style={{ fontSize: 7.5, color: C.muted, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 8 }}>CUMULATIVE SCORE</Text>
              <Text style={{ fontSize: 32, color: C.ink, fontFamily: "Helvetica-Bold" }}>{data.overallScore}%</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 10, padding: 16 }}>
              <Text style={{ fontSize: 7.5, color: C.muted, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 8 }}>MATURITY STAGE</Text>
              <Text style={{ fontSize: 22, color: C.headerBg, fontFamily: "Helvetica-Bold" }}>{data.maturity.label}</Text>
              <Text style={{ fontSize: 9, color: C.muted, marginTop: 5 }}>Range: {data.maturity.range}</Text>
            </View>
          </View>
        </View>

        <PageFooter n={2} />
      </Page>

      {/* ── PAGE 3: RECOMMENDATIONS ─────────────────────────────────────────── */}
      <Page size="A4" style={{ fontFamily: "Helvetica", backgroundColor: C.white }}>
        <PageHeader title="What to focus on in the next 90 days" />

        <View style={{ paddingHorizontal: 36, paddingTop: 22 }}>
          <Text style={{ fontSize: 10, color: C.muted, marginBottom: 18 }}>{data.recommendations.subtitle}</Text>

          {data.recommendations.items.map((item, i) => (
            <View key={i} style={{ backgroundColor: C.bg, borderRadius: 10, padding: 20, marginBottom: 12, flexDirection: "row", gap: 14, alignItems: "flex-start", borderLeftWidth: 3, borderLeftColor: C.accent }}>
              <View style={{ backgroundColor: C.accent, borderRadius: 8, width: 30, height: 30, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Text style={{ fontSize: 14, color: C.white, fontFamily: "Helvetica-Bold" }}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: C.ink, fontFamily: "Helvetica-Bold", marginBottom: 6 }}>{item.title}</Text>
                <Text style={{ fontSize: 10, color: C.muted, lineHeight: 1.65 }}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        <PageFooter n={3} />
      </Page>

      {/* ── PAGE 4: DOMAIN SCORES ───────────────────────────────────────────── */}
      <Page size="A4" style={{ fontFamily: "Helvetica", backgroundColor: C.white }}>
        <PageHeader title="Your 7 Domain Scores" />

        <View style={{ paddingHorizontal: 36, paddingTop: 20 }}>
          {data.categoryScores.map((row) => {
            const avg   = data.domainAverages[row.enablerId] ?? 0;
            const s     = scoreStatus(row.score);
            const name  = ENABLER_SHORT[row.enablerId] ?? row.enablerName;
            const barW  = 390; // track width in "units" matching the View

            return (
              <View key={row.enablerId} style={{ backgroundColor: C.bg, borderRadius: 8, padding: 14, marginBottom: 9 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ fontSize: 9.5, color: C.ink, fontFamily: "Helvetica-Bold" }}>{name}</Text>
                    <Text style={{ fontSize: 18, color: C.ink, fontFamily: "Helvetica-Bold", marginTop: 2 }}>{row.score}%</Text>
                  </View>
                  <View style={{ backgroundColor: s.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5 }}>
                    <Text style={{ fontSize: 6.5, color: s.text, fontFamily: "Helvetica-Bold", letterSpacing: 0.4 }}>
                      {s.label.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Progress bar via SVG for precise avg marker */}
                <Svg viewBox={`0 0 ${barW} 24`} style={{ width: "100%", height: 20 }}>
                  {/* Track */}
                  <Rect x="0" y="6" width={barW} height="8" rx="4" fill="#d9dde3" />
                  {/* Fill */}
                  {row.score > 0 && (
                    <Rect x="0" y="6" width={barW * row.score / 100} height="8" rx="4" fill={C.accent} />
                  )}
                  {/* Avg marker */}
                  <Rect x={barW * avg / 100 - 1} y="2" width="2" height="16" fill={C.muted} />
                </Svg>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: `${avg}%` }} />
                  <Text style={{ fontSize: 6.5, color: C.muted }}>↑ avg ({avg}%)</Text>
                </View>
              </View>
            );
          })}

          <Text style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>avg. = Industry benchmark average</Text>
        </View>

        <PageFooter n={4} />
      </Page>

    </Document>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function generatePdf(data: Omit<ReportData, "logoData">): Promise<void> {
  const [logoData, { pdf }] = await Promise.all([
    loadLogoData(),
    import("@react-pdf/renderer"),
  ]);
  const blob = await pdf(<ReportDocument data={{ ...data, logoData }} />).toBlob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "AI-Readiness-Report.pdf";
  a.click();
  URL.revokeObjectURL(url);
}
