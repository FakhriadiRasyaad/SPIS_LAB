import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spis Lab — Laboratorium Profesional",
  description: "Laboratorium terakreditasi dengan layanan pengujian, analisis, dan riset berkualitas tinggi. Didukung teknologi mutakhir dan tim ahli berpengalaman.",
  keywords: ["laboratorium", "pengujian", "analisis", "riset", "spis lab", "lab"],
  openGraph: {
    title: "Spis Lab — Laboratorium Profesional",
    description: "Laboratorium terakreditasi dengan layanan pengujian, analisis, dan riset berkualitas tinggi.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
