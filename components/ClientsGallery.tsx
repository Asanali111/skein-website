import Link from "next/link";
import { CLIENTS } from "@/lib/clients";

export default function ClientsGallery() {
  return (
    <section id="integrations" className="bg-bg-0">
      <div className="max-w-content mx-auto px-8 sm:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CLIENTS.map((c) => (
            <Link
              key={c.id}
              href={`/integrations/${c.id}`}
              className="group block bg-bg-1 border border-divider rounded-lg p-5 transition-transform duration-150 hover:-translate-y-0.5 hover:border-fg-3"
            >
              <div className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-fg-2 mb-3">
                integration
              </div>
              <div className="card-title text-lg text-fg-0 mb-2">{c.name}</div>
              <p className="text-sm leading-[1.5] text-fg-1 mb-4">{c.blurb}</p>
              <span className="font-mono text-xs text-fg-2 group-hover:text-primary transition-colors">
                install →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
