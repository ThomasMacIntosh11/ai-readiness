import Link from "next/link";

export default function SiteHeader() {
  return (
    <div className="no-print">
      <div className="mx-auto flex w-full max-w-[1200px] justify-end px-6 pt-6">
        <Link
          href="/contact"
          className="inline-flex items-center rounded-full border border-[var(--brand-accent)]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-accent-strong)] shadow-[0_10px_25px_rgba(17,24,39,0.05)] transition hover:border-[var(--brand-accent)]/35 hover:bg-[var(--brand-accent)]/5"
        >
          Contact ADAPTOVATE
        </Link>
      </div>
    </div>
  );
}
