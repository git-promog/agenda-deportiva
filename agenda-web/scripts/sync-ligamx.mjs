import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import { getCanonicalTeam, parseNumber, parseDecimal, slugify } from './lib/ligamx-normalize.mjs';

const DRY_RUN = process.argv.includes('--dry-run');
const TOURNAMENT_SLUG = 'apertura-2026';
const LIGAMX_BASE_URL = 'https://ligamx.net';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '').trim();

let supabase = null;
if (!DRY_RUN) {
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Variables de entorno Supabase no encontradas.');
    console.error(`  - URL presente: ${Boolean(supabaseUrl)}`);
    console.error(`  - Key presente: ${Boolean(supabaseKey)}`);
    console.error('Se requiere NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY/SUPABASE_KEY.');
    process.exit(1);
  }
  supabase = createClient(supabaseUrl, supabaseKey);
}

function fetchPageHtml(url, cookieJarFile = null) {
  try {
    const cookieArg = cookieJarFile ? `-b "${cookieJarFile}" -c "${cookieJarFile}"` : '';
    const cmd = `curl -sL ${cookieArg} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" "${url}"`;
    return execSync(cmd).toString();
  } catch (err) {
    console.error(`❌ Error haciendo curl a ${url}:`, err.message);
    return null;
  }
}

function getTableEndpoints(html) {
  const standingsMatch = html.match(/href="(\/cancha\/tablas\/tablaGeneralClasificacion\/sp\/[a-zA-Z0-9]+)"/);
  const scorersMatch = html.match(/href="(\/cancha\/tablas\/tablaGoleoCompleta\/sp\/[a-zA-Z0-9]+)"/);
  
  return {
    standingsUrl: standingsMatch ? `${LIGAMX_BASE_URL}${standingsMatch[1]}` : null,
    scorersUrl: scorersMatch ? `${LIGAMX_BASE_URL}${scorersMatch[1]}` : null,
  };
}

function parseStandings(html) {
  const trMatch = html.match(/<tr style="display: table-row ;">([\s\S]*?)<\/tr>/i);
  if (!trMatch) return [];

  const tds = trMatch[1].split(/<td[^>]*>/i).slice(1);
  const standings = [];

  for (let i = 0; i < tds.length; i += 26) {
    const rawCells = tds.slice(i, i + 26).map(t =>
      t.replace(/<\/td>[\s\S]*/, '')
       .replace(/<[^>]+>/g, '')
       .replace(/-->/g, '')
       .trim()
       .split('\n')[0]
    );

    if (rawCells.length < 26) continue;

    const position = parseNumber(rawCells[0]);
    const rawTeamName = rawCells[1];
    const { slug: teamSlug, canonicalName: teamName } = getCanonicalTeam(rawTeamName);

    const played = parseNumber(rawCells[2]);
    const won = parseNumber(rawCells[3]);
    const drawn = parseNumber(rawCells[4]);
    const lost = parseNumber(rawCells[5]);
    const goalsFor = parseNumber(rawCells[6]);
    const goalsAgainst = parseNumber(rawCells[7]);
    const goalDifference = parseNumber(rawCells[8]);
    const points = parseNumber(rawCells[9]);

    const homePlayed = parseNumber(rawCells[10]);
    const homeWon = parseNumber(rawCells[11]);
    const homeDrawn = parseNumber(rawCells[12]);
    const homeLost = parseNumber(rawCells[13]);
    const homeGoalsFor = parseNumber(rawCells[14]);
    const homeGoalsAgainst = parseNumber(rawCells[15]);
    const homeGoalDifference = parseNumber(rawCells[16]);
    const homePoints = parseNumber(rawCells[17]);

    const awayPlayed = parseNumber(rawCells[18]);
    const awayWon = parseNumber(rawCells[19]);
    const awayDrawn = parseNumber(rawCells[20]);
    const awayLost = parseNumber(rawCells[21]);
    const awayGoalsFor = parseNumber(rawCells[22]);
    const awayGoalsAgainst = parseNumber(rawCells[23]);
    const awayGoalDifference = parseNumber(rawCells[24]);
    const awayPoints = parseNumber(rawCells[25]);

    standings.push({
      tournament_slug: TOURNAMENT_SLUG,
      team_slug: teamSlug,
      position,
      team_name: teamName,
      played,
      won,
      drawn,
      lost,
      goals_for: goalsFor,
      goals_against: goalsAgainst,
      goal_difference: goalDifference,
      points,
      home_played: homePlayed,
      home_won: homeWon,
      home_drawn: homeDrawn,
      home_lost: homeLost,
      home_goals_for: homeGoalsFor,
      home_goals_against: homeGoalsAgainst,
      home_goal_difference: homeGoalDifference,
      home_points: homePoints,
      away_played: awayPlayed,
      away_won: awayWon,
      away_drawn: awayDrawn,
      away_lost: awayLost,
      away_goals_for: awayGoalsFor,
      away_goals_against: awayGoalsAgainst,
      away_goal_difference: awayGoalDifference,
      away_points: awayPoints,
      source_url: `${LIGAMX_BASE_URL}/cancha/estadistica`,
      synced_at: new Date().toISOString()
    });
  }

  return standings;
}

