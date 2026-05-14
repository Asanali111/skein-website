import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function TopNav() {
  return (
    <div className="max-w-content mx-auto px-8 sm:px-12 pt-6 flex items-center justify-between">
      <Link href="/" className="wordmark-small text-lg text-fg-0">
        skein
      </Link>
      <div className="flex items-center gap-5">
        <nav className="hidden sm:flex items-center gap-5 font-mono text-[0.75rem] tracking-[0.04em] text-fg-2">
          <Link href="/integrations" className="hover:text-fg-0 transition-colors">
            integrations
          </Link>
          <Link href="/bench" className="hover:text-fg-0 transition-colors">
            bench
          </Link>
          <Link href="/security" className="hover:text-fg-0 transition-colors">
            security
          </Link>
          <Link href="/changelog" className="hover:text-fg-0 transition-colors">
            changelog
          </Link>
          <a
            href="https://github.com/Asanali111/skein"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg-0 transition-colors"
          >
            github
          </a>
        </nav>
        <ThemeToggle />
      </div>
    </div>
  );
}
