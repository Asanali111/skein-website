"use client";

import { useEffect, useRef, useState } from "react";

type Frame = {
  cmd: string;
  out: string[]; // each entry is a line; "" for blank
};

const FRAMES: Frame[] = [
  {
    cmd: "wevex briefing",
    out: [
      "scope: project:wevex",
      "fragments: 64 · chunks: 706 · uptime 12m",
      "▸ daemon ready · embedding: fastembed (bge-small) · 384-dim",
      "recent decisions:",
      "  46e9ae9e · switch retrieval to RRF, drop hash provider",
      "  c3b19bee · drop transport key from codex+opencode configs",
      "  iter23   · default embedding flips bm25 → fastembed",
    ],
  },
  {
    cmd: "wevex recall \"how do we install on a clean machine?\"",
    out: [
      "▸ 4 fragments · top score 0.91",
      "[0.91] decision/iter-22  pipx is the default install path",
      "[0.84] doc/install.md    one-line: `pipx install wevex --python python3.12 && wevex up`",
      "[0.72] decision/iter-18  rewrote MCP descriptions as promises",
      "[0.69] readme            zero-config; daemon runs on 127.0.0.1",
    ],
  },
  {
    cmd: "claude -p \"summarize this project\"",
    out: [
      "▸ Claude Sonnet picks tools:",
      "  1. mcp__wevex__project_briefing",
      "  2. mcp__wevex__recall",
      "▸ done in 64s · 49 input + 533k cache_read + 587 output tok",
      "▸ never read a source file. context came from the bus.",
    ],
  },
];

const TYPE_MS = 38;
const LINE_MS = 90;
const HOLD_MS = 2600;

export default function LiveTerminal() {
  const [frameIdx, setFrameIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [outLines, setOutLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<"typing" | "running" | "hold">("typing");
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const frame = FRAMES[frameIdx];
    let cancelled = false;

    const clear = () => { if (timer.current) window.clearTimeout(timer.current); };

    if (phase === "typing") {
      if (typed.length < frame.cmd.length) {
        timer.current = window.setTimeout(() => {
          if (!cancelled) setTyped(frame.cmd.slice(0, typed.length + 1));
        }, TYPE_MS + Math.random() * 30);
      } else {
        timer.current = window.setTimeout(() => {
          if (!cancelled) setPhase("running");
        }, 380);
      }
    } else if (phase === "running") {
      if (outLines.length < frame.out.length) {
        timer.current = window.setTimeout(() => {
          if (!cancelled) setOutLines(frame.out.slice(0, outLines.length + 1));
        }, LINE_MS);
      } else {
        timer.current = window.setTimeout(() => {
          if (!cancelled) setPhase("hold");
        }, HOLD_MS);
      }
    } else if (phase === "hold") {
      timer.current = window.setTimeout(() => {
        if (cancelled) return;
        setTyped("");
        setOutLines([]);
        setPhase("typing");
        setFrameIdx((i) => (i + 1) % FRAMES.length);
      }, 400);
    }

    return () => { cancelled = true; clear(); };
  }, [typed, outLines, phase, frameIdx, paused]);

  const restart = () => {
    setTyped("");
    setOutLines([]);
    setPhase("typing");
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="pixel-corner-lg relative bg-bg-3 border-l-2 border-primary mt-4 font-mono text-[0.78rem] leading-[1.6] text-fg-1 overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-divider/60 bg-bg-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-fg-3" />
          <span className="w-2 h-2 rounded-full bg-fg-3" />
          <span className="w-2 h-2 rounded-full bg-spark/70" />
          <span className="ml-3 text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
            ~/wevex
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.625rem] tracking-[0.1em] uppercase text-fg-3">
            {paused ? "paused" : `${frameIdx + 1}/${FRAMES.length}`}
          </span>
          <button
            type="button"
            onClick={restart}
            aria-label="restart demo"
            className="text-fg-3 hover:text-fg-1 text-[0.625rem] uppercase tracking-[0.1em] transition-colors"
          >
            replay
          </button>
        </div>
      </div>

      <pre className="px-[1rem] py-[0.875rem] whitespace-pre-wrap min-h-[12rem]">
        <span className="text-primary">$ </span>
        <span className="text-fg-0">{typed}</span>
        {phase === "typing" && <Caret />}
        {(phase === "running" || phase === "hold") && (
          <>
            {"\n"}
            {outLines.map((line, i) => (
              <span key={i} className={lineClass(line)}>
                {line}
                {"\n"}
              </span>
            ))}
            {phase === "hold" && (
              <span className="text-fg-3">{"\n"}$ <Caret /></span>
            )}
          </>
        )}
      </pre>
    </div>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="inline-block w-[0.5em] h-[1em] align-text-bottom bg-fg-0 ml-[1px] wevex-caret"
    />
  );
}

function lineClass(line: string): string {
  if (line.startsWith("▸")) return "text-spark";
  if (line.startsWith("[0.")) return "text-fg-0";
  if (line.trim().startsWith("iter")) return "text-fg-0";
  return "text-fg-1";
}