function parseTopScorers(html) {
  const matches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  const scorers = [];

  matches.forEach((m) => {
    const rawContent = m[1];
    if (!rawContent.includes('<td')) return;

    const rawTds = rawContent.split(/<td[^>]*>/i).slice(1);
    const tds = rawTds.map(td =>
      td.replace(/<\/td>[\s\S]*/, '')
        .replace(/<[^>]+>/g, '')
        .replace(/-->/g, '')
        .trim()
    ).filter(Boolean);

    if (tds.length >= 7) {
      const posStr = tds[0].replace(/[^0-9]/g, '');
      const position = parseNumber(posStr);
      const playerName = tds[1];
      const playerSlug = slugify(playerName);
      const rawTeamName = tds[2];
      const { slug: teamSlug, canonicalName: teamName } = getCanonicalTeam(rawTeamName);
      const goals = parseNumber(tds[3]);
      const minutesPlayed = parseNumber(tds[4]);
      const scoresEveryMinutes = parseDecimal(tds[5]);
      const nationality = tds[6];

      if (position > 0 && playerName && goals > 0) {
        scorers.push({
          tournament_slug: TOURNAMENT_SLUG,
          player_slug: playerSlug,
          position,
          player_name: playerName,
          team_name: teamName,
          team_slug: teamSlug,
          goals,
          minutes_played: minutesPlayed,
          scores_every_minutes: scoresEveryMinutes,
          nationality,
          source_url: `${LIGAMX_BASE_URL}/cancha/estadistica`,
          synced_at: new Date().toISOString()
        });
      }
    }
  });

  return scorers;
}

function validateStandings(standings) {
  const warnings = [];
  if (standings.length < 12) {
    throw new Error(`Validación fallida: Solo se parsearon ${standings.length} equipos (mínimo 12).`);
  }

  let totalGoalsFor = 0;
  let totalGoalsAgainst = 0;

  standings.forEach(team => {
    if (team.played !== team.won + team.drawn + team.lost) {
      warnings.push(`Inconsistencia en juegos de ${team.team_name}: ${team.played} != ${team.won}+${team.drawn}+${team.lost}`);
    }
    if (team.goal_difference !== team.goals_for - team.goals_against) {
      warnings.push(`Inconsistencia en diferencia de goles de ${team.team_name}: ${team.goal_difference} != ${team.goals_for}-${team.goals_against}`);
    }
    totalGoalsFor += team.goals_for;
    totalGoalsAgainst += team.goals_against;
  });

  if (totalGoalsFor !== totalGoalsAgainst) {
    warnings.push(`Total GF (${totalGoalsFor}) no coincide con Total GC (${totalGoalsAgainst}).`);
  }

  return warnings;
}

