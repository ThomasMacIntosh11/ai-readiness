/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ScoreRow, Maturity } from "./scoring";

const B = {
  accentStrong: "#177ea8",
  accent: "#1d9acc",
  accentLight: "#e8f6fd",
  ink: "#1e1e1e",
  muted: "#6b7280",
  bg: "#eef1f4",
  white: "#ffffff",
  border: "#d7dde5",
  track: "#d9dde3",
  greenText: "#1f7a4d",
  greenBg: "#dff4e8",
  amberText: "#946200",
  amberBg: "#fff3cd",
  redText: "#bf2950",
  redBg: "#fde2e8",
} as const;

const STAGES = ["Explorer", "Pilot", "Builder", "Integrator", "Transformer"] as const;

const ENABLER_SHORT_NAMES: Record<string, string> = {
  strategy: "Strategy and ambition",
  data: "Data and analytics foundation",
  technology: "Technology and AI infrastructure",
  talent: "Talent and digital literacy",
  operating_model: "Operating model and agility",
  governance: "Governance and responsible AI",
  culture: "Culture and change management",
};

type FocusItem = { title: string; subtitle: string };

export type PdfReportData = {
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
};

function rgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function fnt(doc: any, size: number, style: "normal" | "bold", colorHex: string) {
  doc.setFontSize(size);
  doc.setFont("helvetica", style);
  doc.setTextColor(...rgb(colorHex));
}

function fill(doc: any, hex: string) {
  doc.setFillColor(...rgb(hex));
}

function stroke(doc: any, hex: string) {
  doc.setDrawColor(...rgb(hex));
}

function rr(doc: any, x: number, y: number, w: number, h: number, r: number) {
  doc.roundedRect(x, y, w, h, r, r, "F");
}

function pageHeader(doc: any, title: string, W: number) {
  fill(doc, B.accentStrong);
  doc.rect(0, 0, W, 32, "F");
  fnt(doc, 13, "bold", B.white);
  doc.text(title, 16, 21);
}

function pageFooter(doc: any, W: number, H: number, pageNum: number) {
  stroke(doc, B.border);
  doc.setLineWidth(0.3);
  doc.line(16, H - 18, W - 16, H - 18);
  fnt(doc, 8, "normal", B.muted);
  doc.text("AI Readiness Assessment  ·  Confidential", 16, H - 10);
  doc.text(`${pageNum}`, W - 16, H - 10, { align: "right" });
}

function scoreStatus(score: number) {
  if (score < 50) return { label: "Growth opportunity", textHex: B.redText, bgHex: B.redBg };
  if (score <= 80) return { label: "Developing", textHex: B.amberText, bgHex: B.amberBg };
  return { label: "Strong", textHex: B.greenText, bgHex: B.greenBg };
}

