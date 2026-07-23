'use client';

import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const LIGAMX_FAQS: FAQItem[] = [
  {
    question: '¿Dónde ver partidos de Liga MX hoy?',
    answer: 'En GuíaSports encontrarás la agenda completa con horarios, canales de TV abierta, cable y streaming para ver la Liga MX en vivo en México. Los canales se actualizan constantemente desde nuestra guía oficial de transmisiones.'
  },
  {
    question: '¿Cómo se ordena la Tabla General de Liga MX?',
    answer: 'La tabla se ordena por: 1) Puntos (3 por victoria, 1 por empate), 2) Diferencia de goles, 3) Goles a favor, 4) Resultado directo, 5) Goles de visitante, 6) Sorteo. Los primeros 6 clasifican directo a Liguilla; lugares 7-10 juegan Play-In.'
  },
  {
    question: '¿Cuántos equipos clasifican a la Liguilla del Apertura 2026?',
    answer: 'Seis equipos clasifican directo a cuartos de final (puestos 1-6). Los equipos en puestos 7 a 10 disputan el Play-In: 7° vs 8° (ganador a Liguilla) y 9° vs 10° (ganador enfrenta al perdedor del 7° vs 8° por el último boleto).'
  },
  {
    question: '¿Cada cuándo se actualiza la tabla de Liga MX en GuíaSports?',
    answer: 'Nuestro bot oficial sincroniza datos de Liga MX cada 2 horas automáticamente. Durante jornadas activas, la frecuencia puede aumentar. La tabla, goleadores y resultados reflejan la información oficial de ligamx.net con timestamp de última actualización visible.'
  },
  {
    question: '¿Los canales de TV son oficiales de Liga MX?',
    answer: 'No. Los canales de transmisión en GuíaSports provienen de nuestra guía propia (futbolenvivomexico.com), que tiene la información más completa y actualizada de TV abierta, cable y streaming en México. Los datos estadísticos (tabla, goleadores, resultados) sí son oficiales de Liga MX.'
  }
];

export default function LigaMxSeoFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: LIGAMX_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mb-12" aria-labelledby="faq-heading">
        <header className="mb-5">
          <h2 id="faq-heading" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500" /> Preguntas Frecuentes Liga MX
          </h2>
        </header>

        <div className="space-y-3">
          {LIGAMX_FAQS.map((faq, index) => (
            <details
              key={index}
              className="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden"
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <h3 className="font-black italic uppercase text-white leading-tight pr-8">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </summary>
              <div className="px-5 pb-5 text-slate-300 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}