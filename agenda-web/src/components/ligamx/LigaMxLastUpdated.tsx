import { RefreshCw, Clock } from 'lucide-react';

interface LigaMxLastUpdatedProps {
  lastUpdated?: string;
}

export default function LigaMxLastUpdated({ lastUpdated }: LigaMxLastUpdatedProps) {
  if (!lastUpdated) return null;

  const date = new Date(lastUpdated);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  let timeAgo = '';
  if (diffMinutes < 1) timeAgo = 'Justo ahora';
  else if (diffMinutes < 60) timeAgo = `Hace ${diffMinutes} min`;
  else if (diffMinutes < 1440) timeAgo = `Hace ${Math.floor(diffMinutes / 60)} h`;
  else timeAgo = date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 p-4 bg-gradient-to-r from-slate-900/50 to-slate-800/30 border border-slate-700/50 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
          <RefreshCw className="w-4 h-4 text-green-400 animate-spin-slow" />
          <span className="text-[10px] font-black text-green-400 uppercase tracking-wider">Datos oficiales Liga MX</span>
        </div>
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
          <Clock className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">Canales: GuíaSports</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-right sm:text-left">
        <span className="text-[9px] text-slate-500 uppercase tracking-wider">Última sincronización:</span>
        <time
          className="font-black text-white text-sm"
          dateTime={lastUpdated}
        >
          {timeAgo}
        </time>
      </div>
    </div>
  );
}