async function loadImage(src: string): Promise<string | null> {
  try {
    const resp = await fetch(src);
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

export async function generatePdf(data: PdfReportData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF("p", "mm", "a4");
  const W = 210;
  const H = 297;
  const m = 16;
  const colW = (W - m * 2 - 8) / 2;
  const pillW = (W - m * 2) / STAGES.length;
  const stageIdx = STAGES.indexOf(data.maturity.label as (typeof STAGES)[number]);
  const today = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  const logoData = await loadImage("/adaptovate-logo.png");

  // ── PAGE 1: COVER ─────────────────────────────────────────────────────────────

  fill(doc, B.accentStrong);
  doc.rect(0, 0, W, 68, "F");

  if (logoData) {
    doc.addImage(logoData, "PNG", m, 20, 44, 17);
  }

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(179, 223, 240);
  doc.text("AI Readiness Assessment", m, 57);

  fnt(doc, 30, "bold", B.ink);
  doc.text(data.participantName || "Participant", m, 96);

  let infoY = 106;
  if (data.organization) {
    fnt(doc, 12, "normal", B.muted);
    doc.text(data.organization, m, infoY);
    infoY += 7;
  }
  if (data.role) {
    fnt(doc, 10, "normal", B.muted);
    doc.text(data.role, m, infoY);
  }

  // Score + stage cards
  fill(doc, B.accentLight);
  rr(doc, m, 126, colW, 52, 8);
  fnt(doc, 8, "bold", B.muted);
  doc.text("CUMULATIVE SCORE", m + 10, 138);
  fnt(doc, 32, "bold", B.ink);
  doc.text(`${data.overallScore}%`, m + 10, 166);

  fill(doc, B.accentLight);
  rr(doc, m + colW + 8, 126, colW, 52, 8);
  fnt(doc, 8, "bold", B.muted);
  doc.text("MATURITY STAGE", m + colW + 18, 138);
  fnt(doc, 20, "bold", B.accentStrong);
  doc.text(data.maturity.label, m + colW + 18, 156);
  fnt(doc, 9, "normal", B.muted);
  doc.text(`Range: ${data.maturity.range}`, m + colW + 18, 167);

  // Maturity stage pills
  STAGES.forEach((stage, i) => {
    const x = m + i * pillW;
    const isActive = stage === data.maturity.label;
    const isPast = stageIdx > i;
    fill(doc, isActive ? B.accent : isPast ? "#b3dff0" : B.bg);
    rr(doc, x + 1, 194, pillW - 2, 18, 4);
    fnt(doc, 7.5, isActive ? "bold" : "normal", isActive ? B.white : isPast ? B.accentStrong : B.muted);
    doc.text(stage, x + pillW / 2, 205.5, { align: "center" });
  });

  fnt(doc, 8, "normal", B.muted);
  doc.text(`Generated ${today}`, m, H - 14);
  doc.text("Confidential", W - m, H - 14, { align: "right" });

  // ── PAGE 2: MATURITY PROFILE ──────────────────────────────────────────────────

  doc.addPage();
  pageHeader(doc, "Your AI Maturity Profile", W);

  let y = 42;

  fnt(doc, 14, "bold", B.ink);
  const hlLines: string[] = doc.splitTextToSize(data.stageHeadline, W - m * 2);
  doc.text(hlLines, m, y);
  y += hlLines.length * 7.5 + 5;

  const descLines: string[] = doc.splitTextToSize(data.stageDescription, W - m * 2 - 16);
  const descH = descLines.length * 5.5 + 18;
  fill(doc, B.bg);
  rr(doc, m, y, W - m * 2, descH, 8);
  fnt(doc, 9.5, "normal", B.ink);
  doc.text(descLines, m + 10, y + 11);
  y += descH + 10;

  fill(doc, B.accentLight);
  rr(doc, m, y, colW, 40, 6);
  fnt(doc, 8, "bold", B.muted);
  doc.text("CUMULATIVE SCORE", m + 10, y + 11);
  fnt(doc, 22, "bold", B.ink);
  doc.text(`${data.overallScore}%`, m + 10, y + 30);

  fill(doc, B.accentLight);
  rr(doc, m + colW + 8, y, colW, 40, 6);
  fnt(doc, 8, "bold", B.muted);
  doc.text("MATURITY STAGE", m + colW + 18, y + 11);
  fnt(doc, 15, "bold", B.accentStrong);
  doc.text(data.maturity.label, m + colW + 18, y + 25);
  fnt(doc, 9, "normal", B.muted);
  doc.text(`Range: ${data.maturity.range}`, m + colW + 18, y + 34);
  y += 52;

  fnt(doc, 10, "bold", B.ink);
  doc.text("Your position on the AI maturity journey", m, y);
  y += 8;

  STAGES.forEach((stage, i) => {
    const x = m + i * pillW;
    const isActive = stage === data.maturity.label;
    const isPast = stageIdx > i;
    fill(doc, isActive ? B.accent : isPast ? "#b3dff0" : B.bg);
    rr(doc, x + 1, y, pillW - 2, 20, 5);
    fnt(doc, isActive ? 8 : 7.5, isActive ? "bold" : "normal", isActive ? B.white : isPast ? B.accentStrong : B.muted);
    doc.text(stage, x + pillW / 2, y + 13, { align: "center" });
  });

  y += 28;
  fnt(doc, 7.5, "normal", B.muted);
  doc.text("← Early stage", m + 2, y);
  doc.text("Advanced stage →", W - m, y, { align: "right" });

  pageFooter(doc, W, H, 2);

  // ── PAGE 3: 90-DAY RECOMMENDATIONS ───────────────────────────────────────────

  doc.addPage();
  pageHeader(doc, "What to focus on in the next 90 days", W);

  fnt(doc, 10, "normal", B.muted);
  doc.text(data.recommendations.subtitle, m, 40);

  y = 50;
  data.recommendations.items.forEach((item, i) => {
    const subLines: string[] = doc.splitTextToSize(item.subtitle, W - m * 2 - 46);
    const cardH = Math.max(48, 32 + subLines.length * 5.5);

    fill(doc, B.bg);
    rr(doc, m, y, W - m * 2, cardH, 8);

    fill(doc, B.accent);
    rr(doc, m + 10, y + cardH / 2 - 11, 22, 22, 5);
    fnt(doc, 13, "bold", B.white);
    doc.text(`${i + 1}`, m + 21, y + cardH / 2 + 2.5, { align: "center" });

    fnt(doc, 11, "bold", B.ink);
    doc.text(item.title, m + 40, y + 16);

    fnt(doc, 9.5, "normal", B.muted);
    doc.text(subLines, m + 40, y + 26);

    y += cardH + 8;
  });

  pageFooter(doc, W, H, 3);

  // ── PAGE 4: DOMAIN SCORES ─────────────────────────────────────────────────────

  doc.addPage();
  pageHeader(doc, "Your 7 Domain Scores", W);

  y = 40;
  const barX = m + 58;
  const barW = W - m * 2 - 58 - 52;

  data.categoryScores.forEach((row) => {
    const avg = data.domainAverages[row.enablerId] ?? 0;
    const s = scoreStatus(row.score);
    const rowH = 30;
    const shortName = ENABLER_SHORT_NAMES[row.enablerId] ?? row.enablerName;

    fill(doc, B.bg);
    rr(doc, m, y, W - m * 2, rowH, 6);

    fnt(doc, 8.5, "bold", B.ink);
    doc.text(shortName, m + 8, y + 10);

    fnt(doc, 12, "bold", B.ink);
    doc.text(`${row.score}%`, m + 8, y + 22);

    const badgeW = 46;
    const badgeX = W - m - badgeW - 4;
    fill(doc, s.bgHex);
    rr(doc, badgeX, y + 10, badgeW, 10, 3);
    fnt(doc, 5.5, "bold", s.textHex);
    doc.text(s.label.toUpperCase(), badgeX + badgeW / 2, y + 17, { align: "center" });

    const barTrackY = y + 19;
    fill(doc, B.track);
    rr(doc, barX, barTrackY, barW, 5, 2);

    if (row.score > 0) {
      fill(doc, B.accent);
      rr(doc, barX, barTrackY, (barW * row.score) / 100, 5, 2);
    }

    const avgX = barX + (barW * avg) / 100;
    stroke(doc, B.muted);
    doc.setLineWidth(0.5);
    doc.line(avgX, barTrackY - 2, avgX, barTrackY + 7);
    fnt(doc, 5.5, "normal", B.muted);
    doc.text("avg", avgX, barTrackY - 3, { align: "center" });

    y += rowH + 3;
  });

  y += 4;
  fnt(doc, 8, "normal", B.muted);
  doc.text("avg. = Industry benchmark average", m, y);

  pageFooter(doc, W, H, 4);

  doc.save("AI-Readiness-Assessment-Report.pdf");
}
