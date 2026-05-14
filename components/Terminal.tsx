import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Terminal({ children, className = "" }: Props) {
  return (
    <pre
      className={`bg-bg-3 border-l-2 border-primary rounded-[4px] p-[0.875rem] mt-4 font-mono text-[0.75rem] leading-[1.6] text-fg-1 whitespace-pre-wrap overflow-x-auto ${className}`}
    >
      {children}
    </pre>
  );
}

export function Cmd({ children }: { children: ReactNode }) {
  return <span className="text-primary">{children}</span>;
}

export function Ok({ children }: { children: ReactNode }) {
  return <span className="text-spark">{children}</span>;
}
