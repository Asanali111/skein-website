import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wevex — one memory across every coding LLM",
  description:
    "Local-first context bus for Claude Code, Cursor, VS Code, Windsurf, Zed, Cline, and 14 more coding LLMs. No vendor lock-in. No cloud round-trip. The daemon runs on 127.0.0.1.",
  metadataBase: new URL("https://wevex.vercel.app"),
  openGraph: {
    title: "Wevex",
    description:
      "Local-first context bus for Claude Code, Cursor, VS Code, Windsurf, Zed, Cline, and 14 more coding LLMs. Apache 2.0, runs on 127.0.0.1.",
    type: "website",
    url: "https://wevex.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wevex — one memory across every coding LLM",
    description:
      "Local-first context bus for every coding LLM. Apache 2.0, runs on 127.0.0.1.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

const themeInit = `(function(){try{var s=localStorage.getItem('wevex-theme');var t=s==='light'?'light':'dark';document.documentElement.classList.add(t);document.documentElement.dataset.theme=t;}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans bg-bg-0 text-fg-0">{children}</body>
    </html>
  );
}
