"use client";

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  titulo: string;
  slug: string;
}

export default function ShareButton({ titulo, slug }: ShareButtonProps) {
  const compartirWhatsApp = () => {
    const texto = `Mira esta previa en GuíaSports: *${titulo}*\n\nhttps://guiasports.com/noticias/${slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <button 
      onClick={compartirWhatsApp}
      className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-2xl font-black uppercase text-xs italic shadow-lg hover:scale-105 transition-all"
    >
      <Share2 size={16}/> Compartir en WhatsApp
    </button>
  );
}
