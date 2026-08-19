import { Archive } from 'lucide-react';

/**
 * Kept under the historical component path for compatibility with local imports.
 * The tournament is archived, so this surface no longer renders a countdown.
 */
export default function WCCountdown() {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-6 md:p-8">
      <div className="flex items-center gap-3">
        <Archive className="text-slate-400" size={20} />
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Archivo histórico</p>
          <p className="text-sm text-slate-300 mt-1">El calendario conserva las fechas y resultados del torneo.</p>
        </div>
      </div>
    </div>
  );
}
