import Card, { CardBody, CardLabel, CardTitle } from "./Card";
import Terminal, { Cmd, Ok } from "./Terminal";

export default function WhatItDoes() {
  return (
    <section id="what-it-does" className="bg-bg-0">
      <div className="max-w-content mx-auto px-8 sm:px-12 py-12 grid gap-4">
        <Card className="grid-cols-1">
          <CardLabel>live · briefing</CardLabel>
          <CardTitle>One call returns the entire project&apos;s state.</CardTitle>
          <CardBody>
            Recent decisions, fragment counts, daemon health, and what to do next.
            Designed for LLMs reading their first message — pulls 5+{" "}
            <code className="font-mono text-fg-0">read_file</code> calls down to one.
          </CardBody>
          <Terminal>
            <Cmd>$ skein briefing</Cmd>
            {"\n"}scope: project:skein
            {"\n"}fragments: 64 · chunks: 706 · uptime 12m
            {"\n"}<Ok>▸ daemon ready</Ok> · embedding: gemini · provider: gemini-001
            {"\n"}recent decisions:
            {"\n"}  46e9ae9e · &quot;switch retrieval to RRF, drop hash provider&quot;
            {"\n"}  c3b19bee · &quot;drop transport key from codex+opencode configs&quot;
          </Terminal>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardLabel>cross-session handoff</CardLabel>
            <CardTitle>Claude wrote it. Cursor recalls it.</CardTitle>
            <CardBody>
              Every decision, fact, and observation flows through one local bus.
              Switch tools mid-task without losing context.
            </CardBody>
          </Card>

          <Card>
            <CardLabel>bench</CardLabel>
            <div className="flex items-end gap-6 mb-3">
              <div className="flex items-end">
                <span className="stat text-[2.25rem] text-fg-0">14ms</span>
                <span className="font-mono text-sm text-fg-2 ml-1 mb-1">recall p50</span>
              </div>
              <div className="flex items-end">
                <span className="stat text-[2.25rem] text-fg-0">0.89</span>
                <span className="font-mono text-sm text-fg-2 ml-1 mb-1">hit@5</span>
              </div>
            </div>
            <CardBody>
              vs Mem0 0.72 · Letta 0.68. Local-only, no cloud round-trip.
            </CardBody>
            <p className="mt-3 font-mono text-[0.6875rem] text-fg-3 leading-[1.5]">
              Numbers from our internal bench. Full methodology at{" "}
              <a href="/bench" className="text-fg-2 hover:text-fg-0 underline decoration-divider hover:decoration-primary">
                /bench
              </a>{" "}
              (coming).
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
