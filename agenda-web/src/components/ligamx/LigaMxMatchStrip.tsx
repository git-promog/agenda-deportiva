import { CalendarDays, Clock } from 'lucide-react';

interface MatchResult {
  jornada: string;
  official_match_key: string;
  home_team_name: string;
  away_team_name: string;
  home_team_slug: string;
  away_team_slug: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
  match_date: string;
  match_time: string;
  stadium?: string;
  minute_by_minute_url?: string;
  report_url?: string;
}

interface LigaMxMatchStripProps {
  matches: MatchResult[];
  tournamentSlug: string;
  lastUpdated?: string;
}

function formatMatchDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: '2-digit' });
  } catch {
    return dateStr;
  }
}

function getStatusBadge(status: string) {
  const s = (status || '').toLowerCase();
  if (s.includes('final') || s.includes('terminado') || s.includes('finished')) {
    return (
      <span className="text-[8px] font-black text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
        Finalizado
      </span>
    );
  }
  if (s.includes('vivo') || s.includes('live') || s.includes('jugando') || s.includes('en juego')) {
    return (
      <span className="text-[8px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
        En Vivo
      </span>
    );
  }
  if (s.includes('programado') || s.includes('scheduled') || s.includes('pendiente') || s.includes('por jugar')) {
    return (
      <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
        Programado
      </span>
    );
  }
  return (
    <span className="text-[8px] font-black text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
      {status}
    </span>
  );
}

export default function LigaMxMatchStrip({ matches, tournamentSlug, lastUpdated }: LigaMxMatchStripProps) {
  if (!matches || matches.length === 0) return null;

  const groupedByJornada = matches.reduce((acc, match) => {
    const jornada = match.jornada || 'Sin jornada';
    if (!acc[jornada]) acc[jornada] = [];
    acc[jornada].push(match);
    return acc;
  }, {} as Record<string, MatchResult[]>);

  const jornadas = Object.keys(groupedByJornada).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numB - numA;
  });

  return (
    <section className="mb-12" aria-labelledby="results-heading">
      <header className="mb-5">
        <h2 id="results-heading" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-500" /> Resultados Oficiales {tournamentSlug.replace('-', ' ').toUpperCase()}
        </h2>
        {lastUpdated && (
          <p className="text-[9px] text-slate-600 font-medium uppercase tracking-wider">
            Actualizada: {new Date(lastUpdated).toLocaleString('es-MX', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/Mexico_City'
            })}
          </p>
        )}
      </header>

      <div className="space-y-6">
        {jornadas.map((jornada) => (
          <article key={jornada} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <header className="bg-slate-900/60 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <h3 className="text-[9px] font-black text-yellow-500 uppercase tracking-wider">{jornada}</h3>
              <span className="text-[8px] text-slate-500 uppercase">{groupedByJornada[jornada].length} partidos</span>
            </header>

            <div className="divide-y divide-slate-800/50">
              {groupedByJornada[jornada].map((match) => (
                <div
                  key={match.official_match_key}
                  className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex flex-col items-center sm:w-24 text-center">
                    <time className="text-[10px] font-medium text-slate-400">
                      {formatMatchDate(match.match_date)}
                    </time>
                    {match.match_time && (
                      <span className="text-[9px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {match.match_time}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center justify-end sm:justify-end flex-1 min-w-0 pr-2">
                      <span className="font-black italic uppercase text-white text-sm sm:text-base truncate text-right mr-3">
                        {match.home_team_name}
                      </span>
                      {match.home_score !== null && (
                        <span className="font-black text-2xl sm:text-3xl text-white w-14 text-center">
                          {match.home_score}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-2 sm:px-4">
                      {match.home_score !== null && match.away_score !== null ? (
                        <span className="font-black text-xl text-slate-400">-</span>
                      ) : (
                        <span className="text-[10px] text-slate-500 uppercase">vs</span>
                      )}
                      {getStatusBadge(match.status)}
                    </div>

                    <div className="flex items-center justify-start sm:justify-start flex-1 min-w-0 pl-2">
                      {match.away_score !== null && (
                        <span className="font-black text-2xl sm:text-3xl text-white w-14 text-center mr-3">
                          {match.away_score}
                        </span>
                      )}
                      <span className="font-black italic uppercase text-white text-sm sm:text-base truncate">
                        {match.away_team_name}
                      </span>
                    </div>
                  </div>

                  {(match.minute_by_minute_url || match.report_url) && (
                    <footer className="flex items-center gap-2 pt-2 border-t border-slate-800/50 w-full sm:w-auto sm:pl-28">
                      {match.minute_by_minute_url && (
                        <a
                          href={match.minute_by_minute_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-wider flex items-center gap-1"
                        >
                          Minuto a minuto
                        </a>
                      )}
                      {match.report_url && (
                        <a
                          href={match.report_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-black text-slate-400 hover:text-slate-300 uppercase tracking-wider flex items-center gap-1"
                        >
                          Informe arbitral
                        </a>
                      )}
                    </footer>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-3 text-[9px] text-slate-600 font-medium uppercase tracking-wider">
        Fuente: Liga MX oficial · Canales de TV: GuíaSports
      </p>
    </section>
  );
}