import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import SectionStrip from "@/components/SectionStrip";
import ClientsGallery from "@/components/ClientsGallery";

export const metadata = {
  title: "Integrations — Wevex",
  description: "Wevex gives every coding LLM durable cross-session memory. Configs for Claude Desktop, Cursor, Codex, VS Code, Antigravity, and opencode.",
};

export default function IntegrationsIndex() {
  return (
    <main className="min-h-screen">
      <TopNav />
      <section className="max-w-content mx-auto px-8 sm:px-12 pt-12 pb-8">
        <div className="font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-fg-2 mb-3">
          integrations
        </div>
        <h1 className="tagline text-3xl sm:text-4xl text-fg-0 mb-3 max-w-[36rem]">
          One bus. Every coding LLM.
        </h1>
        <p className="text-fg-1 max-w-[36rem] leading-[1.55]">
          Wevex speaks MCP — every supported client connects with a single config block.
          Pick yours below.
        </p>
      </section>
      <SectionStrip label="supported clients" />
      <ClientsGallery />
      <Footer />
    </main>
  );
}
