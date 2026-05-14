import TopNav from "@/components/TopNav";
import Hero from "@/components/Hero";
import WhatItDoes from "@/components/WhatItDoes";
import ClientsGallery from "@/components/ClientsGallery";
import Dogfood from "@/components/Dogfood";
import Footer from "@/components/Footer";
import SectionStrip from "@/components/SectionStrip";

export default function Page() {
  return (
    <main className="min-h-screen">
      <TopNav />
      <Hero />
      <SectionStrip label="what it does" />
      <WhatItDoes />
      <SectionStrip label="works with" />
      <ClientsGallery />
      <SectionStrip label="dogfood · iter 18" />
      <Dogfood />
      <Footer />
    </main>
  );
}
