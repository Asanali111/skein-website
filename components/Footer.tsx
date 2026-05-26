import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bg-0 border-t border-divider">
      <div className="max-w-content mx-auto px-8 sm:px-12 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans text-[0.8125rem] text-fg-2">
          <Link href="/" className="wordmark-small text-lg text-fg-0">
            wevex
          </Link>
          <span>MIT · local-first · made for builders</span>
          <div className="flex gap-7">
            <a
              href="https://github.com/Asanali111/wevex"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg-0 transition-colors"
            >
              github
            </a>
            <a
              href="https://github.com/Asanali111/wevex#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg-0 transition-colors"
            >
              docs
            </a>
            <Link href="/changelog" className="hover:text-fg-0 transition-colors">
              changelog
            </Link>
            <a
              href="https://github.com/Asanali111/wevex/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg-0 transition-colors"
            >
              discuss
            </a>
          </div>
        </div>
        <p className="mt-4 font-mono text-[0.6875rem] text-fg-3">
          © 2026 Wevex contributors
        </p>
      </div>
    </footer>
  );
}
