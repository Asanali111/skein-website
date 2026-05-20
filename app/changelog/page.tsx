import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import SectionStrip from "@/components/SectionStrip";

type EntryKind = "perf" | "breaking" | "feature" | "fix" | "security" | "refactor" | "docs";

type Highlight = { label: string; value: string };

type Entry = {
  iter: string;
  date: string;
  kind: EntryKind;
  title: string;
  body: string;
  highlights?: Highlight[];
};

const KIND_STYLE: Record<EntryKind, { label: string; cls: string }> = {
  perf:     { label: "perf",     cls: "text-spark border-spark/40" },
  breaking: { label: "breaking", cls: "text-primary border-primary/50" },
  feature:  { label: "feature",  cls: "text-primary border-primary/40" },
  fix:      { label: "fix",      cls: "text-[#cc785c] border-[#cc785c]/40" },
  security: { label: "security", cls: "text-[#cc785c] border-[#cc785c]/40" },
  refactor: { label: "refactor", cls: "text-fg-1 border-divider" },
  docs:     { label: "docs",     cls: "text-fg-2 border-divider" },
};

const ENTRIES: Entry[] = [
  {
    iter: "iter 28",
    date: "2026-05-20",
    kind: "perf",
    title: "warm-path under 1s · Windows port",
    body:
      "Vectorised vector_search via batched matmul, added a 128-entry LRU on embed_one, made fastembed ONNX load lazy, and moved scanner sweeps off the foreground onto a daemon-side passive loop. Skein up now skips ingest if the daemon was already healthy. Windows gets a Scheduled Task backend with reboot persistence + RestartOnFailure, matching launchd's KeepAlive on macOS.",
    highlights: [
      { label: "warm skein up",   value: "4–7s → 800ms" },
      { label: "recall warm p50", value: "180ms → 51ms (3.5×)" },
      { label: "project_briefing", value: "100–180ms → 5–45ms" },
    ],
  },
  {
    iter: "iter 27",
    date: "2026-05-18",
    kind: "breaking",
    title: "fastembed is the only semantic provider",
    body:
      "Deleted GeminiEmbeddingProvider (the sync-on-async retry path was wedging the asyncio event loop). Fastembed (BAAI/bge-small-en-v1.5, 384-dim, local) is the default; OpenAI is the opt-in cloud option. Legacy configs that still name embedding_provider=gemini auto-migrate to fastembed on next load. Every embed call is now wrapped in asyncio.to_thread, so /health stays responsive during cold model warm-up.",
    highlights: [
      { label: "/health during embed", value: "9–22ms" },
      { label: "deleted",              value: "213 LoC of retry code" },
      { label: "tests",                value: "551 passing" },
    ],
  },
  {
    iter: "iter 26",
    date: "2026-05-17",
    kind: "refactor",
    title: "CLI surface collapsed · 50 → 10 commands",
    body:
      "Visible commands: up · down · restart · status · doctor · tail · briefing · tui · config · connect. The 27 retired commands are still wired (hidden from --help) for a one-week dogfood window. Daemon now auto-regenerates AGENTS.md when fragments change and auto-approves inbox items ≥ 0.85 confidence. New agent-facing MCP tools: boost, bury, archaeology — no CLI surface, the agent invokes them from natural language.",
    highlights: [
      { label: "visible commands", value: "50 → 10" },
      { label: "new MCP tools",    value: "3" },
      { label: "tests",            value: "530 → 561" },
    ],
  },
  {
    iter: "iter 25",
    date: "2026-05-12",
    kind: "feature",
    title: "fragment value ranking · phases 1+2",
    body:
      "Every fragment now carries a [0.05, 1.0] value score derived from provenance (user-typed remember ≫ passive observation), type, and content rubrics. Recall multiplies RRF score by value post-fusion, demoting tool-event noise below user-marked decisions without hiding anything. Backfill recomputes value for every existing row in a single transaction.",
    highlights: [
      { label: "new column", value: "fragments.value REAL DEFAULT 0.5" },
      { label: "new tests",  value: "+21" },
    ],
  },
  {
    iter: "iter 24",
    date: "2026-05-08",
    kind: "feature",
    title: "honest recall quality · inbox auto-approve",
    body:
      "Replaced the opaque RRF score (clustered at 0.016, always) with a quality enum — high / medium / low / none — derived from raw cosine similarity. When the top hit is quality=none, Skein admits it has no high-signal context for that query. New skein inbox auto-approve --min-confidence 0.85 drains 173+ stale extraction candidates.",
    highlights: [
      { label: "cosine buckets", value: "≥0.65 high · ≥0.50 medium · ≥0.35 low" },
      { label: "drained",         value: "173 inbox items" },
    ],
  },
  {
    iter: "iter 23",
    date: "2026-04-30",
    kind: "breaking",
    title: "fastembed becomes the default",
    body:
      "Swapped the BM25-only default for hybrid retrieval (BM25 + 384-dim local vectors). No API key required, ~130 MB one-time model download. Adds name + requires_api_key on every EmbeddingProvider, plus a daemon-startup dimension-mismatch warning when the stored index disagrees with the configured provider.",
    highlights: [
      { label: "provider", value: "bm25 → fastembed (local)" },
      { label: "vector dim", value: "384" },
    ],
  },
  {
    iter: "iter 22",
    date: "2026-05-14",
    kind: "docs",
    title: "marketing website rebuild",
    body:
      "Warm-gray palette, plum + sage accents, Fraunces + IBM Plex type. Per-client integration pages. Light/dark first-class.",
  },
  {
    iter: "iter 18.6",
    date: "2026-04-29",
    kind: "fix",
    title: "drop transport key from codex+opencode configs",
    body:
      "Both Codex CLI and opencode infer MCP transport from the presence of url vs command — explicit transport: \"http\" was producing schema warnings.",
  },
  {
    iter: "iter 18.1",
    date: "2026-04-22",
    kind: "fix",
    title: "gemini cli config fix",
    body:
      "Removed transport key from ~/.gemini/settings.json — Gemini CLI was logging \"Unrecognized key(s)\" on startup.",
  },
  {
    iter: "iter 16",
    date: "2026-04-08",
    kind: "security",
    title: "rotated bearer token leaked in older codex configs",
    body:
      "Security sweep caught a stale skein-bearer in pre-rotation .codex/config.toml files. Added _strip_codex_skein_block to rewrite on every connect.",
  },
  {
    iter: "iter 14",
    date: "2026-03-19",
    kind: "feature",
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
          Most recent first.
        </p>
      </section>

      <SectionStrip label="timeline" />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10">
        <ol className="relative border-l border-divider ml-3 sm:ml-4">
          {ENTRIES.map((e) => {
            const kind = KIND_STYLE[e.kind];
            return (
              <li
                key={e.iter + e.title}
                className="relative pl-6 sm:pl-8 pb-7 last:pb-0"
              >
                <span
                  className={[
                    "absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full border",
                    e.kind === "perf" ? "bg-spark border-spark" :
                    e.kind === "breaking" || e.kind === "feature" ? "bg-primary border-primary" :
                    e.kind === "fix" || e.kind === "security" ? "bg-[#cc785c] border-[#cc785c]" :
                    "bg-bg-0 border-fg-3",
                  ].join(" ")}
                  aria-hidden
                />

                <div className="bg-bg-1 border border-divider rounded-lg p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2">
                        {e.iter}
                      </span>
                      <span className="font-mono text-[0.6875rem] text-fg-3">{e.date}</span>
                    </div>
                    <span
                      className={[
                        "font-mono text-[0.625rem] tracking-[0.12em] uppercase border rounded px-2 py-0.5",
                        kind.cls,
                      ].join(" ")}
                    >
                      {kind.label}
                    </span>
                  </div>

                  <h3 className="card-title text-lg text-fg-0 mb-2">{e.title}</h3>
                  <p className="text-sm text-fg-1 leading-[1.6]">{e.body}</p>

                  {e.highlights && (
                    <dl className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-divider">
                      {e.highlights.map((h) => (
                        <div key={h.label}>
                          <dt className="font-mono text-[0.625rem] tracking-[0.1em] uppercase text-fg-3 mb-1">
                            {h.label}
                          </dt>
                          <dd className="font-mono text-[0.8125rem] text-fg-0">
                            {h.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-2 font-mono text-xs text-fg-3">
          Older iters in the GitHub commit log →{" "}
          <a
            href="https://github.com/Asanali111/skein/commits/main"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-2 hover:text-primary underline decoration-divider hover:decoration-primary"
          >
            github.com/Asanali111/skein
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
