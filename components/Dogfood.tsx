export default function Dogfood() {
  return (
    <section className="bg-bg-0">
      <div className="max-w-content mx-auto px-8 sm:px-12 py-12">
        <div className="max-w-[44rem] mb-7">
          <p className="font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-fg-2 mb-2">
            same project · same prompt · same MCP wired in
          </p>
          <h2 className="tagline text-2xl sm:text-3xl text-fg-0 mb-3">
            We rewrote the framing. Every client picked Wevex first.
          </h2>
          <p className="text-fg-1 leading-[1.55]">
            Before iter 18, agents would default to{" "}
            <code className="font-mono text-fg-0">read_file</code> even with Wevex installed.
            We rewrote the MCP tool descriptions as promises with cost numbers and led
            <code className="font-mono text-fg-0"> AGENTS.md</code> with{" "}
            <code className="font-mono text-fg-0">&quot;use Wevex first&quot;</code>. Same
            product, same APIs — the framing flipped behaviour across every client.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-bg-1 border border-divider rounded-lg p-6 md:p-7 relative">
            <div className="absolute top-5 right-5 font-mono text-[0.625rem] tracking-[0.12em] uppercase text-fg-3 border border-divider rounded px-2 py-0.5">
              before · iter 17
            </div>
            <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
              baseline · any client
            </div>
            <h3 className="card-title text-xl text-fg-0 mb-4">
              Five file reads. Never called Wevex.
            </h3>
            <ol className="font-mono text-[0.8125rem] text-fg-1 space-y-1 leading-relaxed">
              <li><span className="text-fg-3 mr-2">1.</span>Read README.md</li>
              <li><span className="text-fg-3 mr-2">2.</span>Read AGENTS.md</li>
              <li><span className="text-fg-3 mr-2">3.</span>Read pyproject.toml</li>
              <li><span className="text-fg-3 mr-2">4.</span>Read storage.py</li>
              <li><span className="text-fg-3 mr-2">5.</span>git log + grep</li>
              <li className="pt-1 text-fg-2">→ <span className="text-fg-3">~3000 tokens, five round-trips, missed the why</span></li>
            </ol>
          </div>

          <div className="bg-bg-1 border border-primary/60 rounded-lg p-6 md:p-7 relative shadow-[0_0_0_1px_rgba(109,40,217,0.15)]">
            <div className="absolute top-5 right-5 font-mono text-[0.625rem] tracking-[0.12em] uppercase text-spark border border-spark/40 rounded px-2 py-0.5">
              after · iter 18+
            </div>
            <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
              claude · cursor · gemini cli · codex
            </div>
            <h3 className="card-title text-xl text-fg-0 mb-4">
              Wevex first. Source second.
            </h3>
            <ol className="font-mono text-[0.8125rem] text-fg-1 space-y-1 leading-relaxed">
              <li><span className="text-fg-3 mr-2">1.</span><span className="text-spark">mcp__wevex__project_briefing</span></li>
              <li><span className="text-fg-3 mr-2">2.</span><span className="text-spark">mcp__wevex__recall</span></li>
              <li><span className="text-fg-3 mr-2">3.</span>Read storage.py <span className="text-fg-3">(only the file the briefing pointed to)</span></li>
              <li className="pt-1 text-fg-2">→ <span className="text-fg-0">~400 tokens, one round-trip, kept the why</span></li>
            </ol>
          </div>
        </div>

        <blockquote className="quote-serif text-fg-0 text-lg sm:text-xl border-l-2 border-primary pl-4 mt-7 max-w-[44rem]">
          Let me start by calling the Wevex tools as instructed (project_briefing
          and recall), then also look at the actual codebase.
        </blockquote>
        <p className="mt-2 font-mono text-[0.75rem] text-fg-2 max-w-[44rem]">
          — Claude Sonnet&apos;s first thinking block when handed this repo, May 13 2026.
          The same framing pattern works in Cursor, Gemini CLI, and Codex.
        </p>

        <p className="mt-6">
          <a
            href="https://github.com/Asanali111/wevex/blob/main/docs/dogfood-iter-18.md"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-fg-2 hover:text-primary underline decoration-divider hover:decoration-primary"
          >
            read the full dogfood doc →
          </a>
        </p>
      </div>
    </section>
  );
}
