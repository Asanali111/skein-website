"use client";

import Link from "next/link";
import { useState } from "react";
import { CLIENTS } from "@/lib/clients";

export default function ClientsGallery() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  };

  return (
    <section id="integrations" className="bg-bg-0">
      <div className="max-w-content mx-auto px-8 sm:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CLIENTS.map((c) => {
            const open = openId === c.id;
            const cmd = c.install.kind === "command" ? c.install.cmd : "";
            return (
              <div
                key={c.id}
                className={[
                  "group relative bg-bg-1 border rounded-lg p-5 transition-all duration-200",
                  open ? "border-primary md:col-span-2 md:row-span-2" : "border-divider hover:border-fg-3 hover:-translate-y-0.5",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : c.id)}
                  className="block w-full text-left"
                  aria-expanded={open}
                  aria-controls={`client-${c.id}-detail`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2">
                      {c.id}
                    </span>
                    <span className="font-mono text-xs text-fg-3 group-hover:text-primary transition-colors">
                      {open ? "↑ close" : "↓ install"}
                    </span>
                  </div>
                  <div className="card-title text-lg text-fg-0 mb-2">{c.name}</div>
                  <p className="text-sm leading-[1.5] text-fg-1">{c.blurb}</p>
                </button>

                {open && (
                  <div
                    id={`client-${c.id}-detail`}
                    className="mt-5 pt-5 border-t border-divider space-y-4"
                  >
                    {c.install.kind === "command" && (
                      <div>
                        <div className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-fg-3 mb-2">
                          one-line install
                        </div>
                        <div className="pixel-corner-sm flex items-center gap-3 bg-bg-3 border-l-2 border-primary font-mono text-[0.8125rem] text-fg-0 px-3 py-2.5">
                          <code className="flex-1 break-all">$ {cmd}</code>
                          <button
                            type="button"
                            onClick={() => copy(c.id, cmd)}
                            className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-fg-2 hover:text-fg-0 border border-fg-3 rounded px-2 py-1 transition-colors"
                          >
                            {copiedId === c.id ? "copied" : "copy"}
                          </button>
                        </div>
                        {c.install.note && (
                          <p className="mt-2 text-[0.75rem] text-fg-2 leading-relaxed">
                            {c.install.note}
                          </p>
                        )}
                      </div>
                    )}

                    {c.config && c.config.kind === "config" && (
                      <div>
                        <div className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-fg-3 mb-2">
                          or by hand · <span className="text-fg-2">{c.config.path}</span>
                        </div>
                        <pre className="bg-bg-3 border-l-2 border-divider rounded-md font-mono text-[0.75rem] leading-[1.55] text-fg-1 px-3 py-2.5 overflow-x-auto">
                          <code>{c.config.content}</code>
                        </pre>
                      </div>
                    )}

                    <Link
                      href={`/integrations/${c.id}`}
                      className="inline-flex items-center font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-2 hover:text-primary transition-colors"
                    >
                      full integration page →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
