import Card, { CardBody, CardLabel, CardTitle } from "./Card";
import LiveTerminal from "./LiveTerminal";

export default function WhatItDoes() {
  return (
    <section id="what-it-does" className="bg-bg-0">
      <div className="max-w-content mx-auto px-8 sm:px-12 py-12 grid gap-4">
        <Card className="grid-cols-1">
          <CardLabel>see it · briefing · recall · handoff</CardLabel>
          <CardTitle>One call returns the entire project&apos;s state.</CardTitle>
          <CardBody>
            Recent decisions, fragment counts, daemon health, and what to do next.
            Designed for LLMs reading their first message — collapses 5+{" "}
            <code className="font-mono text-fg-0">read_file</code> calls into one. Hover the
            terminal to pause.
          </CardBody>
          <LiveTerminal />
        </Card>

        <Card>
          <CardLabel>cross-session handoff · live example</CardLabel>
          <CardTitle>Claude wrote it. Cursor already knows.</CardTitle>
          <CardBody>
            Every decision, fact, and observation flows through one local bus.
            Switch tools mid-task — the next one picks up where the last one left off.
          </CardBody>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-3 md:gap-4">
            <div className="bg-bg-2 border border-divider rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#cc785c]" aria-hidden />
                <span className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-fg-2">
                  claude code · 10:24 am
                </span>
              </div>
              <p className="font-mono text-[0.8125rem] leading-[1.55] text-fg-1">
                <span className="text-fg-3">{`> `}</span>
                <span className="text-spark">remember</span>
                <span className="text-fg-2">(</span>
                &quot;use <span className="text-fg-0">authV2</span> — old one drops sessions on retry&quot;
                <span className="text-fg-2">)</span>
              </p>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center text-fg-3">
              <span className="font-mono text-[0.625rem] tracking-[0.12em] uppercase mb-1">
                127.0.0.1
              </span>
              <span aria-hidden className="text-lg">→</span>
            </div>
            <div className="md:hidden flex items-center justify-center text-fg-3 my-1">
              <span aria-hidden>↓</span>
              <span className="font-mono text-[0.625rem] tracking-[0.12em] uppercase ml-2">
                127.0.0.1
              </span>
            </div>

            <div className="bg-bg-2 border border-divider rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5fb3b3]" aria-hidden />
                <span className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-fg-2">
                  cursor · 10:53 am · new session
                </span>
              </div>
              <p className="font-mono text-[0.8125rem] leading-[1.55] text-fg-1">
                <span className="text-fg-3">{`> `}</span>
                <span className="text-spark">recall</span>
                <span className="text-fg-2">(</span>&quot;auth retry&quot;<span className="text-fg-2">)</span>
                <br />
                <span className="text-fg-3">  →</span> use <span className="text-fg-0">authV2</span> — old one drops sessions on retry
              </p>
            </div>
          </div>

          <p className="mt-4 font-mono text-[0.6875rem] text-fg-3">
            no copy-paste · no cloud round-trip · no &quot;catch me up on what we did&quot;
          </p>
        </Card>
      </div>
    </section>
  );
}
