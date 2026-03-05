import Link from "next/link";
import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[980px] px-6 py-10">
          <section className="rounded-2xl bg-[var(--brand-surface)] p-10 shadow-[0_4px_16px_rgba(17,24,39,0.08)]">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--brand-ink)]">Get Started On The Assessment</h1>
            <p className="mt-4 max-w-3xl text-lg text-[var(--brand-muted)]">
              This assessment covers seven enabler categories. You will answer two questions per category on a 1-5 scale.
            </p>
            <p className="mt-2 text-lg text-[var(--brand-muted)]">
              After completing the questionnaire, you will provide user information and receive your results with recommendations.
            </p>

            <div className="mt-8">
              <Link
                href="/assessment"
                className="inline-flex items-center rounded-lg bg-[var(--brand-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-accent-strong)]"
              >
                Start assessment
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
