export default function AdPlacement({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full bg-[#0f172a] border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 my-6 overflow-hidden relative group ${className}`}>
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black mb-3 flex items-center gap-2 z-10">
        <span className="w-1 h-px bg-slate-600"></span>
        Anuncio
        <span className="w-1 h-px bg-slate-600"></span>
      </div>
      
      <div className="bg-slate-900/50 border border-slate-800/50 w-full max-w-md h-24 rounded-xl flex items-center justify-center text-slate-600 font-bold text-xs italic z-10 group-hover:border-slate-700 transition-colors">
        Espacio para Banner Comercial (Google AdSense)
      </div>
    </div>
  );
}
