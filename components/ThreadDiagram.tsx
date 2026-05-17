"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Right-side hero diagram: 6 LLM names floating in the viewport, with
 * animated bezier "threads" weaving from each one into a single braided
 * spine — Skein's "one memory across every coding LLM" made visual.
 *
 * Pure SVG + CSS animations. No deps, ~3KB.
 */

const NODES = [
  { id: "claude",     label: "Claude Code", x: 92, y: 12 },
  { id: "cursor",     label: "Cursor",      x: 92, y: 28 },
  { id: "codex",      label: "Codex",       x: 92, y: 44 },
  { id: "gemini",     label: "Gemini CLI",  x: 92, y: 60 },
  { id: "antigrav",   label: "Antigravity", x: 92, y: 76 },
  { id: "opencode",   label: "opencode",    x: 92, y: 92 },
];

const SPINE_X = 60;
const SPINE_Y = 52;

export default function ThreadDiagram() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      setMouse({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Spine drifts toward cursor (capped) for subtle parallax.
  const spineDx = (mouse.x - 0.5) * 4;
  const spineDy = (mouse.y - 0.5) * 4;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute top-12 right-0 bottom-12 w-1/2 z-0 hidden lg:block"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="thread-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="#6d28d9" stopOpacity="0" />
            <stop offset="40%" stopColor="#6d28d9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="spine-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#a78bfa" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#6d28d9" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
          </radialGradient>
          <filter id="thread-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.15" />
          </filter>
        </defs>

        {/* Spine glow */}
        <circle
          cx={SPINE_X + spineDx}
          cy={SPINE_Y + spineDy}
          r="14"
          fill="url(#spine-glow)"
          className="skein-pulse"
        />

        {/* Threads from each node into the spine */}
        {NODES.map((n, i) => {
          const cx1 = (SPINE_X + n.x) / 2 + 6;
          const cy1 = n.y;
          const cx2 = (SPINE_X + n.x) / 2 - 6;
          const cy2 = SPINE_Y + spineDy;
          const d = `M ${n.x} ${n.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${SPINE_X + spineDx} ${SPINE_Y + spineDy}`;
          const active = hover === n.id;
          return (
            <g key={n.id}>
              <path
                d={d}
                stroke="url(#thread-grad)"
                strokeWidth={active ? 0.45 : 0.25}
                fill="none"
                filter="url(#thread-blur)"
                style={{
                  opacity: active ? 1 : 0.55,
                  transition: "opacity 200ms, stroke-width 200ms",
                }}
              />
              {/* Particle traveling along the thread */}
              <circle r="0.4" fill="#f3efe7">
                <animateMotion
                  dur={`${3.6 + i * 0.4}s`}
                  begin={`${i * 0.45}s`}
                  repeatCount="indefinite"
                  path={d}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur={`${3.6 + i * 0.4}s`}
                  begin={`${i * 0.45}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* Spine core */}
        <circle
          cx={SPINE_X + spineDx}
          cy={SPINE_Y + spineDy}
          r="1.2"
          fill="#f3efe7"
        />
      </svg>

      {/* Node labels (HTML, so they read crisp) */}
      <div className="absolute inset-0 pointer-events-auto">
        {NODES.map((n) => (
          <div
            key={n.id}
            onMouseEnter={() => setHover(n.id)}
            onMouseLeave={() => setHover(null)}
            className="absolute -translate-y-1/2 font-mono text-[0.6875rem] tracking-[0.04em] text-fg-2 hover:text-fg-0 transition-colors cursor-default select-none"
            style={{ left: `calc(${n.x}% - 0.5rem)`, top: `${n.y}%`, transform: "translate(-100%, -50%)" }}
          >
            <span className="px-2 py-1 rounded border border-divider bg-bg-1/70 backdrop-blur-sm">
              {n.label}
            </span>
          </div>
        ))}
        {/* Spine label */}
        <div
          className="absolute font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-3"
          style={{
            left: `${SPINE_X + spineDx}%`,
            top: `calc(${SPINE_Y + spineDy}% + 1.25rem)`,
            transform: "translateX(-50%)",
          }}
        >
          skein · 127.0.0.1
        </div>
      </div>

      <style jsx>{`
        :global(.skein-pulse) {
          animation: pulse 3.2s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.skein-pulse) { animation: none; }
        }
      `}</style>
    </div>
  );
}
