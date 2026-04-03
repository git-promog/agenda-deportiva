"use client";

import { Share2, MessageCircle, Link2, Check, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ShareButtonProps {
  titulo: string;
  slug?: string;
  url?: string;
  className?: string;
  variant?: 'full' | 'icon';
}

export default function ShareButton({ titulo, slug, url, className = '', variant = 'full' }: ShareButtonProps) {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shareUrl = url || (slug ? `https://www.guiasports.com/noticias/${slug}` : window.location.href);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    if (abierto) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [abierto]);

  const compartirWhatsApp = () => {
    const texto = `Mira esto en GuíaSports: *${titulo}*\n\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    setAbierto(false);
  };

  const compartirTwitter = () => {
    const texto = `${titulo} | GuíaSports`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    setAbierto(false);
  };

  const compartirFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    setAbierto(false);
  };

  const compartirEmail = () => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(titulo + ' | GuíaSports')}&body=${encodeURIComponent(`Te comparto esta nota de GuíaSports:\n\n${titulo}\n${shareUrl}`)}`;
    const link = document.createElement('a');
    link.href = mailtoLink;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAbierto(false);
  };

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const opciones = [
    { label: 'WhatsApp', icon: <MessageCircle size={16} className="text-green-500" />, action: compartirWhatsApp },
    { label: 'Facebook', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, action: compartirFacebook },
    { label: 'X / Twitter', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-sky-500"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, action: compartirTwitter },
    { label: 'Correo', icon: <Mail size={16} className="text-slate-400" />, action: compartirEmail },
    { label: copiado ? '¡Copiado!' : 'Copiar enlace', icon: copiado ? <Check size={16} className="text-[#a3e635]" /> : <Link2 size={16} className="text-slate-500" />, action: copiarEnlace },
  ];

  if (variant === 'icon') {
    return (
      <div ref={containerRef} className="relative">
        <button 
          onClick={(e) => { e.stopPropagation(); setAbierto(!abierto); }}
          className={`p-2.5 bg-slate-800/80 rounded-xl hover:bg-slate-700 transition-colors text-slate-400 hover:text-white ${className}`}
          aria-label="Compartir"
        >
          <Share2 size={14} />
        </button>

        {abierto && (
          <div className="fixed inset-0 z-[9999]" onClick={() => setAbierto(false)}>
            <div 
              className="fixed bottom-6 right-5 z-[10000] bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-2 min-w-[180px] backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-3">Compartir</div>
              <div className="space-y-0.5">
                {opciones.map((op, i) => (
                  <button 
                    key={i} 
                    onClick={(e) => { e.stopPropagation(); op.action(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/80 transition-colors"
                  >
                    {op.icon}
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button 
        onClick={() => setAbierto(!abierto)}
        className={`flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-2xl font-black uppercase text-xs italic shadow-lg hover:scale-105 transition-all ${className}`}
      >
        <Share2 size={16}/> Compartir
      </button>

      {abierto && (
        <div className="fixed inset-0 z-[9999]" onClick={() => setAbierto(false)}>
          <div 
            className="fixed bottom-6 right-5 z-[10000] bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-3 min-w-[200px] backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">Compartir en</div>
            <div className="space-y-0.5">
              {opciones.map((op, i) => (
                <button 
                  key={i} 
                  onClick={op.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/80 transition-colors"
                >
                  {op.icon}
                  {op.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
