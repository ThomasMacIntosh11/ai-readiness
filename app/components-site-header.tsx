import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="bg-[var(--brand-accent)] no-print">
      <div className="mx-auto flex w-full max-w-[980px] items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/adaptovate-logo.png" alt="Adaptovate Logo" width={86} height={46} priority />
          <p className="text-lg font-semibold text-white md:text-xl">AI Readiness Self-Assessment</p>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-white/90">
          <Link href="/assessment" className="hover:text-white">
            Take assessment
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
