import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`bg-bg-1 border border-divider rounded-lg p-6 transition-transform duration-150 hover:-translate-y-0.5 hover:border-fg-3 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="card-title text-xl text-fg-0 mb-2">{children}</h3>
  );
}

export function CardBody({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm leading-[1.55] text-fg-1">{children}</p>
  );
}
