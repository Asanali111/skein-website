import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import SectionStrip from "@/components/SectionStrip";

type Entry = {
  iter: string;
  date: string;
  title: string;
  body: string;
};

const ENTRIES: Entry[] = [
  {
    iter: "iter 22",
    date: "2026-05-14",
    title: "marketing website rebuild",
    body:
      "Warm-gray palette, plum + sage accents, Fraunces + IBM Plex type. Per-client integration pages. Light/dark first-class.",
  },
  {
    iter: "iter 18.6",
    date: "2026-04-29",
    title: "drop transport key from codex+opencode configs",
    body:
      "Both Codex CLI and opencode infer MCP transport from the presence of `url` vs `command` — explicit `transport: \"http\"` was producing schema warnings.",
  },
  {
    iter: "iter 18.1",
    date: "2026-04-22",
    title: "gemini cli config fix",
    body:
      "Removed `transport` key from `~/.gemini/settings.json` — Gemini CLI was logging \"Unrecognized key(s)\" on startup.",
  },
  {
    iter: "iter 16",
    date: "2026-04-08",
    title: "rotated bearer token leaked in older codex configs",
    body:
      "Security sweep caught a stale skein-bearer in pre-rotation .codex/config.toml files. Added `_strip_codex_skein_block` to rewrite on every connect.",
  },
  {
    iter: "iter 14",
    date: "2026-03-19",
    title: "switch retrieval to RRF, drop hash provider as default",
    body:
      "Reciprocal Rank Fusion across two indexes produced cleaner recall than the lexical-only path. Hash provider remains opt-in for fully offline installs.",
  },
];

export const metadata = {
  title: "Changelog — Skein",
  description: "Per-iteration release notes for Skein, the local-first context bus for coding LLMs.",
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen">
      <TopNav />

      <section className="max-w-content mx-auto px-8 sm:px-12 pt-12 pb-10">
        <div className="font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-fg-2 mb-3">
          changelog
        </div>
        <h1 className="tagline text-3xl sm:text-4xl text-fg-0 mb-4 max-w-[36rem]">
          Every iteration, every change.
        </h1>
        <p className="text-fg-1 max-w-[36rem] leading-[1.55]">
          Skein ships per iter — small, atomic, named after the work they encode.
          Auto-pulled from the company-brain repo&apos;s commits in a future iter.
        </p>
      </section>

      <SectionStrip label="recent" />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10">
        <ul className="space-y-6">
          {ENTRIES.map((e) => (
            <li key={e.iter + e.title} className="bg-bg-1 border border-divider rounded-lg p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2">
                  {e.iter}
                </div>
                <div className="font-mono text-[0.6875rem] text-fg-3">{e.date}</div>
              </div>
              <h3 className="card-title text-lg text-fg-0 mb-2">{e.title}</h3>
              <p className="text-sm text-fg-1 leading-[1.6]">{e.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-mono text-xs text-fg-3">
          Older iters in the GitHub commit log →{" "}
          <a
            href="https://github.com/Asanali111/skein/commits/main"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-2 hover:text-primary"
          >
            github.com/Asanali111/skein
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
