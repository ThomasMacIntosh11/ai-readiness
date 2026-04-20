import Link from "next/link";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";

const SECTIONS = [
  {
    title: "1. Overview",
    body: "These Terms and Conditions govern your use of the AI Readiness Assessment tool (the \"Assessment\") provided by ADAPTOVATE Inc. (\"ADAPTOVATE\", \"we\", \"us\", or \"our\"). By accessing or completing the Assessment, you agree to be bound by these terms. If you do not agree, please do not proceed.",
  },
  {
    title: "2. Purpose of the Assessment",
    body: "The Assessment is an informational tool designed to give your organisation a general indication of its AI maturity and readiness. Results are generated based on your responses and are intended to support internal strategic conversations. They do not constitute professional advice of any kind, including legal, regulatory, financial, technical, or operational advice. Results should not be relied upon as a substitute for independent professional judgement.",
  },
  {
    title: "3. Eligibility",
    body: "The Assessment is intended for use by individuals representing organisations. By submitting your details, you confirm that you are authorised to provide the information entered on behalf of your organisation, and that the information provided is accurate to the best of your knowledge.",
  },
  {
    title: "4. Data Collection and Use",
    body: "When you complete the Assessment, we collect personal information including your name, email address, job title, and organisation name, as well as your assessment responses. This information is used to: (a) generate and deliver your AI readiness results and report; (b) contact you to discuss your results or provide related information; and (c) improve the quality and relevance of the Assessment over time. We may also use aggregated, de-identified data for benchmarking and research purposes. We will not sell your personal information to third parties.",
  },
  {
    title: "5. Privacy and Data Handling",
    body: "ADAPTOVATE is committed to handling your personal information in accordance with applicable privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation. Your data is stored securely and access is limited to authorised ADAPTOVATE personnel and service providers involved in delivering your results. You may request access to, correction of, or deletion of your personal information at any time by contacting us directly.",
  },
  {
    title: "6. Communications",
    body: "By providing your email address and completing the Assessment, you consent to receiving your results report and follow-up communications from ADAPTOVATE related to the Assessment, your results, or relevant services. You may opt out of non-essential communications at any time by clicking the unsubscribe link in any email we send, or by contacting us directly.",
  },
  {
    title: "7. Intellectual Property",
    body: "All content, design, methodology, and materials forming part of the Assessment are the intellectual property of ADAPTOVATE. You may not reproduce, distribute, adapt, or commercialise any part of the Assessment or its outputs without prior written permission from ADAPTOVATE. Your results report is provided for your internal use only.",
  },
  {
    title: "8. Limitation of Liability",
    body: "To the maximum extent permitted by law, ADAPTOVATE excludes all liability for any loss or damage arising from your use of or reliance on the Assessment results. This includes but is not limited to direct, indirect, incidental, or consequential loss, loss of profit, loss of data, or damage to business reputation. The Assessment is provided on an \"as is\" basis without warranties of any kind, express or implied.",
  },
  {
    title: "9. Accuracy of Results",
    body: "Assessment results are based solely on the responses you provide. ADAPTOVATE does not independently verify the accuracy or completeness of your responses. Results reflect a general maturity profile and may not account for all nuances of your organisation's context. Scores and stage classifications are indicative only.",
  },
  {
    title: "10. Third-Party Services",
    body: "The Assessment may use third-party services for hosting, analytics, or delivery. These providers are bound by their own privacy and data security obligations. ADAPTOVATE takes reasonable steps to ensure third-party providers handle your data appropriately, but is not liable for third-party actions outside our reasonable control.",
  },
  {
    title: "11. Changes to These Terms",
    body: "ADAPTOVATE reserves the right to update these Terms and Conditions at any time. Material changes will be reflected with an updated effective date. Continued use of the Assessment following any changes constitutes your acceptance of the revised terms.",
  },
  {
    title: "12. Governing Law",
    body: "These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes arising under these terms will be subject to the exclusive jurisdiction of the courts of Ontario, Canada.",
  },
  {
    title: "13. Contact",
    body: "If you have any questions about these Terms and Conditions or how your information is handled, please contact us directly at ADAPTOVATE Inc.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[900px] px-6 py-10">
          <section className="rounded-[32px] border border-white/70 bg-[var(--brand-surface)] px-8 py-10 shadow-[0_18px_50px_rgba(17,24,39,0.08)] md:px-10 md:py-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Legal</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--brand-ink)] md:text-5xl">Terms and Conditions</h1>
            <p className="mt-3 text-sm text-[var(--brand-muted)]">Effective date: April 2025</p>

            <div className="mt-10 space-y-8">
              {SECTIONS.map((section) => (
                <div key={section.title}>
                  <h2 className="text-base font-semibold text-[var(--brand-ink)]">{section.title}</h2>
                  <p className="mt-2 text-base leading-8 text-[var(--brand-muted)]">{section.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-[var(--brand-muted)]/10 pt-8">
              <Link href="/assessment" className="inline-flex items-center rounded-xl bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-accent-strong)]">
                Back to assessment overview
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