async function main() {
  console.log(`🚀 Iniciando bot sync-ligamx (Modo: ${DRY_RUN ? 'DRY-RUN' : 'PROD'})...`);
  const startTime = Date.now();

  const cookieJar = './node_modules/.cache/ligamx_cookies.txt';
  const mainHtml = fetchPageHtml(`${LIGAMX_BASE_URL}/cancha/estadistica`, cookieJar);
  if (!mainHtml) {
    console.error('❌ Abortando: No se pudo obtener la página principal de estadística.');
    process.exit(1);
  }

  const { standingsUrl, scorersUrl } = getTableEndpoints(mainHtml);
  console.log(`📍 Endpoint Tabla General: ${standingsUrl}`);
  console.log(`📍 Endpoint Goleo: ${scorersUrl}`);

  if (!standingsUrl || !scorersUrl) {
    console.error('❌ Abortando: No se encontraron las URLs de las tablas oficiales.');
    process.exit(1);
  }

  const standingsHtml = fetchPageHtml(standingsUrl, cookieJar);
  const scorersHtml = fetchPageHtml(scorersUrl, cookieJar);

  const standings = parseStandings(standingsHtml || '');
  const scorers = parseTopScorers(scorersHtml || '');

  console.log(`📊 Tabla General parseada: ${standings.length} equipos.`);
  console.log(`⚽ Goleadores parseados: ${scorers.length} jugadores.`);

  const warnings = validateStandings(standings);
  if (warnings.length > 0) {
    console.warn('⚠️ Alertas de validación:');
    warnings.forEach(w => console.warn(`   - ${w}`));
  }

  if (DRY_RUN) {
    console.log('\n--- RESUMEN DRY-RUN ---');
    console.log('Top 3 Tabla General:');
    console.table(standings.slice(0, 3).map(t => ({ Pos: t.position, Club: t.team_name, JJ: t.played, PTS: t.points, DIF: t.goal_difference })));
    console.log('\nTop 3 Goleadores:');
    console.table(scorers.slice(0, 3).map(s => ({ Pos: s.position, Jugador: s.player_name, Club: s.team_name, Goles: s.goals })));
    console.log('\n✅ Simulación completada exitosamente sin modificar Supabase.');
    return;
  }

  // Guardar run en Supabase
  let runId = null;
  const { data: runData, error: runError } = await supabase
    .from('ligamx_sync_runs')
    .insert({
      source: 'ligamx.net',
      tournament_slug: TOURNAMENT_SLUG,
      status: 'running',
      fetched_url: `${LIGAMX_BASE_URL}/cancha/estadistica`,
      rows_standings: standings.length,
      rows_scorers: scorers.length
    })
    .select('id')
    .single();

  if (runError) {
    console.error('⚠️ Error al registrar run en ligamx_sync_runs:', runError.message);
  } else {
    runId = runData.id;
  }

  try {
    // Upsert Standings
    if (standings.length > 0) {
      const { error: stdErr } = await supabase
        .from('ligamx_standings_latest')
        .upsert(standings, { onConflict: 'tournament_slug,team_slug' });

      if (stdErr) throw new Error(`Error en upsert standings: ${stdErr.message}`);

      // Snapshots si hay runId
      if (runId) {
        const snapshots = standings.map(s => ({
          run_id: runId,
          tournament_slug: s.tournament_slug,
          team_slug: s.team_slug,
          position: s.position,
          team_name: s.team_name,
          played: s.played,
          won: s.won,
          drawn: s.drawn,
          lost: s.lost,
          goals_for: s.goals_for,
          goals_against: s.goals_against,
          goal_difference: s.goal_difference,
          points: s.points
        }));
        await supabase.from('ligamx_standings_snapshots').insert(snapshots);
      }
    }

    // Upsert Top Scorers
    if (scorers.length > 0) {
      const { error: scErr } = await supabase
        .from('ligamx_top_scorers_latest')
        .upsert(scorers, { onConflict: 'tournament_slug,player_slug' });

      if (scErr) throw new Error(`Error en upsert top scorers: ${scErr.message}`);
    }

    if (runId) {
      await supabase
        .from('ligamx_sync_runs')
        .update({
          status: 'success',
          finished_at: new Date().toISOString()
        })
        .eq('id', runId);
    }

    console.log(`✅ Sincronización exitosa en ${(Date.now() - startTime) / 1000}s.`);
  } catch (err) {
    console.error('❌ Error durante la sincronización:', err.message);
    if (runId) {
      await supabase
        .from('ligamx_sync_runs')
        .update({
          status: 'error',
          error_message: err.message,
          finished_at: new Date().toISOString()
        })
        .eq('id', runId);
    }
    process.exit(1);
  }
}

main();
