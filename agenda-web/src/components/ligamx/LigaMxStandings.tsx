import { Trophy, Target } from 'lucide-react';

interface Standing {
  position: number;
  team_name: string;
  team_slug: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

interface LigaMxStandingsProps {
  standings: Standing[];
  tournamentSlug: string;
  lastUpdated?: string;
}

export default function LigaMxStandings({ standings, tournamentSlug, lastUpdated }: LigaMxStandingsProps) {
  if (!standings || standings.length === 0) return null;

  const isLiguillaZone = (pos: number) => pos <= 6;
  const isPlayInZone = (pos: number) => pos >= 7 && pos <= 10;

  return (
    <section className="mb-12" aria-labelledby="standings-heading">
      <header className="mb-5">
        <h2 id="standings-heading" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" /> Tabla General {tournamentSlug.replace('-', ' ').toUpperCase()}
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

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/30">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800 text-[9px] font-black uppercase text-slate-400 tracking-wider">
              <th className="px-3 py-2.5 text-left w-10">Pos</th>
              <th className="px-3 py-2.5 text-left">Club</th>
              <th className="px-2 py-2.5 text-center hidden sm:table-cell w-12">JJ</th>
              <th className="px-2 py-2.5 text-center hidden md:table-cell w-12">JG</th>
              <th className="px-2 py-2.5 text-center hidden md:table-cell w-12">JE</th>
              <th className="px-2 py-2.5 text-center hidden md:table-cell w-12">JP</th>
              <th className="px-2 py-2.5 text-center hidden lg:table-cell w-12">GF</th>
              <th className="px-2 py-2.5 text-center hidden lg:table-cell w-12">GC</th>
              <th className="px-2 py-2.5 text-center w-14 font-bold text-yellow-500">Dif</th>
              <th className="px-3 py-2.5 text-center w-14 font-black text-white">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr
                key={team.team_slug}
                className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                  isLiguillaZone(team.position) ? 'bg-green-500/5' : isPlayInZone(team.position) ? 'bg-yellow-500/5' : ''
                }`}
              >
                <td className="px-3 py-2.5 font-black text-xl text-white">
                  {team.position}
                  {isLiguillaZone(team.position) && (
                    <span className="ml-1 text-[8px] bg-green-500 text-black px-1 rounded font-black">LIG</span>
                  )}
                  {isPlayInZone(team.position) && (
                    <span className="ml-1 text-[8px] bg-yellow-500 text-black px-1 rounded font-black">PLAY-IN</span>
                  )}
                </td>
                <td className="px-3 py-2.5 font-black italic uppercase text-white">
                  {team.team_name}
                </td>
                <td className="px-2 py-2.5 text-center text-slate-300 hidden sm:table-cell font-medium">{team.played}</td>
                <td className="px-2 py-2.5 text-center text-slate-400 hidden md:table-cell">{team.won}</td>
                <td className="px-2 py-2.5 text-center text-slate-400 hidden md:table-cell">{team.drawn}</td>
                <td className="px-2 py-2.5 text-center text-slate-400 hidden md:table-cell">{team.lost}</td>
                <td className="px-2 py-2.5 text-center text-green-400 hidden lg:table-cell font-medium">{team.goals_for}</td>
                <td className="px-2 py-2.5 text-center text-red-400 hidden lg:table-cell font-medium">{team.goals_against}</td>
                <td className="px-2 py-2.5 text-center font-black text-yellow-400 text-lg">
                  {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                </td>
                <td className="px-3 py-2.5 text-center font-black text-white text-lg">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[8px] font-black uppercase tracking-wider">
        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-400">
          <Trophy className="w-2.5 h-2.5" /> Top 6 = Liguilla directa
        </span>
        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400">
          <Target className="w-2.5 h-2.5" /> 7-10 = Play-In
        </span>
        <span className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 border border-slate-600/50 rounded text-slate-400">
          11-18 = Eliminados
        </span>
      </div>

      <p className="mt-3 text-[9px] text-slate-600 font-medium uppercase tracking-wider">
        Fuente: Liga MX oficial · Canales de TV: GuíaSports
      </p>
    </section>
  );
}