import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mundial 2026: resultados, calendario y sedes | GuíaSports',
  description:
    'Archivo histórico de los 104 partidos del Mundial 2026 en México, Estados Unidos y Canadá: resultados, fechas, sedes y tablas.',
  keywords: [
    'Copa Mundial de la FIFA 2026™',
    'Mundial 2026',
    'FIFA World Cup 2026',
    'resultados Mundial 2026',
    'partidos México Mundial 2026',
    'sedes Copa del Mundo 2026',
    'FIFA 2026 schedule',
    'fechas Mundial 2026',
    'sedes Mundial 2026',
  ],
  authors: [{ name: 'GuíaSports', url: 'https://www.guiasports.com' }],
  creator: 'GuíaSports',
  publisher: 'GuíaSports',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'Mundial 2026: resultados, calendario y sedes — GuíaSports',
    description:
      'Archivo histórico del Mundial 2026 con resultados, grupos, sedes y fechas en México, Estados Unidos y Canadá.',
    url: 'https://www.guiasports.com/mundial-2026',
    siteName: 'GuíaSports',
    type: 'website',
    locale: 'es_MX',
    images: [
      {
        url: 'https://www.guiasports.com/og/mundial-2026.webp',
        width: 1200,
        height: 630,
        alt: 'Hub del Mundial 2026 — GuíaSports · Calendario, Grupos y Sedes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mundial 2026: resultados, calendario y sedes — GuíaSports',
    description: 'Resultados, grupos, sedes y fechas del archivo histórico del Mundial 2026.',
    images: ['https://www.guiasports.com/og/mundial-2026.webp'],
  },
  alternates: {
    canonical: 'https://www.guiasports.com/mundial-2026',
  },
};

export default function Mundial2026Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
