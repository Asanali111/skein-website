"use client";

import { useEffect, useRef } from "react";

/**
 * PixelLoom — chunky pixel-art hero animation with full-color logo overlays.
 *
 * The 160×120 canvas (scaled up with `image-rendering: pixelated`) draws the
 * traces, elbow junctions, animated skein, and bidirectional pulses. The
 * client logos are NOT drawn into the canvas — downscaling 500-2048px PNGs
 * into an 18×18 logical grid destroyed too much detail. Instead each logo
 * is an HTML `<img>` positioned absolutely over the canvas at the same
 * compass coordinates, letting the browser smooth-scale from native res.
 */

const W = 160;
const H = 120;
const CX = 80;
const CY = 60;

// Base palette
const PRIMARY = [109, 40, 217];
const PRIMARY_HI = [167, 139, 250];
const FG = [243, 239, 231];

// Per-brand accent colors
const C_CLAUDE = [217, 119, 87];     // warm orange (Anthropic)
const C_CURSOR = [230, 230, 230];    // near-white (Cursor monochrome)
const C_CODEX = [15, 211, 211];      // cyan (carryover accent)
const C_GEMINI = [122, 166, 240];    // soft blue
const C_VSCODE = [0, 122, 204];      // blue
const C_OPENCODE = [168, 168, 168];  // mid gray
// Antigravity — per-letter rainbow gradient (blue → purple → pink → amber → yellow)
const C_ANTIGRAV: number[][] = [
  [88, 156, 255],   // A
  [130, 110, 255],  // N
  [180, 90, 255],   // T
  [220, 90, 200],   // I
  [255, 90, 150],   // G
  [255, 140, 90],   // R
  [255, 180, 60],   // A
  [255, 220, 60],   // V
];

// ─────────────────────────────────────────────────────────────
// Six threads. Each declares its agent id, brand label, color
// (drives trace + pulse hue), logo center (x, y) in logical canvas
// coords, the PNG src, and the polyline route from the logo edge
// to the skein border.
// Routes are strictly orthogonal — every elbow is a 90° turn.
// Compass layout: N top, NE upper-right, SE lower-right,
// S bottom, SW lower-left, NW upper-left.
// ─────────────────────────────────────────────────────────────
type Thread = {
  id: string;
  label: string;
  imgSrc: string;
  color: number[] | number[][];
  x: number;
  y: number;
  /** CSS size of the rendered <img>. Base was 3rem; per-brand bumps live here. */
  sizeRem: string;
  route: [number, number][];
};

const THREADS: Thread[] = [
  // N — CLAUDE DESKTOP, straight vertical drop  (+100% size)
  { id: "claude-desktop", label: "CLAUDE", imgSrc: "/logos/claude_desktop.png", color: C_CLAUDE,
    x: 80, y: 22, sizeRem: "6rem",
    route: [[80, 27], [80, 54]] },

  // NE — CURSOR, west into elbow, then south to skein top  (+100% size)
  { id: "cursor", label: "CURSOR", imgSrc: "/logos/cursor.png", color: C_CURSOR,
    x: 114, y: 42, sizeRem: "6rem",
    route: [[99, 42], [84, 42], [84, 54]] },

  // SE — CODEX, west into elbow, then north to skein bottom  (+100% size)
  { id: "codex", label: "CODEX", imgSrc: "/logos/codex.png", color: C_CODEX,
    x: 114, y: 78, sizeRem: "6rem",
    route: [[101, 78], [84, 78], [84, 66]] },

  // S — OPENCODE (swapped from NW): straight vertical rise.
  // +150% size, plus a subtle radial-gradient glow behind it (added
  // separately in the JSX) since the mark is low-contrast on the dark bg.
  { id: "opencode", label: "OPENCODE", imgSrc: "/logos/opencode.png", color: C_OPENCODE,
    x: 80, y: 100, sizeRem: "7.5rem",
    route: [[80, 95], [80, 66]] },

  // SW — ANTIGRAV (rainbow), east into elbow, then north to skein bottom  (+100% size)
  { id: "antigravity", label: "ANTIGRAV", imgSrc: "/logos/antigravity_logo.png", color: C_ANTIGRAV,
    x: 44, y: 78, sizeRem: "6rem",
    route: [[64, 78], [76, 78], [76, 66]] },

  // NW — VS CODE (swapped from S): east into elbow, then south to skein top.
  // +20% size only — its mark is bold and reads clearly at small scale.
  { id: "vscode", label: "VS CODE", imgSrc: "/logos/vscode.png", color: C_VSCODE,
    x: 44, y: 42, sizeRem: "3.6rem",
    route: [[64, 42], [76, 42], [76, 54]] },
];

