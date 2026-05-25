import InstallTabs from "./InstallTabs";
import { SecondaryCta } from "./Cta";
import { VersionBadge } from "./Badges";
import PixelLoom from "./PixelLoom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden hero-pattern">
      <PixelLoom />
      <div className="max-w-content mx-auto px-8 sm:px-12 pt-16 pb-14 sm:pt-20 relative">
        <h1 className="wordmark text-[3.5rem] sm:text-[4.5rem] md:text-wordmark text-fg-0 mb-7">
          skein
        </h1>

        <p className="tagline text-xl sm:text-2xl text-fg-0 max-w-[30rem] mb-[0.625rem]">
          One memory across every coding LLM.
        </p>
        <p className="text-[0.9375rem] leading-[1.55] text-fg-1 max-w-[30rem] mb-8">
          Local-first context bus for Claude Desktop, Cursor, Codex, VS Code, Antigravity,
          opencode, and more. No vendor lock-in. No cloud round-trip. The daemon runs on
          127.0.0.1.
        </p>

        <div className="mb-7">
          <InstallTabs />
        </div>

        <div className="flex flex-wrap gap-3 mb-7">
          <SecondaryCta href="#what-it-does">see it work →</SecondaryCta>
          <SecondaryCta href="#integrations">7 supported clients</SecondaryCta>
        </div>

        <div className="flex flex-wrap items-center gap-5 pt-6 border-t border-divider font-mono text-xs text-fg-1">
          <span className="text-fg-2">
            Apache 2.0 · free forever · runs on{" "}
            <code className="text-fg-1">127.0.0.1</code> · zero telemetry
          </span>
          <VersionBadge>v0.2.0</VersionBadge>
        </div>
      </div>
    </section>
  );
}
