"use client";

import { Share2, MessageCircle, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonProps {
  titulo: string;
  slug: string;
}

export default function ShareButton({ titulo, slug }: ShareButtonProps) {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const url = `https://www.guiasports.com/noticias/${slug}`;

  const compartirWhatsApp = () => {
    const texto = `Mira esta nota en GuíaSports: *${titulo}*\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const compartirTwitter = () => {
    const texto = `${titulo} | GuíaSports`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const compartirFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setAbierto(!abierto)}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-2xl font-black uppercase text-xs italic shadow-lg hover:scale-105 transition-all"
      >
        <Share2 size={16}/> Compartir
      </button>

      {abierto && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setAbierto(false)}></div>
          <div className="absolute bottom-full right-0 mb-3 z-50 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 min-w-[220px]">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Compartir en</div>
            <div className="space-y-1">
              <button onClick={compartirWhatsApp} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                <MessageCircle size={18} className="text-green-500" /> WhatsApp
              </button>
              <button onClick={compartirTwitter} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-sky-500"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X / Twitter
              </button>
              <button onClick={compartirFacebook} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Facebook
              </button>
              <div className="border-t border-slate-800 my-1"></div>
              <button onClick={copiarEnlace} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                {copiado ? <Check size={18} className="text-[#a3e635]" /> : <Link2 size={18} className="text-slate-500" />}
                {copiado ? '¡Copiado!' : 'Copiar enlace'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
