import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  external?: boolean;
};

export function PrimaryCta({ href, children, external }: Props) {
  const cls =
    "inline-flex items-center font-mono text-[0.8125rem] tracking-[0.04em] bg-primary text-white font-medium px-4 py-[0.625rem] rounded-md transition-transform hover:-translate-y-px";
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function SecondaryCta({ href, children, external }: Props) {
  const cls =
    "inline-flex items-center font-mono text-[0.8125rem] tracking-[0.04em] bg-transparent text-fg-0 px-4 py-[0.625rem] rounded-md border border-divider hover:border-primary transition-colors";
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
