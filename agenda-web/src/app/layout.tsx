import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Footer from "@/components/Footer";
import NavMobile from "@/components/NavMobile";
import StickyAd from "@/components/StickyAd";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GuíaSports - Dónde ver deportes hoy en México",
  description: "La guía definitiva de canales y streaming para fútbol, NBA, MLB, F1, tenis, box y más en México. ¡No te pierdas ningún partido!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#020617] pb-16 md:pb-0`}>
        {children}
        <Footer />
        <StickyAd />
        <CookieConsent />
        <NavMobile />
      </body>
      <GoogleAnalytics gaId="G-ZTLD10YLJC" />
    </html>
  );
}