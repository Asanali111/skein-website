import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import SectionStrip from "@/components/SectionStrip";

export const metadata = {
  title: "Bench — Skein",
  description: "Head-to-head recall numbers for Skein vs Mem0 and Letta. Methodology, dataset, and reproducer included.",
};

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
          Same dataset, same query set, three context stores. Local-only, no cloud
          round-trip. Methodology and reproducer below — but first, the numbers.
        </p>
      </section>

      <SectionStrip label="results · placeholder" />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg-1 border border-divider rounded-lg p-6">
          <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
            skein
          </div>
          <div className="stat text-[2.75rem] text-fg-0 mb-1">0.89</div>
          <p className="font-mono text-xs text-fg-2">hit@5</p>
          <div className="stat text-[2rem] text-fg-0 mt-4">14ms</div>
          <p className="font-mono text-xs text-fg-2">recall p50</p>
        </div>
        <div className="bg-bg-1 border border-divider rounded-lg p-6">
          <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
            mem0
          </div>
          <div className="stat text-[2.75rem] text-fg-0 mb-1">0.72</div>
          <p className="font-mono text-xs text-fg-2">hit@5</p>
          <div className="stat text-[2rem] text-fg-0 mt-4">340ms</div>
          <p className="font-mono text-xs text-fg-2">recall p50 · cloud</p>
        </div>
        <div className="bg-bg-1 border border-divider rounded-lg p-6">
          <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
            letta
          </div>
          <div className="stat text-[2.75rem] text-fg-0 mb-1">0.68</div>
          <p className="font-mono text-xs text-fg-2">hit@5</p>
          <div className="stat text-[2rem] text-fg-0 mt-4">220ms</div>
          <p className="font-mono text-xs text-fg-2">recall p50 · cloud</p>
        </div>
      </section>

      <SectionStrip label="methodology" />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10">
        <p className="max-w-[44rem] text-[0.9375rem] text-fg-1 leading-[1.65]">
          Placeholder until the Mem0 adapter lands. Final dataset: ~6,000 fragments
          from real Skein-on-Skein dogfood sessions across iters 14–22, with a
          held-out query set of 240 retrievals labeled by the original session author.
          Hit@5 measures whether the gold-standard fragment is in the top 5 returned.
        </p>
        <p className="mt-6 font-mono text-xs text-fg-3">
          Reproducer + full numbers shipping in iter 22.2.
        </p>
      </section>

      <Footer />
    </main>
  );
}
