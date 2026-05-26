import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import SectionStrip from "@/components/SectionStrip";

export const metadata = {
  title: "Security — Wevex",
  description: "Wevex is Apache-2.0, free forever, and local-first. The daemon binds to 127.0.0.1. Your code never leaves the laptop unless you wire it to.",
};

export default function SecurityPage() {
  return (
    <main className="min-h-screen">
      <TopNav />

      <section className="max-w-content mx-auto px-8 sm:px-12 pt-12 pb-10">
        <div className="font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-fg-2 mb-3">
          security
        </div>
        <h1 className="tagline text-3xl sm:text-4xl text-fg-0 mb-4 max-w-[36rem]">
          Apache-2.0. Free forever. Local-first by default.
        </h1>
        <p className="text-fg-1 max-w-[36rem] leading-[1.55]">
          Wevex&apos;s threat model is &quot;everything stays on{" "}
          <code className="font-mono text-fg-0">127.0.0.1</code> unless you explicitly wire
          in something else.&quot; No paid tier. No telemetry. No vendor lock-in.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 font-mono text-[0.625rem] tracking-[0.12em] uppercase">
          <span className="text-primary border border-primary/50 rounded px-2 py-1">
            apache 2.0
          </span>
          <span className="text-fg-2 border border-divider rounded px-2 py-1">
            no paid tier
          </span>
          <span className="text-fg-2 border border-divider rounded px-2 py-1">
            no telemetry
          </span>
          <span className="text-fg-2 border border-divider rounded px-2 py-1">
            127.0.0.1
          </span>
        </div>
      </section>

      <SectionStrip label="what stays local" />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-bg-1 border border-divider rounded-lg p-6">
          <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
            default install · everyone
          </div>
          <h3 className="card-title text-lg text-fg-0 mb-2">Everything.</h3>
          <ul className="text-sm text-fg-1 leading-[1.7] mt-2 space-y-1.5">
            <li>
              <span className="text-spark">✓</span>{" "}
              <span className="text-fg-0">Source code chunks</span> — never leave disk.
            </li>
            <li>
              <span className="text-spark">✓</span>{" "}
              <span className="text-fg-0">Decisions, observations, recall queries</span> —
              local SQLite at <code className="font-mono text-fg-0">~/.wevex/</code>.
            </li>
            <li>
              <span className="text-spark">✓</span>{" "}
              <span className="text-fg-0">Embeddings</span> — local fastembed
              (BAAI/bge-small-en-v1.5, 384-dim, no API key).
            </li>
            <li>
              <span className="text-spark">✓</span>{" "}
              <span className="text-fg-0">Bearer token</span> — generated per machine,
              never reused, never phoned home.
            </li>
          </ul>
        </div>
        <div className="bg-bg-1 border border-divider rounded-lg p-6">
          <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
            opt-in · only if you choose
          </div>
          <h3 className="card-title text-lg text-fg-0 mb-2">What you can wire in.</h3>
          <ul className="text-sm text-fg-1 leading-[1.7] mt-2 space-y-1.5">
            <li>
              <span className="text-fg-3">○</span>{" "}
              <span className="text-fg-0">Cloud embeddings</span> — bring your own OpenAI
              key, chunks are sent to OpenAI for embedding only.
            </li>
            <li>
              <span className="text-fg-3">○</span>{" "}
              <span className="text-fg-0">Telemetry</span> — off by default, opt-in via{" "}
              <code className="font-mono text-fg-0">wevex config</code>, anonymous when on.
            </li>
          </ul>
          <p className="mt-4 font-mono text-[0.6875rem] text-fg-3 leading-[1.55]">
            Both are explicit choices the user makes. Wevex never auto-detects an API key
            and silently starts shipping data.
          </p>
        </div>
      </section>

      <SectionStrip label="bearer token" />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start max-w-[52rem]">
          <p className="text-[0.9375rem] text-fg-1 leading-[1.65]">
            Generated on first launch and stored at{" "}
            <code className="font-mono text-fg-0">~/.config/wevex/token</code> with{" "}
            <code className="font-mono text-fg-0">0600</code> permissions. Required for
            every MCP request — even from <code className="font-mono text-fg-0">127.0.0.1</code> —
            so other local processes can&apos;t talk to the daemon without permission.
          </p>
          <pre className="bg-bg-2 border-l-2 border-primary rounded-md font-mono text-[0.75rem] leading-[1.6] text-fg-1 px-4 py-3 overflow-x-auto whitespace-pre">
{`$ wevex rotate-token
✓ new token written to ~/.config/wevex/token
✓ daemon restarted, clients re-wired`}
          </pre>
        </div>
      </section>

      <SectionStrip label="open source" />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10">
        <p className="max-w-[44rem] text-[0.9375rem] text-fg-1 leading-[1.65]">
          Every line is on GitHub under Apache 2.0 — daemon, CLI, MCP server,
          retrieval, embeddings. Audit it yourself, or read the threat-model write-up
          and SBOM in the repo.
        </p>
        <p className="mt-4">
          <a
            href="https://github.com/Asanali111/wevex"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-fg-2 hover:text-primary underline decoration-divider hover:decoration-primary"
          >
            github.com/Asanali111/wevex →
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
