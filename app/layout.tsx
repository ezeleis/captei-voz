import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Captei Voz",
  description:
    "Fale rápido, envie profissional. Mesa de composição de áudios para corretores de imóveis.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
