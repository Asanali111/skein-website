import type { ReactNode } from "react";

export function StatusDot() {
  return (
    <span
      aria-hidden
      className="inline-block w-2 h-2 rounded-full bg-spark shadow-spark mr-[0.4rem] align-middle"
    />
  );
}

export function VersionBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center font-mono text-[0.6875rem] tracking-[0.06em] uppercase font-medium text-spark border border-spark rounded-[3px] px-2 py-[0.2rem] bg-[rgba(101,163,13,0.08)]">
      {children}
    </span>
  );
}
