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
 * Composition (iter 26):
 *   - 6 agent logos (9×9 pixel-art sprites) sit at the right edge.
 *   - From each logo, an orthogonal "circuit trace" routes to the
 *     central pixel-art skein sprite. Right-angle elbows only — no waves.
 *   - Static traces are dim (always visible, like PCB ink).
 *   - Junction dots at every elbow.
 *   - Bright "pulse" pixels travel along each trace at staggered cadence,
 *     fading in at the source and fading out at the skein — data packets
 *     arriving in the memory bus.
 *   - The 11×11 skein sprite at the center rotates its yarn loops on
 *     a 4-frame cycle.
 */

const W = 160;
const H = 120;

const CX = 56;
const CY = 60;

const PRIMARY = [109, 40, 217];   // #6d28d9
const PRIMARY_HI = [167, 139, 250]; // #a78bfa
const SPARK = [101, 163, 13];     // #65a30d
const CYAN = [15, 211, 211];      // #0FD3D3 — one accent thread for variety
const FG = [243, 239, 231];       // #f3efe7
const FG_DIM = [122, 114, 99];    // #7a7263

// ─────────────────────────────────────────────────────────────
// 13×13 agent logo sprites. `#` = bright (FG), `$` = thread hue.
// Logo center is (6, 6) within each grid.
//
// Designed as pixel-art interpretations evoking each brand's
// visual-identity language (not pixelations of their official
// marks): Claude Code = starburst / sunburst spark; Cursor =
// pointer arrow; Codex = hex outline (geometric algorithmic);
// Gemini CLI = 4-pointed gem; Antigravity = up-arrow;
// opencode = TUI brackets.
// ─────────────────────────────────────────────────────────────
const LOGOS: Record<string, string[]> = {
  // Claude Code — 4-rayed compass-star (Anthropic spark feel)
  "claude-code": [
    ".............",
    ".............",
    "......#......",
    "......#......",
    ".....###.....",
    "....#####....",
    "#############",
    "....#####....",
    ".....###.....",
    "......#......",
    "......#......",
    ".............",
    ".............",
  ],
  // Cursor — classic mouse pointer with tail
  "cursor": [
    "#............",
    "##...........",
    "###..........",
    "####.........",
    "#####........",
    "######.......",
    "#######......",
    "########.....",
    "#####........",
    "##.##........",
    ".#..##.......",
    ".....##......",
    "......##.....",
  ],
  // Codex — hexagonal outline (algorithmic / OpenAI-shaped)
  "codex": [
    ".............",
    "....######...",
    "...#......#..",
    "..#........#.",
    ".#..........#",
    ".#..........#",
    ".#..........#",
    ".#..........#",
    ".#..........#",
    "..#........#.",
    "...#......#..",
    "....######...",
    ".............",
  ],
  // Gemini CLI — 4-pointed gem (sparkle)
  "gemini-cli": [
    "......#......",
    ".....###.....",
    "....#####....",
    "...#######...",
    "..#########..",
    ".###########.",
    "#############",
    ".###########.",
    "..#########..",
    "...#######...",
    "....#####....",
    ".....###.....",
    "......#......",
  ],
  // Antigravity — up-arrow chevron (rising motion)
  "antigravity": [
    ".............",
    "......#......",
    ".....###.....",
    "....#####....",
    "...#######...",
    "..#########..",
    ".###########.",
    "......#......",
    "......#......",
    "......#......",
    "......#......",
    "......#......",
    "......#......",
  ],
  // opencode — bracket pair with cursor-bars inside (TUI feel)
  "opencode": [
    "####.....####",
    "#...........#",
    "#...........#",
    "#...........#",
    "#....#.#....#",
    "#....#.#....#",
    "#....#.#....#",
    "#....#.#....#",
    "#....#.#....#",
    "#...........#",
    "#...........#",
    "#...........#",
    "####.....####",
  ],
};

// ─────────────────────────────────────────────────────────────
// 6 threads. Each declares its agent id, hue, logo center y, and
// the polyline route from the logo to the skein. Routes are
// strictly orthogonal — every elbow is a 90° turn.
//
// The logo is centered at (LOGO_CX, y). The trace leaves the
// LEFT side of the logo at (LOGO_CX - 5, y) and bends through
// the polyline until it reaches the skein at (CX, CY).
// ─────────────────────────────────────────────────────────────
const LOGO_CX = 150;
const LOGO_HALF = 6;                 // 13×13 sprite, center at (6, 6)
const TRACE_START_X = LOGO_CX - LOGO_HALF - 1; // 143 — just outside logo's left edge

type Thread = {
  id: string;
  hue: number[];
  y: number;
  route: [number, number][];
};

