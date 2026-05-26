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
    id: "brew",
    label: "brew",
    command: "brew install asanali111/wevex/wevex && wevex up",
    note: "Recommended on macOS. Self-contained Python venv; brew handles updates via `brew upgrade wevex`.",
    recommended: true,
  },
  {
    id: "pipx",
    label: "pipx",
    command: "pipx install wevex --python python3.12 && wevex up",
    note: "Cross-platform — isolated env, auto-PATH. The `--python python3.12` pin is needed until onnxruntime ships Python 3.14 wheels; drop the flag once it does.",
  },
  {
    id: "uv",
    label: "uv",
    command: "uv tool install wevex && wevex up",
    note: "Fastest install path if you already have uv. Cross-platform.",
  },
  {
    id: "pip",
    label: "pip",
    command: "pip install --user wevex && hash -r && wevex up",
    note: "Plain pip works but needs a PATH refresh — that's what `hash -r` does. Prefer brew or pipx.",
  },
  {
    id: "windows",
    label: "Windows",
    command: "py -m pip install --user wevex; wevex up",
    note: "PowerShell. `wevex up` registers a Scheduled Task at user logon so the daemon auto-starts after reboot (no admin needed). State lives in %APPDATA%\\wevex\\.",
  },
];

type Props = {
  className?: string;
};

export default function InstallTabs({ className = "" }: Props) {
  const [activeId, setActiveId] = useState<string>("brew");
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
          "pixel-corner-sm flex items-center gap-5 bg-bg-3 border-l-[3px] border-primary font-mono text-[0.9375rem] text-fg-0 px-[1.125rem] py-[0.875rem]",
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

    </div>
  );
}
