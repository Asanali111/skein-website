import InstallBox from "./InstallBox";
import { PrimaryCta, SecondaryCta } from "./Cta";
import { StatusDot, VersionBadge } from "./Badges";

export default function Hero() {
  return (
    <section className="relative">
      <div className="max-w-content mx-auto px-8 sm:px-12 pt-16 pb-14 sm:pt-20">
        <h1 className="wordmark text-[3.5rem] sm:text-[4.5rem] md:text-wordmark text-fg-0 mb-7">
          skein
        </h1>

        <p className="tagline text-xl sm:text-2xl text-fg-0 max-w-[30rem] mb-[0.625rem]">
          One memory across every coding LLM.
        </p>
        <p className="text-[0.9375rem] leading-[1.55] text-fg-1 max-w-[30rem] mb-8">
          Local-first context bus for Claude Code, Cursor, Codex, Gemini CLI, Antigravity,
          opencode, and more. No vendor lock-in. No cloud round-trip. The daemon runs on
          127.0.0.1.
        </p>

        <div className="mb-7">
          <InstallBox command="pip install skein && skein up" />
        </div>

        <div className="flex flex-wrap gap-3 mb-7">
          <PrimaryCta href="#integrations">install</PrimaryCta>
          <SecondaryCta href="#what-it-does">how it works</SecondaryCta>
        </div>

        <nav className="flex flex-wrap items-center gap-7 font-sans text-sm text-fg-2 mb-8">
          <a
            href="https://github.com/Asanali111/skein"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg-0 hover:border-b hover:border-primary pb-px transition-colors"
          >
            github
          </a>
          <a
            href="https://github.com/Asanali111/skein#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg-0 hover:border-b hover:border-primary pb-px transition-colors"
          >
            docs
          </a>
          <a href="/integrations" className="hover:text-fg-0 hover:border-b hover:border-primary pb-px transition-colors">
            integrations
          </a>
          <a
            href="https://discord.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg-0 hover:border-b hover:border-primary pb-px transition-colors"
          >
            discord
          </a>
        </nav>

        <div className="flex flex-wrap items-center gap-5 pt-6 border-t border-divider font-mono text-xs text-fg-1">
          <span className="inline-flex items-center">
            <StatusDot />
            daemon ready · 706 chunks · 64 fragments
          </span>
          <VersionBadge>v0.1.0</VersionBadge>
        </div>
      </div>
    </section>
  );
}
