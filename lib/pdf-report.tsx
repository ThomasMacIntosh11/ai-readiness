import React from "react";
import {
  Document, Page, View, Text, Image, Link,
  Svg, Rect,
} from "@react-pdf/renderer";
import type { ScoreRow, Maturity } from "./scoring";
import type { Recommendation } from "./recommendations";

// ── Brand palette ─────────────────────────────────────────────────────────────

const C = {
  headerBg:    "#177ea8",
  accent:      "#1d9acc",
  accentLight: "#e8f6fd",
  accentSub:   "#b3dff0",
  ink:         "#1e1e1e",
  body:        "#374151",
  muted:       "#6b7280",
  mutedLight:  "#9ca3af",
  border:      "#e5e7eb",
  trackBg:     "#eef1f4",
  white:       "#ffffff",
} as const;

const ENABLER_SHORT: Record<string, string> = {
  strategy:        "Strategy and ambition",
  data:            "Data and analytics foundation",
  technology:      "Technology and AI infrastructure",
  talent:          "Talent and digital literacy",
  operating_model: "Operating model and agility",
  governance:      "Governance and responsible AI",
  culture:         "Culture and change management",
};

export type ReportData = {
  participantName: string;
  organization:    string;
  role:            string;
  overallScore:    number;
  maturity:        Maturity;
  categoryScores:  ScoreRow[];
  stageDescription: string;
  stageHeadline:   string;
  recommendations: Recommendation[];
  domainAverages:  Record<string, number>;
  logoData?:       string | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Single-page report ────────────────────────────────────────────────────────

function ReportDocument({ data }: { data: ReportData }) {
  const today       = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
  const orgRoleLine = [data.organization, data.role].filter(Boolean).join("  ·  ");
  const barW        = 480;

  return (
    <Document>
      <Page
        size="A4"
        style={{ fontFamily: "Helvetica", backgroundColor: C.white, color: C.ink }}
      >
        {/* ── Header band ──────────────────────────────────────────────────── */}
        <View style={{
          backgroundColor: C.headerBg,
          paddingHorizontal: 36,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {data.logoData ? (
              <Image
                src={data.logoData}
                style={{ height: 16, width: 16, objectFit: "contain", marginRight: 8 }}
              />
            ) : null}
            <Text style={{ fontSize: 11, color: C.white, fontFamily: "Helvetica-Bold" }}>
              Adaptovate
            </Text>
          </View>
          <Text style={{ fontSize: 8, color: C.accentSub, letterSpacing: 2 }}>
            AI READINESS ASSESSMENT
          </Text>
        </View>

        {/* ── Content body ─────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 36, paddingTop: 22 }}>

          {/* Participant + meta row */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>
                {data.participantName || "Participant"}
              </Text>
              {orgRoleLine ? (
                <Text style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{orgRoleLine}</Text>
              ) : null}
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 9, color: C.mutedLight }}>{today}</Text>
              <Text style={{ fontSize: 9, color: C.mutedLight, marginTop: 2 }}>Confidential</Text>
            </View>
          </View>

          {/* Headline */}
          <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", marginTop: 20, lineHeight: 1.2 }}>
            {data.organization?.trim() ? data.organization.trim() : "Your organization"} is an AI{" "}
            <Text style={{ color: C.accent }}>{data.maturity.label}</Text>.
          </Text>

          {/* Score tiles */}
          <View style={{ flexDirection: "row", marginTop: 16 }}>
            <View style={{ flex: 1, backgroundColor: C.accentLight, borderRadius: 10, padding: 12, marginRight: 10 }}>
              <Text style={{ fontSize: 7.5, color: C.muted, letterSpacing: 1.4, fontFamily: "Helvetica-Bold" }}>
                CUMULATIVE READINESS SCORE
              </Text>
              <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 6 }}>
                <Text style={{ fontSize: 32, fontFamily: "Helvetica-Bold" }}>{data.overallScore}%</Text>
                <Text style={{ fontSize: 9, color: C.mutedLight, marginLeft: 6 }}>out of 100</Text>
              </View>
            </View>
            <View style={{ flex: 1, backgroundColor: C.accentLight, borderRadius: 10, padding: 12 }}>
              <Text style={{ fontSize: 7.5, color: C.muted, letterSpacing: 1.4, fontFamily: "Helvetica-Bold" }}>
                MATURITY STAGE
              </Text>
              <Text style={{ fontSize: 20, color: C.headerBg, fontFamily: "Helvetica-Bold", marginTop: 6 }}>
                {data.maturity.label}
              </Text>
              <View style={{ alignSelf: "flex-start", backgroundColor: C.white, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 }}>
                <Text style={{ fontSize: 8, color: C.headerBg, fontFamily: "Helvetica-Bold" }}>
                  Range {data.maturity.range}
                </Text>
              </View>
            </View>
          </View>

          {/* Stage description */}
          <Text style={{ fontSize: 8.5, color: C.muted, fontFamily: "Helvetica-Bold", letterSpacing: 1.4, marginTop: 18 }}>
            YOUR STAGE
          </Text>
          <Text style={{ fontSize: 9.5, color: C.body, lineHeight: 1.55, marginTop: 6 }}>
            {data.stageDescription}
          </Text>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: C.border, marginTop: 16 }} />

          {/* Focus areas */}
          <Text style={{ fontSize: 8.5, color: C.ink, fontFamily: "Helvetica-Bold", letterSpacing: 1.4, marginTop: 14 }}>
            WHAT TO FOCUS ON IN THE NEXT 90 DAYS
          </Text>

          <View style={{ marginTop: 10 }}>
            {data.recommendations.map((rec, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 8, alignItems: "flex-start" }}>
                <View style={{
                  width: 22, height: 22, borderRadius: 11,
                  backgroundColor: C.accent,
                  alignItems: "center", justifyContent: "center",
                  marginRight: 10,
                  marginTop: 1,
                }}>
                  <Text style={{ fontSize: 10, color: C.white, fontFamily: "Helvetica-Bold" }}>
                    {i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10.5, color: C.ink, fontFamily: "Helvetica-Bold" }}>
                    {rec.title}
                  </Text>
                  <Text style={{ fontSize: 9.5, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>
                    {rec.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: C.border, marginTop: 4 }} />

          {/* Domain scores */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 12 }}>
            <Text style={{ fontSize: 8.5, color: C.ink, fontFamily: "Helvetica-Bold", letterSpacing: 1.4 }}>
              DOMAIN SCORES VS INDUSTRY AVERAGE
            </Text>
            <Text style={{ fontSize: 8, color: C.mutedLight }}>
              your score   |   industry avg
            </Text>
          </View>

          <View style={{ marginTop: 8 }}>
            {data.categoryScores.map((row) => {
              const avg  = data.domainAverages[row.enablerId] ?? 0;
              const name = ENABLER_SHORT[row.enablerId] ?? row.enablerName;
              const fillW = Math.max(0, Math.min(100, row.score)) / 100 * barW;
              const avgX  = Math.max(0, Math.min(100, avg)) / 100 * barW;

              return (
                <View key={row.enablerId} style={{ marginBottom: 7 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                    <Text style={{ fontSize: 9.5, color: C.ink }}>{name}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ fontSize: 9.5, fontFamily: "Helvetica-Bold" }}>{row.score}%</Text>
                      <Text style={{ fontSize: 8.5, color: C.mutedLight, marginLeft: 12 }}>avg {avg}</Text>
                    </View>
                  </View>
                  <Svg viewBox={`0 0 ${barW} 12`} style={{ width: "100%", height: 8 }}>
                    <Rect x="0" y="3" width={barW} height="6" rx="3" fill={C.trackBg} />
                    {row.score > 0 && (
                      <Rect x="0" y="3" width={fillW} height="6" rx="3" fill={C.accent} />
                    )}
                    <Rect x={avgX - 1} y="0" width="2" height="12" fill={C.muted} />
                  </Svg>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Footer (anchored) ────────────────────────────────────────────── */}
        <View style={{ position: "absolute", bottom: 0, left: 36, right: 36 }}>
          <View style={{ height: 1, backgroundColor: C.border, marginBottom: 10 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 18 }}>
            <View>
              <Text style={{ fontSize: 9, color: C.muted }}>Want a 30-min readout?</Text>
              <Link src="mailto:growth_CA@adaptovate.com?subject=Free%20AI%20Readiness%20Consultation" style={{ fontSize: 9.5, color: C.headerBg, fontFamily: "Helvetica-Bold", marginTop: 2 }}>
                growth_CA@adaptovate.com
              </Link>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 8, color: C.muted, fontFamily: "Helvetica-Bold", letterSpacing: 1.2 }}>
                ADAPTOVATE TORONTO
              </Text>
              <Text style={{ fontSize: 8.5, color: C.muted, marginTop: 2 }}>
                296 Richmond St. West, Toronto, ON M5V 1X2
              </Text>
            </View>
          </View>
        </View>

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