const THREADS: Thread[] = [
  {
    id: "claude-code",
    hue: PRIMARY_HI,
    y: 12,
    route: [[TRACE_START_X, 12], [110, 12], [110, 60], [CX, 60]],
  },
  {
    id: "cursor",
    hue: FG,
    y: 30,
    route: [[TRACE_START_X, 30], [95, 30], [95, 60], [CX, 60]],
  },
  {
    id: "codex",
    hue: CYAN,
    y: 48,
    route: [[TRACE_START_X, 48], [78, 48], [78, 60], [CX, 60]],
  },
  {
    id: "gemini-cli",
    hue: SPARK,
    y: 72,
    route: [[TRACE_START_X, 72], [78, 72], [78, 60], [CX, 60]],
  },
  {
    id: "antigravity",
    hue: PRIMARY_HI,
    y: 90,
    route: [[TRACE_START_X, 90], [95, 90], [95, 60], [CX, 60]],
  },
  {
    id: "opencode",
    hue: FG_DIM,
    y: 108,
    route: [[TRACE_START_X, 108], [110, 108], [110, 60], [CX, 60]],
  },
];

// Pre-compute each route's pixel positions + total length once.
type Trace = { pixels: [number, number][]; elbows: [number, number][] };

function walkRoute(route: [number, number][]): Trace {
  const pixels: [number, number][] = [];
  const elbows: [number, number][] = [];
  for (let i = 0; i < route.length - 1; i++) {
    const [x1, y1] = route[i];
    const [x2, y2] = route[i + 1];
    if (i > 0) elbows.push([x1, y1]); // each interior route point is an elbow
    const dx = Math.sign(x2 - x1);
    const dy = Math.sign(y2 - y1);
    let x = x1;
    let y = y1;
    // Walk inclusive of x1, exclusive of x2 to avoid double-painting elbows
    while (x !== x2 || y !== y2) {
      pixels.push([x, y]);
      x += dx;
      y += dy;
    }
  }
  pixels.push(route[route.length - 1]); // final point (the skein junction)
  return { pixels, elbows };
}

const TRACES: Trace[] = THREADS.map((t) => walkRoute(t.route));

// ─────────────────────────────────────────────────────────────
// Skein sprite (11×11). Outer ring = FG bright, shell = PRIMARY_HI,
// inner loops = PRIMARY (rotating across 4 frames).
// ─────────────────────────────────────────────────────────────
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

const SKEIN_LOOPS: [number, number][][] = [
  [[3,3],[4,3],[5,3],[6,3],[7,3], [3,7],[4,7],[5,7],[6,7],[7,7], [3,4],[3,5],[3,6], [7,4],[7,5],[7,6]],
  [[4,2],[5,2],[6,2], [4,8],[5,8],[6,8], [2,4],[2,5],[2,6], [8,4],[8,5],[8,6], [3,3],[7,3],[3,7],[7,7]],
  [[3,3],[4,3],[5,3],[6,3],[7,3], [3,7],[4,7],[5,7],[6,7],[7,7], [3,4],[3,5],[3,6], [7,4],[7,5],[7,6]].map(([x,y])=>[y,x]) as [number,number][],
  [[4,2],[5,2],[6,2], [4,8],[5,8],[6,8], [2,4],[2,5],[2,6], [8,4],[8,5],[8,6], [3,3],[7,3],[3,7],[7,7]].map(([x,y])=>[y,x]) as [number,number][],
];

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

function drawSkein(ctx: CanvasRenderingContext2D, frame: number) {
  const halo = (Math.sin(frame * 0.06) + 1) * 0.5;
  ctx.fillStyle = `rgba(167,139,250,${(0.18 + halo * 0.22).toFixed(3)})`;
  for (const [dx, dy] of HALO_PIXELS) ctx.fillRect(CX + dx, CY + dy, 1, 1);

  const SZ = 11;
  const ox = CX - 5;
  const oy = CY - 5;

  for (let r = 0; r < SZ; r++) {
    const row = SKEIN_BASE[r];
    for (let c = 0; c < SZ; c++) {
      const ch = row[c];
      if (ch === ".") continue;
      ctx.fillStyle = rgb(ch === "#" ? FG : PRIMARY_HI);
      ctx.fillRect(ox + c, oy + r, 1, 1);
    }
  }

  const phase = Math.floor(frame / 18) % 4;
  ctx.fillStyle = rgb(PRIMARY);
  for (const [cx, cy] of SKEIN_LOOPS[phase]) {
    ctx.fillRect(ox + cx, oy + cy, 1, 1);
  }

  // Orbiting highlight
  const hlPhase = (frame * 0.08) % (Math.PI * 2);
  const hx = CX + Math.round(Math.cos(hlPhase) * 3);
  const hy = CY + Math.round(Math.sin(hlPhase) * 3);
  ctx.fillStyle = rgb(FG);
  ctx.fillRect(hx, hy, 1, 1);
}

