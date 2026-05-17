"use client";

import { useState } from "react";

type Tab = {
  id: string;
  label: string;
  command: string;
  note?: string;
  disabled?: boolean;
  recommended?: boolean;
};

const TABS: Tab[] = [
  {
    id: "pipx",
    label: "pipx",
    command: "pipx install skn && skein up",
    note: "Recommended — isolated env, auto-PATH, single command works on a clean machine.",
    recommended: true,
  },
  {
    id: "uv",
    label: "uv",
    command: "uv tool install skn && skein up",
    note: "Fastest install path if you already have uv.",
  },
  {
    id: "pip",
    label: "pip",
    command: "pip install --user skn && hash -r && skein up",
    note: "Plain pip works but needs a PATH refresh — that's what `hash -r` does. Prefer pipx.",
  },
  {
    id: "brew",
    label: "brew",
    command: "brew install skn  # coming soon",
    note: "Homebrew tap pending. Use pipx for now.",
    disabled: true,
  },
];

type Props = {
  className?: string;
};

export default function InstallTabs({ className = "" }: Props) {
  const [activeId, setActiveId] = useState<string>("pipx");
  const [copied, setCopied] = useState(false);

  const active = TABS.find((t) => t.id === activeId) ?? TABS[0];

  const handleCopy = async () => {
    if (active.disabled) return;
    try {
      await navigator.clipboard.writeText(active.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className={`max-w-xl ${className}`}>
      {/* Tab row */}
      <div
        role="tablist"
        aria-label="Install method"
        className="flex gap-1 mb-2"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveId(tab.id);
                setCopied(false);
              }}
              className={[
                "relative font-mono text-[0.75rem] uppercase tracking-[0.08em] px-3 py-1.5 rounded-t-md transition-colors inline-flex items-center gap-1.5",
                isActive
                  ? "bg-bg-3 text-fg-0 border-b-[2px] border-primary"
                  : "bg-transparent text-fg-2 hover:text-fg-1 border-b-[2px] border-transparent",
                tab.disabled ? "opacity-60" : "",
              ].join(" ")}
            >
              {tab.label}
              {tab.recommended && (
                <span
                  aria-label="recommended"
                  className="inline-block w-1.5 h-1.5 rounded-full bg-spark shadow-spark"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Command block */}
      <div
        className={[
          "flex items-center gap-5 bg-bg-3 border-l-[3px] border-primary rounded-md rounded-tl-none font-mono text-[0.9375rem] text-fg-0 px-[1.125rem] py-[0.875rem]",
          active.disabled ? "opacity-60" : "",
        ].join(" ")}
      >
        <code className="font-mono flex-1">$ {active.command}</code>
        <button
          type="button"
          onClick={handleCopy}
          disabled={active.disabled}
          aria-label="Copy install command"
          className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-fg-2 hover:text-fg-0 disabled:hover:text-fg-2 disabled:cursor-not-allowed border border-fg-3 rounded-[3px] px-2 py-1 transition-colors"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>

      {/* Footnote — per-tab help text */}
      {active.note && (
        <p className="font-sans text-[0.8125rem] text-fg-2 mt-2 leading-relaxed">
          {active.note}
        </p>
      )}

      {/* Naming note — always visible, explains the skn-vs-skein split */}
      <p className="font-sans text-[0.75rem] text-fg-3 mt-3 leading-relaxed">
        Package is <code className="font-mono text-fg-2">skn</code>; CLI command is{" "}
        <code className="font-mono text-fg-2">skein</code>. Install with{" "}
        <code className="font-mono text-fg-2">skn</code> because the
        more-obvious name is taken by an unrelated Apache project on PyPI.
      </p>
    </div>
  );
}
