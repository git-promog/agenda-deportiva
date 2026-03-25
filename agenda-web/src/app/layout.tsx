import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer"; // <-- IMPORTANTE: Importar el footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agenda Deportiva MX - Dónde ver tus partidos hoy",
  description: "Guía de canales y streaming para eventos deportivos en México",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#020617]`}>
        {children}
        <Footer /> {/* <-- IMPORTANTE: Esto hará que aparezca en TODAS las páginas */}
      </body>
    </html>
  );
}