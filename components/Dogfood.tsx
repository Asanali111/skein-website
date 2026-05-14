export default function Dogfood() {
  return (
    <section className="bg-bg-0">
      <div className="max-w-content mx-auto px-8 sm:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-bg-1 border border-divider rounded-lg p-6 md:p-7">
            <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
              claude sonnet · may 13 2026
            </div>
            <h3 className="card-title text-xl text-fg-0 mb-4">
              Claude Sonnet now picks Skein first
            </h3>
            <blockquote className="quote-serif text-fg-0 text-lg sm:text-xl border-l-2 border-primary pl-4 mb-4">
              Let me start by calling the Skein tools as instructed (project_briefing
              and recall), then also look at the actual codebase.
            </blockquote>
            <p className="font-mono text-[0.75rem] text-fg-2 mb-5">
              — Sonnet&apos;s first thinking block when asked to analyze this project, May 13 2026
            </p>
            <ol className="font-mono text-[0.8125rem] text-fg-1 space-y-1 leading-relaxed">
              <li><span className="text-fg-3 mr-2">1.</span>ToolSearch</li>
              <li><span className="text-fg-3 mr-2">2.</span><span className="text-spark">mcp__skein__project_briefing</span></li>
              <li><span className="text-fg-3 mr-2">3.</span><span className="text-spark">mcp__skein__recall</span></li>
            </ol>
          </div>

          <div className="bg-bg-1 border border-divider rounded-lg p-6 md:p-7">
            <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
              gemini cli · same prompt
            </div>
            <h3 className="card-title text-xl text-fg-0 mb-2">
              Gemini CLI defaulted to read_file
            </h3>
            <p className="text-sm leading-[1.55] text-fg-1 mb-5">
              Same project. Same prompt. Same MCP available.
            </p>
            <ol className="font-mono text-[0.8125rem] text-fg-1 space-y-1 leading-relaxed">
              <li><span className="text-fg-3 mr-2">1.</span>Read README.md</li>
              <li><span className="text-fg-3 mr-2">2.</span>Read AGENTS.md</li>
              <li><span className="text-fg-3 mr-2">3.</span>Read pyproject.toml</li>
              <li><span className="text-fg-3 mr-2">4.</span>Read storage.py</li>
              <li><span className="text-fg-3 mr-2">5.</span>git log + grep</li>
              <li className="pt-1 text-fg-2">→ never called Skein</li>
            </ol>
          </div>
        </div>

        <p className="mt-6 max-w-[44rem] text-sm leading-[1.6] text-fg-1">
          <span className="font-medium text-fg-0">What changed:</span> we rewrote the MCP
          tool descriptions as promises with cost numbers, and led AGENTS.md with{" "}
          <code className="font-mono text-fg-0">&quot;use Skein first&quot;</code>. Same
          product, same APIs — different framing flipped behavior.{" "}
          <a
            href="https://github.com/Asanali111/skein/blob/main/docs/dogfood-iter-18.md"
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