// ─────────────────────────────────────────────────────────────
// Drawing primitives
// ─────────────────────────────────────────────────────────────
function rgb(c: number[]) {
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
function rgba(c: number[], a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
}

function drawTrace(ctx: CanvasRenderingContext2D, trace: Trace, hue: number[]) {
  // Static circuit trace — dim pixels along the whole polyline.
  ctx.fillStyle = rgba(hue, 0.22);
  for (const [x, y] of trace.pixels) ctx.fillRect(x, y, 1, 1);
}

function drawJunctions(ctx: CanvasRenderingContext2D, trace: Trace, hue: number[]) {
  // Slightly brighter dot at each elbow + a small ⊕ tick to read as a node.
  ctx.fillStyle = rgba(hue, 0.7);
  for (const [x, y] of trace.elbows) {
    ctx.fillRect(x, y, 1, 1);
    ctx.fillRect(x - 1, y, 1, 1);
    ctx.fillRect(x + 1, y, 1, 1);
    ctx.fillRect(x, y - 1, 1, 1);
    ctx.fillRect(x, y + 1, 1, 1);
  }
}

function drawLogo(ctx: CanvasRenderingContext2D, sprite: string[], cx: number, cy: number, hue: number[]) {
  const SZ = 13;
  const ox = cx - LOGO_HALF;
  const oy = cy - LOGO_HALF;
  for (let r = 0; r < SZ; r++) {
    const row = sprite[r];
    if (!row) continue;
    for (let c = 0; c < SZ; c++) {
      const ch = row[c];
      if (ch === "." || ch === undefined) continue;
      ctx.fillStyle = ch === "$" ? rgb(hue) : rgb(FG);
      ctx.fillRect(ox + c, oy + r, 1, 1);
    }
  }
}

function drawPulse(
  ctx: CanvasRenderingContext2D,
  trace: Trace,
  hue: number[],
  t: number /* 0..1 along polyline */
) {
  const len = trace.pixels.length;
  if (len === 0) return;
  const headIdx = Math.min(len - 1, Math.floor(t * len));

  // Pulse trail: brighter pixels at head, dimmer behind.
  const TRAIL = 6;
  for (let i = 0; i < TRAIL; i++) {
    const idx = headIdx - i;
    if (idx < 0) break;
    const [x, y] = trace.pixels[idx];
    if (i === 0) {
      // Head: bright FG center pixel with hue plus-shape
      ctx.fillStyle = rgb(FG);
      ctx.fillRect(x, y, 1, 1);
      ctx.fillStyle = rgba(hue, 0.85);
      ctx.fillRect(x - 1, y, 1, 1);
      ctx.fillRect(x + 1, y, 1, 1);
      ctx.fillRect(x, y - 1, 1, 1);
      ctx.fillRect(x, y + 1, 1, 1);
    } else {
      const a = (1 - i / TRAIL) * 0.85;
      ctx.fillStyle = rgba(hue, a);
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function PixelLoom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    canvas.width = W;
    canvas.height = H;
    ctx.imageSmoothingEnabled = false;

    // Per-thread pulse progress 0..1, staggered so all 6 don't pulse in lockstep.
    const STAGGER = 0.18;
    const phases: number[] = THREADS.map((_, i) => (i * STAGGER) % 1);
    const SPEED = 0.0085; // progress per 60fps frame

    let frame = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      frame += 1;

      ctx.clearRect(0, 0, W, H);

      // 1. Static circuit traces (dim, like printed PCB ink)
      for (let i = 0; i < THREADS.length; i++) {
        drawTrace(ctx, TRACES[i], THREADS[i].hue);
      }

      // 2. Junction dots at elbows
      for (let i = 0; i < THREADS.length; i++) {
        drawJunctions(ctx, TRACES[i], THREADS[i].hue);
      }

      // 3. Agent logos at the right edge
      for (let i = 0; i < THREADS.length; i++) {
        const t = THREADS[i];
        drawLogo(ctx, LOGOS[t.id], LOGO_CX, t.y, t.hue);
      }

      // 4. Skein at the center
      drawSkein(ctx, frame);

      // 5. Bright pulses traveling along the traces (drawn last so they sit on top)
      for (let i = 0; i < THREADS.length; i++) {
        phases[i] += SPEED * (dt / 16.67);
        if (phases[i] >= 1) phases[i] = 0;
        drawPulse(ctx, TRACES[i], THREADS[i].hue, phases[i]);
      }

      if (!reduceMotion) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    if (reduceMotion) {
      draw(performance.now());
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
        style={{ imageRendering: "pixelated" }}
      />
      {/* Screen-reader-only labels — the pixelated logos are decorative
          to AT, but the agent list still needs to be discoverable. */}
      <ul className="sr-only">
        <li>Claude Code</li>
        <li>Cursor</li>
        <li>Codex</li>
        <li>Gemini CLI</li>
        <li>Antigravity</li>
        <li>opencode</li>
      </ul>
    </div>
  );
}
