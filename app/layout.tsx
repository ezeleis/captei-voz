import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";

import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Captei Voz",
  description:
    "Fale rápido, envie profissional. Mesa de composição de áudios para corretores de imóveis.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
