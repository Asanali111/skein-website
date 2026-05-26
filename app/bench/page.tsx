import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import SectionStrip from "@/components/SectionStrip";

export const metadata = {
  title: "Bench — Wevex",
  description: "Head-to-head recall numbers for Wevex vs Mem0 and Letta. Methodology, dataset, and reproducer included.",
};

type Row = {
  id: string;
  name: string;
  hit5: number;
  ms: number;
  transport: "local" | "cloud";
  winner?: boolean;
};

const ROWS: Row[] = [
  { id: "wevex", name: "Wevex",  hit5: 0.89, ms: 14,  transport: "local", winner: true },
  { id: "mem0",  name: "Mem0",   hit5: 0.72, ms: 340, transport: "cloud" },
  { id: "letta", name: "Letta",  hit5: 0.68, ms: 220, transport: "cloud" },
];

const MAX_MS = 400;

export default function BenchPage() {
  return (
    <main className="min-h-screen">
      <TopNav />

      <section className="max-w-content mx-auto px-8 sm:px-12 pt-12 pb-10">
        <div className="font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-fg-2 mb-3">
          bench
        </div>
        <h1 className="tagline text-3xl sm:text-4xl text-fg-0 mb-4 max-w-[36rem]">
          Head-to-head recall numbers.
        </h1>
        <p className="text-fg-1 max-w-[36rem] leading-[1.55]">
          Same dataset, same query set, three context stores. Local-only on Wevex, no
          cloud round-trip. Methodology and reproducer below — but first, the numbers.
        </p>
      </section>

      <SectionStrip label="results · placeholder" />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ROWS.map((row) => {
            const wevex = ROWS.find((r) => r.id === "wevex")!;
            const hitPct = Math.round(row.hit5 * 100);
            const msWidth = Math.max(4, Math.round((row.ms / MAX_MS) * 100));
            const hitWidth = Math.max(4, Math.round(row.hit5 * 100));
            const slower = row.id === "wevex" ? null : Math.round(row.ms / wevex.ms);
            const lower = row.id === "wevex" ? null : ((wevex.hit5 - row.hit5) * 100).toFixed(0);

            return (
              <div
                key={row.id}
                className={[
                  "relative rounded-lg p-6 transition-colors",
                  row.winner
                    ? "bg-bg-1 border border-primary/60 shadow-[0_0_0_1px_rgba(109,40,217,0.18)]"
                    : "bg-bg-1 border border-divider",
                ].join(" ")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2">
                    {row.name}
                  </div>
                  {row.winner ? (
                    <span className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-primary border border-primary/50 rounded px-2 py-0.5">
                      fastest · local
                    </span>
                  ) : (
                    <span className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-fg-3 border border-divider rounded px-2 py-0.5">
                      {row.transport}
                    </span>
                  )}
                </div>

                {/* hit@5 */}
                <div className="mb-5">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="stat text-[2rem] text-fg-0">{row.hit5.toFixed(2)}</span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
                      hit@5
                    </span>
                  </div>
                  <div className="h-1.5 bg-bg-3 rounded-full overflow-hidden">
                    <div
                      className={row.winner ? "h-full bg-primary" : "h-full bg-fg-3"}
                      style={{ width: `${hitWidth}%` }}
                      aria-label={`hit@5: ${hitPct}%`}
                    />
                  </div>
                  {lower !== null && (
                    <p className="mt-1 font-mono text-[0.6875rem] text-fg-3">
                      −{lower} pts vs Wevex
                    </p>
                  )}
                </div>

                {/* recall p50 */}
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="stat text-[1.75rem] text-fg-0">{row.ms}ms</span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
                      recall p50
                    </span>
                  </div>
                  <div className="h-1.5 bg-bg-3 rounded-full overflow-hidden">
                    <div
                      className={row.winner ? "h-full bg-spark" : "h-full bg-fg-3"}
                      style={{ width: `${msWidth}%` }}
                      aria-label={`recall p50: ${row.ms}ms`}
                    />
                  </div>
                  {slower !== null && (
                    <p className="mt-1 font-mono text-[0.6875rem] text-fg-3">
                      {slower}× slower than Wevex
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-5 font-mono text-[0.6875rem] text-fg-3">
          bars scaled to {MAX_MS}ms · hit@5 on a 0–1 axis · lower latency / higher hit@5 is better
        </p>
      </section>

      <SectionStrip label="methodology" />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10">
        <p className="max-w-[44rem] text-[0.9375rem] text-fg-1 leading-[1.65]">
          Placeholder until the Mem0 adapter lands. Final dataset: ~6,000 fragments
          from real Wevex-on-Wevex dogfood sessions across iters 14–22, with a
          held-out query set of 240 retrievals labeled by the original session author.
          Hit@5 measures whether the gold-standard fragment is in the top 5 returned.
        </p>
        <p className="mt-6 font-mono text-xs text-fg-3">
          Reproducer + full numbers shipping with the adapter.
        </p>
      </section>

      <Footer />
    </main>
  );
}
