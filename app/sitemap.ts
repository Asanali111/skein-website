import type { MetadataRoute } from "next";
import { CLIENTS } from "@/lib/clients";

const SITE = "https://wevex.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const staticRoutes = ["", "/integrations", "/security", "/bench", "/changelog"];
  const clientRoutes = CLIENTS.map((c) => `/integrations/${c.id}`);
  return [...staticRoutes, ...clientRoutes].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));
}
