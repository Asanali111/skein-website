"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<"idle" | "arming" | "visible">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setPhase("visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Arm GPU layer just before paint, swap to visible next frame,
          // then drop will-change after the 600ms transition finishes.
          setPhase("arming");
          const startId = window.setTimeout(() => setPhase("visible"), 16 + delay);
          const endId = window.setTimeout(() => {
            if (ref.current) ref.current.classList.remove("is-arming");
          }, 16 + delay + 700);
          obs.disconnect();
          return () => {
            window.clearTimeout(startId);
            window.clearTimeout(endId);
          };
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={[
        "reveal",
        phase === "arming" || phase === "visible" ? "is-arming" : "",
        phase === "visible" ? "is-visible" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
