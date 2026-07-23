import { Target, Trophy } from 'lucide-react';

interface Scorer {
  position: number;
  player_name: string;
  team_name: string;
  team_slug: string;
  goals: number;
  minutes_played?: number;
  scores_every_minutes?: number;
  nationality?: string;
}

interface LigaMxTopScorersProps {
  scorers: Scorer[];
  tournamentSlug: string;
  limit?: number;
  lastUpdated?: string;
}

export default function LigaMxTopScorers({ scorers, tournamentSlug, limit = 10, lastUpdated }: LigaMxTopScorersProps) {
  if (!scorers || scorers.length === 0) return null;

  const displayScorers = scorers.slice(0, limit);

  return (
    <section className="mb-12" aria-labelledby="scorers-heading">
      <header className="mb-5">
        <h2 id="scorers-heading" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-red-500" /> Goleadores {tournamentSlug.replace('-', ' ').toUpperCase()}
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

      <div className="space-y-3">
        {displayScorers.map((scorer, index) => (
          <article
            key={`${scorer.player_name}-${scorer.team_slug}`}
            className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex items-center gap-3 min-w-[80px]">
              <span className={`font-black text-2xl ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-white'}`}>
                {scorer.position}
              </span>
              {index < 3 && (
                <Trophy className={`w-5 h-5 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : 'text-amber-600'}`} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-black italic uppercase text-white leading-tight truncate">{scorer.player_name}</h3>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">{scorer.team_name}</p>
            </div>

            <div className="flex items-center gap-4 text-right sm:min-w-[120px]">
              <div className="flex items-center gap-1 text-red-500 font-black text-lg">
                <Target className="w-4 h-4" />
                <span>{scorer.goals}</span>
              </div>
              {scorer.minutes_played && scorer.scores_every_minutes && (
                <div className="text-[9px] text-slate-500 uppercase font-medium hidden md:block">
                  1 gol c/ {Math.round(scorer.scores_every_minutes)}&apos;
                </div>
              )}
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