// ─────────────────────────────────────────────────────────────
// Pre-compute trace pixels for each route once at module load.
// ─────────────────────────────────────────────────────────────
type Trace = { pixels: [number, number][]; elbows: [number, number][] };

function walkRoute(route: [number, number][]): Trace {
  const pixels: [number, number][] = [];
  const elbows: [number, number][] = [];
  for (let i = 0; i < route.length - 1; i++) {
    const [x1, y1] = route[i];
    const [x2, y2] = route[i + 1];
    if (i > 0) elbows.push([x1, y1]);
    const dx = Math.sign(x2 - x1);
    const dy = Math.sign(y2 - y1);
    let x = x1, y = y1;
    while (x !== x2 || y !== y2) {
      pixels.push([x, y]);
      x += dx;
      y += dy;
    }
  }
  pixels.push(route[route.length - 1]);
  return { pixels, elbows };
}

const TRACES: Trace[] = THREADS.map((t) => walkRoute(t.route));

// ─────────────────────────────────────────────────────────────
// Skein sprite (11×11). Outer ring = bright FG, shell = PRIMARY_HI,
// inner rotating loops = PRIMARY.
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

// ─────────────────────────────────────────────────────────────
// Drawing primitives
// ─────────────────────────────────────────────────────────────
function rgb(c: number[]) {
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
function rgba(c: number[], a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
}

function isMulticolor(color: number[] | number[][]): color is number[][] {
  return Array.isArray(color[0]);
}

function drawSkein(ctx: CanvasRenderingContext2D, frame: number) {
  // Halo first (under the sprite)
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

  const hlPhase = (frame * 0.08) % (Math.PI * 2);
  const hx = CX + Math.round(Math.cos(hlPhase) * 3);
  const hy = CY + Math.round(Math.sin(hlPhase) * 3);
  ctx.fillStyle = rgb(FG);
  ctx.fillRect(hx, hy, 1, 1);
}

function drawTrace(ctx: CanvasRenderingContext2D, trace: Trace, hue: number[]) {
  ctx.fillStyle = rgba(hue, 0.22);
  for (const [x, y] of trace.pixels) ctx.fillRect(x, y, 1, 1);
}

function drawJunctions(ctx: CanvasRenderingContext2D, trace: Trace, hue: number[]) {
  ctx.fillStyle = rgba(hue, 0.7);
  for (const [x, y] of trace.elbows) {
    ctx.fillRect(x, y, 1, 1);
    ctx.fillRect(x - 1, y, 1, 1);
    ctx.fillRect(x + 1, y, 1, 1);
    ctx.fillRect(x, y - 1, 1, 1);
    ctx.fillRect(x, y + 1, 1, 1);
  }
}

/**
 * Bidirectional pulse. phase ∈ [0, 2):
 *   0 ≤ phase < 1: WRITE — pulse travels logo → skein
 *   1 ≤ phase < 2: READ  — pulse travels skein → logo
 * Trail always extends behind the head in the direction of motion.
 * For monochrome threads use a representative hue; for the rainbow
 * thread (Antigravity) the pulse takes the first stop in its gradient
 * so it reads as the thread's leading color.
 */
function drawPulse(
  ctx: CanvasRenderingContext2D,
  trace: Trace,
  hue: number[],
  phase: number,
) {
  const len = trace.pixels.length;
  if (len === 0) return;

  const isRead = phase >= 1;
  const t = isRead ? 2 - phase : phase; // 0..1, position along trace from logo
  const headIdx = Math.min(len - 1, Math.max(0, Math.floor(t * (len - 1))));
  const [hx, hy] = trace.pixels[headIdx];

  // Head — bright FG center pixel
  ctx.fillStyle = rgb(FG);
  ctx.fillRect(hx, hy, 1, 1);

  // Plus-shape around head in hue
  ctx.fillStyle = rgba(hue, 0.85);
  ctx.fillRect(hx - 1, hy, 1, 1);
  ctx.fillRect(hx + 1, hy, 1, 1);
  ctx.fillRect(hx, hy - 1, 1, 1);
  ctx.fillRect(hx, hy + 1, 1, 1);

  // Trail — extends BEHIND the head in the direction of motion.
  // For write, motion is +idx, so trail is at idx-i.
  // For read, motion is -idx, so trail is at idx+i.
  const TRAIL = 6;
  for (let i = 1; i < TRAIL; i++) {
    const trailIdx = isRead ? headIdx + i : headIdx - i;
    if (trailIdx < 0 || trailIdx >= len) break;
    const [tx, ty] = trace.pixels[trailIdx];
    const a = (1 - i / TRAIL) * 0.75;
    ctx.fillStyle = rgba(hue, a);
    ctx.fillRect(tx, ty, 1, 1);
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

    // Per-thread phase ∈ [0, 2), staggered so writes and reads
    // are interleaved across the mesh at any moment.
    const STAGGER = 0.33;
    const phases: number[] = THREADS.map((_, i) => (i * STAGGER) % 2);
    const SPEED = 0.0095; // progress per 60fps frame

    let frame = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      frame += 1;

      ctx.clearRect(0, 0, W, H);

      // 1. Static traces
      for (let i = 0; i < THREADS.length; i++) {
        const hue = isMulticolor(THREADS[i].color)
          ? (THREADS[i].color as number[][])[0]
          : (THREADS[i].color as number[]);
        drawTrace(ctx, TRACES[i], hue);
      }

      // 2. Elbow junctions
      for (let i = 0; i < THREADS.length; i++) {
        const hue = isMulticolor(THREADS[i].color)
          ? (THREADS[i].color as number[][])[0]
          : (THREADS[i].color as number[]);
        drawJunctions(ctx, TRACES[i], hue);
      }

      // 3. Skein at center (logos render as HTML overlays — see JSX below)
      drawSkein(ctx, frame);

      // 4. Bidirectional pulses (drawn last so they sit on top)
      for (let i = 0; i < THREADS.length; i++) {
        phases[i] += SPEED * (dt / 16.67);
        if (phases[i] >= 2) phases[i] -= 2;
        const hue = isMulticolor(THREADS[i].color)
          ? (THREADS[i].color as number[][])[0]
          : (THREADS[i].color as number[]);
        drawPulse(ctx, TRACES[i], hue, phases[i]);
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
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />
      {/* Subtle radial-gradient glow behind opencode — the only mark whose
          contrast against the warm-dark bg is too low to read on its own. */}
      {(() => {
        const oc = THREADS.find((t) => t.id === "opencode");
        if (!oc) return null;
        return (
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: `${(oc.x / W) * 100}%`,
              top: `${(oc.y / H) * 100}%`,
              width: "10rem",
              height: "10rem",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(243, 239, 231, 0.14) 0%, rgba(243, 239, 231, 0.05) 40%, transparent 70%)",
            }}
          />
        );
      })()}

      {THREADS.map((t) => (
        <img
          key={t.id}
          src={t.imgSrc}
          alt=""
          className="absolute select-none"
          style={{
            left: `${(t.x / W) * 100}%`,
            top: `${(t.y / H) * 100}%`,
            width: t.sizeRem,
            height: t.sizeRem,
            transform: "translate(-50%, -50%)",
            objectFit: "contain",
            imageRendering: "auto",
          }}
        />
      ))}
    </div>
  );
}
