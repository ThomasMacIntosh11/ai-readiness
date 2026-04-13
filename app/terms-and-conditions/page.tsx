import Link from "next/link";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";

export default function TermsAndConditionsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[900px] px-6 py-10">
          <section className="rounded-[32px] border border-white/70 bg-[var(--brand-surface)] px-8 py-10 shadow-[0_18px_50px_rgba(17,24,39,0.08)] md:px-10 md:py-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Terms and Conditions</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--brand-ink)] md:text-5xl">Assessment terms</h1>
            <div className="mt-8 space-y-6 text-base leading-8 text-[var(--brand-muted)]">
              <p>
                This assessment is provided by ADAPTOVATE as an informational readiness tool. Your responses are used to generate your AI maturity results and any related report content delivered to you.
              </p>
              <p>
                Information you submit through the assessment, including your contact details, may be used by ADAPTOVATE to send your results and to follow up with relevant information about the assessment, your report, or related services.
              </p>
              <p>
                ADAPTOVATE does not intend to share your assessment responses beyond the process required to prepare and deliver your results. By continuing, you acknowledge that the assessment provides general guidance and should not be treated as legal, regulatory, or financial advice.
              </p>
            </div>
            <div className="mt-8">
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
