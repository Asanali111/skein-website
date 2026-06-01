import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import SectionStrip from "@/components/SectionStrip";
import ClientsGallery from "@/components/ClientsGallery";
import { CLIENTS } from "@/lib/clients";

export const metadata = {
  title: "Integrations — Wevex",
  description:
    "Wevex auto-connects every coding LLM you have installed — Claude Code, Cursor, VS Code, Windsurf, Zed, Cline, Roo Code, JetBrains Junie, Amazon Q, Warp, and more.",
};

export default function IntegrationsIndex() {
  return (
    <main className="min-h-screen">
      <TopNav />
      <section className="max-w-content mx-auto px-8 sm:px-12 pt-12 pb-8">
        <div className="font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-fg-2 mb-3">
          integrations · {CLIENTS.length} clients
        </div>
        <h1 className="tagline text-3xl sm:text-4xl text-fg-0 mb-3 max-w-[36rem]">
          One bus. Every coding LLM.
        </h1>
        <p className="text-fg-1 max-w-[36rem] leading-[1.55]">
          One <code className="font-mono text-fg-0">wevex up</code> auto-connects every client
          it detects on your machine. Project-scoped configs are kept out of git automatically.
          Every supported client is below.
        </p>
      </section>
      <SectionStrip label="supported clients" />
      <ClientsGallery />
      <Footer />
    </main>
  );
}
