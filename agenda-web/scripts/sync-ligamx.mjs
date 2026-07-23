#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { canonicalTeamSlug, parseNumeric, validateStanding } from './lib/ligamx-normalize.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const isDryRun = process.argv.includes('--dry-run');
const LIGAMX_BASE_URL = 'https://ligamx.net';
const LIGAMX_PARTIDOS_URL = `${LIGAMX_BASE_URL}/cancha/partidos`;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LigaMX-Sync/1.0)' } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

function parseStandings(html) {
  const standings = [];
  const tableMatch = html.match(/<table[^>]*class=".*tabla-general.*?"[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return standings;

  const rowsMatch = tableMatch[1].match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
  if (!rowsMatch) return standings;

  for (let i = 1; i < rowsMatch.length; i++) {
    const rowHtml = rowsMatch[i];
    const cells = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    if (cells.length < 13) continue;

    const getCellText = (cellHtml) => {
      return cellHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    };

    const position = parseNumeric(getCellText(cells[0]));
    const teamName = getCellText(cells[1]);
    const played = parseNumeric(getCellText(cells[2]));
    const won = parseNumeric(getCellText(cells[3]));
    const drawn = parseNumeric(getCellText(cells[4]));
    const lost = parseNumeric(getCellText(cells[5]));
    const goalsFor = parseNumeric(getCellText(cells[6]));
    const goalsAgainst = parseNumeric(getCellText(cells[7]));
    const goalDiff = parseNumeric(getCellText(cells[8]));
    const points = parseNumeric(getCellText(cells[9]));

    if (!teamName) continue;

    standings.push({
      position,
      team_name: teamName,
      team_slug: canonicalTeamSlug(teamName),
      played,
      won,
      drawn,
      lost,
      goals_for: goalsFor,
      goals_against: goalsAgainst,
      goal_difference: goalDiff,
      points,
    });
  }

  return standings;
}

function parseScorers(html) {
  const scorers = [];
  const tableMatch = html.match(/<table[^>]*class=".*goleadores.*?"[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return scorers;

  const rowsMatch = tableMatch[1].match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];

  for (let i = 1; i < rowsMatch.length; i++) {
    const rowHtml = rowsMatch[i];
    const cells = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    if (cells.length < 5) continue;

    const getCellText = (cellHtml) => {
      return cellHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    };

    const position = parseNumeric(getCellText(cells[0]));
    const playerName = getCellText(cells[1]);
    const teamName = getCellText(cells[2]);
    const goals = parseNumeric(getCellText(cells[3]));

    if (!playerName) continue;

    scorers.push({
      position,
      player_name: playerName,
      team_name: teamName,
      team_slug: canonicalTeamSlug(teamName),
      goals,
    });
  }

  return scorers;
}

function detectActiveTournament(html) {
  const tournamentMatch = html.match(/Torneo\s+(.*?)(?:\s+a\s+|\s*-\s*)(\d{4})/i);
  if (tournamentMatch) {
    const tournamentName = tournamentMatch[1].trim();
    const year = tournamentMatch[2];
    const nameLower = tournamentName.toLowerCase();
    
    if (nameLower.includes('apertura')) {
      return `apertura-${year}`;
    }
    if (nameLower.includes('clausura')) {
      return `clausura-${year}`;
    }
  }

  const aperturaMatch = html.match(/Apertura\s+(\d{4})/i);
  if (aperturaMatch) {
    return `apertura-${aperturaMatch[1]}`;
  }

  return 'apertura-2026';
}

async function syncLigaMx() {
  console.log(`\n📡  Sincronizando datos oficiales de Liga MX...`);
  console.log(`   Modo: ${isDryRun ? 'DRY-RUN (no escribe)' : 'PROD'}`);

  const runId = Date.now();
  const startedAt = new Date().toISOString();

  let html;
  try {
    html = await fetchPage(LIGAMX_PARTIDOS_URL);
  } catch (err) {
    console.error('❌ Error descargando página:', err.message);
    if (!isDryRun) {
      await supabase.from('ligamx_sync_runs').insert({
        source: 'ligamx.net',
        tournament_slug: 'apertura-2026',
        started_at: startedAt,
        finished_at: new Date().toISOString(),
        status: 'error',
        error_message: err.message,
      });
    }
    process.exit(1);
  }

  const tournamentSlug = detectActiveTournament(html);
  console.log(`   Torneo detectado: ${tournamentSlug}`);

  const standings = parseStandings(html);
  console.log(`   Tabla general: ${standings.length} equipos`);

  const scorers = parseScorers(html);
  console.log(`   Goleadores: ${scorers.length}`);

  const validationErrors = [];
  for (const s of standings) {
    const errors = validateStanding(s);
    if (errors.length > 0) {
      validationErrors.push({ team: s.team_name, errors });
    }
  }

  if (validationErrors.length > 0) {
    console.warn('   ⚠️  Errores de validación:', validationErrors);
  }

  if (standings.length < 12) {
    console.error('❌ Error: menos de 12 equipos parseados');
    process.exit(1);
  }

  console.log('\n📊 Top 3 tabla general:');
  standings.slice(0, 3).forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.team_name}: ${s.points} pts (${s.played} partidos)`);
  });

  console.log('\n🏆 Top 3 goleadores:');
  scorers.slice(0, 3).forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.player_name} (${s.team_name}): ${s.goals} goles`);
  });

  if (isDryRun) {
    console.log('\n✅ DRY-RUN completado - datos validados correctamente');
    console.log('   No se escribió nada en Supabase');
    return;
  }

  const now = new Date().toISOString();

  const { error: standingsError } = await supabase
    .from('ligamx_standings_latest')
    .upsert(standings.map(s => ({
      tournament_slug: tournamentSlug,
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
      points: s.points,
      synced_at: now,
    })), { 
      onConflict: 'tournament_slug,team_slug',
      returning: 'minimal'
    });

  if (standingsError) {
    console.error('❌ Error insertando standings:', standingsError.message);
  } else {
    console.log(`   ✅ Standings actualizados: ${standings.length} equipos`);
  }

  for (const s of standings) {
    await supabase.from('ligamx_standings_snapshots').insert({
      run_id: runId,
      tournament_slug: tournamentSlug,
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
      points: s.points,
      captured_at: now,
    });
  }
  console.log(`   ✅ Snapshots creados: ${standings.length}`);

  const { error: scorersError } = await supabase
    .from('ligamx_top_scorers_latest')
    .upsert(scorers.map(s => ({
      tournament_slug: tournamentSlug,
      player_slug: canonicalTeamSlug(s.player_name),
      position: s.position,
      player_name: s.player_name,
      team_name: s.team_name,
      team_slug: s.team_slug,
      goals: s.goals,
      synced_at: now,
    })), {
      onConflict: 'tournament_slug,player_slug',
      returning: 'minimal'
    });

  if (scorersError) {
    console.error('❌ Error insertando scorers:', scorersError.message);
  } else {
    console.log(`   ✅ Top scorers actualizados: ${scorers.length}`);
  }

  await supabase.from('ligamx_sync_runs').insert({
    source: 'ligamx.net',
    tournament_slug: tournamentSlug,
    started_at: startedAt,
    finished_at: now,
    status: 'completed',
    rows_standings: standings.length,
    rows_scorers: scorers.length,
  });

  console.log('\n✅ Sincronización completada');
}

syncLigaMx().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});