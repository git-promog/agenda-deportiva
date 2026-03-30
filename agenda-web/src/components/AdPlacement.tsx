export default function AdPlacement({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center mx-auto my-8 px-2 overflow-hidden ${className}`}>
      <div className="w-full max-w-[300px] sm:max-w-[336px] mx-auto bg-[#020617] border border-slate-800/60 rounded-xl overflow-hidden relative group shrink-0">
        
        {/* Etiqueta de Anuncio */}
        <div className="bg-slate-900/80 text-[8px] text-slate-500 uppercase tracking-[0.2em] font-black text-center py-1 border-b border-slate-800/60">
          Publicidad
        </div>
        
        {/* Contenedor Dummy (Simulando un bloque rectangular grande 336x280 o responsive) */}
        <div className="w-full min-h-[250px] bg-gradient-to-br from-slate-900 to-[#0f172a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Patrón Visual */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
          
          <div className="text-slate-700 font-bold text-xs italic z-10 text-center mb-2">
            [ Espacio de AdSense Inactivo ]
          </div>
          <p className="text-[10px] text-slate-600 text-center px-4">
            Este bloque reservado garantiza que la estructura no "brinque" cuando se activen los anuncios reales (Previene Cumulative Layout Shift).
          </p>
        </div>

      </div>
    </div>
  );
}
