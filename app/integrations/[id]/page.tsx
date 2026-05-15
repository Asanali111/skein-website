import { notFound } from "next/navigation";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import SectionStrip from "@/components/SectionStrip";
import InstallBox from "@/components/InstallBox";
import { CLIENTS, getClient } from "@/lib/clients";

export function generateStaticParams() {
  return CLIENTS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getClient(id);
  if (!c) return { title: "Integration — Skein" };
  return {
    title: `${c.name} + Skein`,
    description: `Skein gives ${c.name} durable cross-session memory. ${c.blurb}`,
  };
}

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) notFound();

  return (
    <main className="min-h-screen">
      <TopNav />

      <section className="max-w-content mx-auto px-8 sm:px-12 pt-12 pb-10">
        <Link
          href="/integrations"
          className="inline-flex items-center font-mono text-xs text-fg-2 hover:text-primary mb-6 transition-colors"
        >
          ← all integrations
        </Link>
        <div className="font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-fg-2 mb-3">
          integration
        </div>
        <h1 className="wordmark text-[2.5rem] sm:text-[3rem] text-fg-0 mb-3">
          {client.name}
        </h1>
        <p className="tagline text-xl text-fg-0 max-w-[36rem]">
          Skein gives {client.name} durable cross-session memory.
        </p>
        <p className="mt-3 text-[0.9375rem] text-fg-1 max-w-[36rem] leading-[1.55]">
          {client.blurb}
        </p>
      </section>

      <SectionStrip label="install" />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10">
        {client.install.kind === "command" ? (
          <div>
            <div className="overflow-x-auto">
              <InstallBox command={client.install.cmd} />
            </div>
            {client.install.note && (
              <p className="mt-4 max-w-[44rem] text-sm text-fg-1 leading-[1.55]">
                {client.install.note}
              </p>
            )}
          </div>
        ) : null}

        <details className="mt-8 group">
          <summary className="cursor-pointer font-mono text-xs tracking-[0.04em] uppercase text-fg-2 hover:text-fg-0 transition-colors select-none">
            don&apos;t have <code className="font-mono">skein</code> yet?
          </summary>
          <div className="mt-3 max-w-[44rem] text-sm text-fg-1 leading-[1.6]">
            <p>Install the daemon first:</p>
            <div className="mt-2 overflow-x-auto">
              <InstallBox command="pip install skn && skein up" />
            </div>
            <p className="mt-2 text-fg-2 text-[0.8125rem]">
              The daemon binds to <code className="font-mono text-fg-0">127.0.0.1:8765</code> and
              prints a bearer token. Use <code className="font-mono text-fg-0">skein doctor</code>{" "}
              to retrieve it later.
            </p>
          </div>
        </details>
      </section>

      <SectionStrip label={`what it looks like inside ${client.name}`} />
      <section className="max-w-content mx-auto px-8 sm:px-12 py-10">
        <div className="bg-bg-1 border border-dashed border-divider rounded-lg p-10 flex flex-col items-center justify-center text-center">
          <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-3 mb-2">
            screenshot pending
          </div>
          <p className="text-sm text-fg-2 max-w-[28rem]">
            Iter 22.1 — capture of {client.name} calling{" "}
            <code className="font-mono text-fg-1">mcp__skein__recall</code> and{" "}
            <code className="font-mono text-fg-1">mcp__skein__project_briefing</code>{" "}
            on a real session.
          </p>
        </div>
      </section>

      {client.config && client.config.kind === "config" ? (
        <>
          <SectionStrip label="config" />
          <section className="max-w-content mx-auto px-8 sm:px-12 py-10">
            <div className="font-mono text-xs text-fg-2 mb-2">
              {client.config.path}
            </div>
            <pre className="bg-bg-3 border-l-2 border-primary rounded-[4px] p-5 font-mono text-[0.8125rem] leading-[1.6] text-fg-0 whitespace-pre overflow-x-auto">
              {client.config.content}
            </pre>
            <p className="mt-4 max-w-[44rem] text-[0.8125rem] text-fg-2 leading-[1.55]">
              <code className="font-mono text-fg-1">$SKEIN_TOKEN</code> is the bearer token
              printed by <code className="font-mono text-fg-1">skein up</code>. Run{" "}
              <code className="font-mono text-fg-1">skein doctor</code> to retrieve it
              at any time — the daemon never leaves <code className="font-mono text-fg-1">127.0.0.1</code>.
            </p>
          </section>
        </>
      ) : null}

      <Footer />
    </main>
  );
}
