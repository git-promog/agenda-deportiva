import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Copa Mundial de la FIFA 2026™ | Calendario, Grupos y Sedes | GuíaSports',
  description:
    'Calendario oficial de los 104 partidos de la Copa Mundial de la FIFA 2026™ en México, USA y Canadá. Horarios en tu zona horaria, tabla de posiciones y sedes.',
  keywords: [
    'Copa Mundial de la FIFA 2026™',
    'Mundial 2026',
    'FIFA World Cup 2026',
    'calendario oficial Mundial 2026',
    'partidos México Mundial 2026',
    'sedes Copa del Mundo 2026',
    'FIFA 2026 schedule',
    'horarios Mundial 2026 México',
    'donde ver el Mundial 2026',
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
    title: 'Hub del Mundial 2026 — GuíaSports',
    description:
      'Calendario oficial, grupos, sedes y más del Mundial de Fútbol 2026 en México, USA y Canadá.',
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
    title: 'Hub del Mundial 2026 — GuíaSports',
    description: 'Calendario, grupos, sedes y horarios en tu zona horaria del Mundial 2026.',
    images: ['https://www.guiasports.com/og/mundial-2026.webp'],
  },
  alternates: {
    canonical: 'https://www.guiasports.com/mundial-2026',
  },
};

export default function Mundial2026Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
