"use client";

import { useEffect, useRef } from "react";

/**
 * PixelLoom — a chunky pixel-art weaving loom for the hero.
 *
 * Renders at a small logical resolution (160×120 pixels) and is scaled up
 * with `image-rendering: pixelated` so each drawn pixel becomes a chunky
 * 4-6px on-screen block. Single requestAnimationFrame loop, no React
 * state updates per frame, no SVG filters, no backdrop-blur.
 *
 * Composition: a central pixel "skein" (yarn ball) sprite. Six threads
 * enter from the right edge — one per supported LLM — each animating as
 * a head-pixel that travels left along a precomputed sinusoidal path
 * leaving a trail. When a head reaches the skein, it merges and a new
 * head spawns at the source. Threads loop indefinitely on stagger.
 *
 * The right-half label layer is rendered as plain HTML (no blur, just
 * a divider border) for crisp readability over the pixel grid.
 */

// Logical render size — small on purpose so each unit becomes a "pixel"
const W = 160;
const H = 120;

// Skein center (in logical pixels)
const CX = 56;
const CY = H / 2;

const PRIMARY = [109, 40, 217];   // #6d28d9
const PRIMARY_HI = [167, 139, 250]; // #a78bfa
const SPARK = [101, 163, 13];     // #65a30d
const CYAN = [15, 211, 211];      // #0FD3D3 — one accent thread for variety
const FG = [243, 239, 231];       // #f3efe7
const FG_DIM = [122, 114, 99];    // #7a7263

const THREADS = [
  { id: "claude",   label: "Claude Code", y: 16,  hue: PRIMARY_HI },
  { id: "cursor",   label: "Cursor",      y: 32,  hue: FG },
  { id: "codex",    label: "Codex",       y: 50,  hue: CYAN },
  { id: "gemini",   label: "Gemini CLI",  y: 70,  hue: SPARK },
  { id: "antigrav", label: "Antigravity", y: 88,  hue: PRIMARY_HI },
  { id: "opencode", label: "opencode",    y: 104, hue: FG_DIM },
];

const SOURCE_X = W - 4;     // threads start from the right edge
const TRAIL_LEN = 38;       // trailing pixels per thread head
const SPEED = 0.55;         // pixels per frame
const STAGGER = 0.18;       // phase offset between threads (0..1)

type Phase = { t: number };

// Clean 11×11 skein sprite. Outer ring = FG (bright), shell = PRIMARY_HI,
// inner = PRIMARY, the "yarn loops" inside rotate across 4 frames so the
// ball appears to spin slowly. Designed so the silhouette is the same
// across all frames — only the loops shift.
const SKEIN_BASE = [
  "...#####...",
  ".##$$$$$##.",
  ".#$$$$$$$#.",
  "#$$$$$$$$$#",
  "#$$$$$$$$$#",
  "#$$$$$$$$$#",
  "#$$$$$$$$$#",
  "#$$$$$$$$$#",
  ".#$$$$$$$#.",
  ".##$$$$$##.",
  "...#####...",
];

// Yarn-loop overlays — coords (relative to top-left of 11×11) painted as `%`
// to read as the darker inner thread. Four phases for a clockwise spin.
const SKEIN_LOOPS: [number, number][][] = [
  [[3,3],[4,3],[5,3],[6,3],[7,3], [3,7],[4,7],[5,7],[6,7],[7,7], [3,4],[3,5],[3,6], [7,4],[7,5],[7,6]],
  [[4,2],[5,2],[6,2], [4,8],[5,8],[6,8], [2,4],[2,5],[2,6], [8,4],[8,5],[8,6], [3,3],[7,3],[3,7],[7,7]],
  [[3,3],[4,3],[5,3],[6,3],[7,3], [3,7],[4,7],[5,7],[6,7],[7,7], [3,4],[3,5],[3,6], [7,4],[7,5],[7,6]].map(([x,y])=>[y,x]) as [number,number][],
  [[4,2],[5,2],[6,2], [4,8],[5,8],[6,8], [2,4],[2,5],[2,6], [8,4],[8,5],[8,6], [3,3],[7,3],[3,7],[7,7]].map(([x,y])=>[y,x]) as [number,number][],
];

function drawSkein(ctx: CanvasRenderingContext2D, frame: number) {
  // Halo first so the sprite draws on top.
  const halo = (Math.sin(frame * 0.06) + 1) * 0.5; // 0..1
  ctx.fillStyle = `rgba(167,139,250,${(0.18 + halo * 0.22).toFixed(3)})`;
  for (const [dx, dy] of HALO_PIXELS) ctx.fillRect(CX + dx, CY + dy, 1, 1);

  const SZ = 11;
  const ox = CX - 5;
  const oy = CY - 5;

  // Base shell
  for (let r = 0; r < SZ; r++) {
    const row = SKEIN_BASE[r];
    for (let c = 0; c < SZ; c++) {
      const ch = row[c];
      if (ch === ".") continue;
      ctx.fillStyle = rgb(ch === "#" ? FG : PRIMARY_HI);
      ctx.fillRect(ox + c, oy + r, 1, 1);
    }
  }

  // Yarn loops (rotating)
  const phase = Math.floor(frame / 18) % 4;
  ctx.fillStyle = rgb(PRIMARY);
  for (const [cx, cy] of SKEIN_LOOPS[phase]) {
    ctx.fillRect(ox + cx, oy + cy, 1, 1);
  }

  // Tiny highlight pixel — single bright dot drifts around the ball
  const hlPhase = (frame * 0.08) % (Math.PI * 2);
  const hx = CX + Math.round(Math.cos(hlPhase) * 3);
  const hy = CY + Math.round(Math.sin(hlPhase) * 3);
  ctx.fillStyle = rgb(FG);
  ctx.fillRect(hx, hy, 1, 1);
}

