import { Metadata } from 'next';
import ContactoForm from './ContactoForm';

export const metadata: Metadata = {
  title: "Contacto | GuíaSports - Agenda Deportiva de México",
  description: "¿Tienes sugerencias, reportes de canales o propuestas de publicidad? Contáctanos en GuíaSports. Respondemos en menos de 24 horas.",
  alternates: {
    canonical: "https://www.guiasports.com/contacto",
  },
  openGraph: {
    title: "Contacto | GuíaSports",
    description: "Contáctanos para sugerencias, reportes o propuestas de publicidad.",
    type: "website",
    locale: "es_MX",
    url: "https://www.guiasports.com/contacto",
  },
};

export default function ContactoPage() {
  return <ContactoForm />;
}
