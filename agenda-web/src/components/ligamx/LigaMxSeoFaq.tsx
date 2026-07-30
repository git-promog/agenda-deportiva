'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { LIGA_MX_FAQS } from '@/lib/ligamx-faqs';

export default function LigaMxSeoFaq() {
  return (
    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 mb-12 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">
          Preguntas Frecuentes <span className="text-blue-500">Liga MX</span>
        </h2>
      </div>

      <div className="space-y-4">
        {LIGA_MX_FAQS.map((faq, index) => (
          <article
            key={index}
            className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5"
          >
            <h3 className="font-bold text-sm text-slate-200 mb-2 leading-snug">
              {faq.question}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {faq.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