// Pre-compute halo positions once (diamond ring around the 11×11 skein sprite)
const HALO_PIXELS: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const dx = c - CX;
      const dy = r - CY;
      const d = Math.abs(dx) + Math.abs(dy);
      if (d > 9 && d < 14 && ((dx + dy) & 1) === 0) {
        out.push([dx, dy]);
      }
    }
  }
  return out;
})();

function threadPath(yBase: number, x: number, phase: number): number {
  // Sinusoidal wobble that flattens as we approach the skein.
  const t = (SOURCE_X - x) / (SOURCE_X - CX);
  const damp = 1 - t * 0.85;
  const wobble = Math.sin((x * 0.18) + phase * Math.PI * 2) * 5 * damp;
  // Drift toward CY as t→1
  const drift = (CY - yBase) * t * t;
  return yBase + drift + wobble;
}

function drawThread(
  ctx: CanvasRenderingContext2D,
  yBase: number,
  hue: number[],
  phase: Phase,
  staticPhase: number
) {
  // The head pixel position along the path, in logical pixels (0..1 progress).
  const span = SOURCE_X - CX;
  const headX = SOURCE_X - phase.t * span;
  if (headX <= CX) return; // arrived; will respawn

  // Trail of pixels behind the head, fading + dithered.
  for (let i = 0; i < TRAIL_LEN; i++) {
    const x = headX + i * 0.85;
    if (x > SOURCE_X) break;
    const y = Math.round(threadPath(yBase, x, staticPhase));

    // Fade with distance from head + dither (skip alternating pixels deeper in tail)
    const fade = 1 - i / TRAIL_LEN;
    if (i > 4 && (i & 1) === ((Math.round(x) & 1))) continue;

    const a = Math.max(0.05, fade * fade);
    ctx.fillStyle = `rgba(${hue[0]},${hue[1]},${hue[2]},${a.toFixed(3)})`;
    ctx.fillRect(Math.round(x), y, 1, 1);
  }

  // Head pixel — bright
  const hy = Math.round(threadPath(yBase, headX, staticPhase));
  ctx.fillStyle = rgb(FG);
  ctx.fillRect(Math.round(headX), hy, 1, 1);
  // Subtle plus-shape around head
  ctx.fillStyle = `rgba(${hue[0]},${hue[1]},${hue[2]},0.7)`;
  ctx.fillRect(Math.round(headX) - 1, hy, 1, 1);
  ctx.fillRect(Math.round(headX), hy - 1, 1, 1);
  ctx.fillRect(Math.round(headX), hy + 1, 1, 1);
}

function rgb(c: number[]) {
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

export default function PixelLoom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Honor reduced motion: paint one static frame and bail.
    const reduceMotion = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    canvas.width = W;
    canvas.height = H;
    ctx.imageSmoothingEnabled = false;

    // Per-thread cycle phase (0..1, wraps).
    const phases: Phase[] = THREADS.map((_, i) => ({ t: (i * STAGGER) % 1 }));
    // Static phase per thread for the sinusoidal wobble — keeps wobble stable per thread.
    const staticPhases = THREADS.map((_, i) => i * 0.31);

    let frame = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      frame += 1;

      // Clear (don't trail — we paint the trail explicitly)
      ctx.clearRect(0, 0, W, H);

      // Threads first so the skein draws on top
      for (let i = 0; i < THREADS.length; i++) {
        const p = phases[i];
        p.t += (SPEED * (dt / 16.67)) / (SOURCE_X - CX);
        if (p.t >= 1) p.t = 0; // respawn from source
        drawThread(ctx, THREADS[i].y, THREADS[i].hue, p, staticPhases[i]);
      }

      drawSkein(ctx, frame);

      if (!reduceMotion) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    if (reduceMotion) {
      draw(performance.now()); // single static frame
    } else {
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-12 right-0 bottom-12 w-1/2 z-0 hidden lg:block"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          imageRendering: "pixelated",
          // canvas is W×H logical pixels; CSS scales it up, browser nearest-neighbors it.
        }}
      />

      {/* Crisp HTML labels — no backdrop-blur (paint expensive). */}
      <div className="absolute inset-0 pointer-events-auto">
        {THREADS.map((n, i) => (
          <div
            key={n.id}
            className="absolute font-mono text-[0.6875rem] tracking-[0.04em] text-fg-2"
            style={{
              right: "0.75rem",
              top: `${(n.y / H) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <span className="px-2 py-1 rounded border border-divider bg-bg-1 inline-block">
              {n.label}
            </span>
          </div>
        ))}
        <div
          className="absolute font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-3"
          style={{
            left: `${(CX / W) * 100}%`,
            top: `calc(${(CY / H) * 100}% + 2.1rem)`,
            transform: "translateX(-50%)",
          }}
        >
          skein · 127.0.0.1
        </div>
      </div>
    </div>
  );
}
