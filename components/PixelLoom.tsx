"use client";

import { useEffect, useRef } from "react";

/**
 * PixelLoom — chunky pixel-art hero animation.
 *
 * Renders at 160×120 logical pixels and is scaled up with
 * `image-rendering: pixelated` so each drawn pixel becomes a chunky
 * 4-6px on-screen block. Single requestAnimationFrame loop, no React
 * state per frame, no SVG filters.
 *
 * Composition (iter 27):
 *   - Six client labels rendered as pixelated text in each brand's
 *     accent color, positioned compass-style around the central skein.
 *   - Orthogonal circuit traces connect each label to the skein border.
 *   - The 11×11 pixel-art skein sprite spins through four yarn-loop
 *     frames at the center; halo breathes; highlight orbits.
 *   - Pulses on each trace alternate direction per cycle: phase 0→1
 *     travels logo→skein (a "write"), phase 1→2 travels skein→logo
 *     (a "read"). Staggered phases mean at any moment some threads
 *     are writing, others are reading — the work process of Skein
 *     made visible.
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
// 4×6 uppercase pixel font. Only the 17 letters used in the
// six agent names are defined: A C D E G I L M N O P R S T U V X
// ─────────────────────────────────────────────────────────────
const FONT: Record<string, string[]> = {
  "A": [".##.", "#..#", "####", "#..#", "#..#", "#..#"],
  "C": [".###", "#...", "#...", "#...", "#...", ".###"],
  "D": ["###.", "#..#", "#..#", "#..#", "#..#", "###."],
  "E": ["####", "#...", "###.", "#...", "#...", "####"],
  "G": [".###", "#...", "#...", "#.##", "#..#", ".###"],
  "I": ["####", ".##.", ".##.", ".##.", ".##.", "####"],
  "L": ["#...", "#...", "#...", "#...", "#...", "####"],
  "M": ["#..#", "####", "#..#", "#..#", "#..#", "#..#"],
  "N": ["#..#", "##.#", "##.#", "#.##", "#.##", "#..#"],
  "O": [".##.", "#..#", "#..#", "#..#", "#..#", ".##."],
  "P": ["###.", "#..#", "#..#", "###.", "#...", "#..."],
  "R": ["###.", "#..#", "#..#", "###.", "#.#.", "#..#"],
  "S": [".###", "#...", ".##.", "...#", "...#", "###."],
  "T": ["####", ".##.", ".##.", ".##.", ".##.", ".##."],
  "U": ["#..#", "#..#", "#..#", "#..#", "#..#", ".##."],
  "V": ["#..#", "#..#", "#..#", "#..#", ".##.", ".##."],
  "X": ["#..#", "#..#", ".##.", ".##.", "#..#", "#..#"],
};

const CHAR_W = 4;
const CHAR_H = 6;
const CHAR_GAP = 1;
const CHAR_PITCH = CHAR_W + CHAR_GAP;

// ─────────────────────────────────────────────────────────────
// Six threads. Each declares its agent id, displayed label,
// color (single or per-letter), label center (x, y), and the
// polyline route from the label edge to the skein border.
// Routes are strictly orthogonal — every elbow is a 90° turn.
// Compass layout: N top, NE upper-right, SE lower-right,
// S bottom, SW lower-left, NW upper-left.
// ─────────────────────────────────────────────────────────────
type Thread = {
  id: string;
  label: string;
  color: number[] | number[][];
  x: number;
  y: number;
  route: [number, number][];
};

const THREADS: Thread[] = [
  // N — CLAUDE, straight vertical drop
  { id: "claude-code", label: "CLAUDE", color: C_CLAUDE,
    x: 80, y: 22,
    route: [[80, 27], [80, 54]] },

  // NE — CURSOR, west into elbow, then south to skein top
  { id: "cursor", label: "CURSOR", color: C_CURSOR,
    x: 114, y: 42,
    route: [[99, 42], [84, 42], [84, 54]] },

  // SE — CODEX, west into elbow, then north to skein bottom
  { id: "codex", label: "CODEX", color: C_CODEX,
    x: 114, y: 78,
    route: [[101, 78], [84, 78], [84, 66]] },

  // S — GEMINI, straight vertical rise
  { id: "gemini-cli", label: "GEMINI", color: C_GEMINI,
    x: 80, y: 100,
    route: [[80, 95], [80, 66]] },

  // SW — ANTIGRAV (rainbow), east into elbow, then north to skein bottom
  { id: "antigravity", label: "ANTIGRAV", color: C_ANTIGRAV,
    x: 44, y: 78,
    route: [[64, 78], [76, 78], [76, 66]] },

  // NW — OPENCODE, east into elbow, then south to skein top
  { id: "opencode", label: "OPENCODE", color: C_OPENCODE,
    x: 44, y: 42,
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

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  color: number[] | number[][],
) {
  const totalW = text.length * CHAR_PITCH - CHAR_GAP;
  const ox = Math.round(cx) - Math.floor(totalW / 2);
  const oy = Math.round(cy) - Math.floor(CHAR_H / 2);
  const multi = isMulticolor(color);

  for (let i = 0; i < text.length; i++) {
    const ch = text[i].toUpperCase();
    const glyph = FONT[ch];
    if (!glyph) continue;

    const letterColor = multi
      ? (color as number[][])[i % (color as number[][]).length]
      : (color as number[]);
    ctx.fillStyle = rgb(letterColor);

    const charX = ox + i * CHAR_PITCH;
    for (let r = 0; r < CHAR_H; r++) {
      const row = glyph[r];
      if (!row) continue;
      for (let c = 0; c < CHAR_W; c++) {
        if (row[c] === "#") {
          ctx.fillRect(charX + c, oy + r, 1, 1);
        }
      }
    }
  }
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

      // 3. Text labels at compass positions
      for (let i = 0; i < THREADS.length; i++) {
        const t = THREADS[i];
        drawText(ctx, t.label, t.x, t.y, t.color);
      }

      // 4. Skein at center
      drawSkein(ctx, frame);

      // 5. Bidirectional pulses (drawn last so they sit on top)
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
        className="w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />
      {/* Screen-reader-only client list — labels in canvas are decorative to AT. */}
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
