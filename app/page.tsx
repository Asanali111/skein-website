import TopNav from "@/components/TopNav";
import Hero from "@/components/Hero";
import WhatItDoes from "@/components/WhatItDoes";
import ClientsGallery from "@/components/ClientsGallery";
import Dogfood from "@/components/Dogfood";
import Footer from "@/components/Footer";
import SectionStrip from "@/components/SectionStrip";
import Reveal from "@/components/Reveal";

export default function Page() {
  return (
    <main className="min-h-screen">
      <TopNav />
      <Hero />
      <SectionStrip label="what it does" />
      <Reveal>
        <WhatItDoes />
      </Reveal>
      <SectionStrip label="works with" />
      <Reveal delay={60}>
        <ClientsGallery />
      </Reveal>
      <SectionStrip label="dogfood · may 2026" />
      <Reveal delay={60}>
        <Dogfood />
      </Reveal>
      <Footer />
    </main>
  );
}
