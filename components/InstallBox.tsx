"use client";

import { useState } from "react";

type Props = {
  command: string;
  className?: string;
};

export default function InstallBox({ command, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div
      className={`inline-flex items-center gap-5 bg-bg-3 border-l-[3px] border-primary rounded-md font-mono text-[0.9375rem] text-fg-0 px-[1.125rem] py-[0.875rem] ${className}`}
    >
      <code className="font-mono">$ {command}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy install command"
        className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-fg-2 hover:text-fg-0 border border-fg-3 rounded-[3px] px-2 py-1 transition-colors"
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
