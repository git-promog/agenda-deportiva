export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/-+/g, '-');
}

export const TEAM_ALIASES = {
  'america': ['America', 'América', 'Club America', 'Club América', 'Aguilas America', 'Águilas América'],
  'guadalajara': ['Guadalajara', 'Chivas', 'Chivas Guadalajara'],
  'cruz-azul': ['Cruz Azul'],
  'pumas': ['Pumas', 'UNAM', 'Pumas UNAM'],
  'tigres': ['Tigres', 'UANL', 'Tigres UANL'],
  'monterrey': ['Monterrey', 'Rayados'],
  'toluca': ['Toluca'],
  'pachuca': ['Pachuca'],
  'leon': ['León', 'Leon'],
  'atlas': ['Atlas'],
  'tijuana': ['Tijuana', 'Xolos'],
  'necaxa': ['Necaxa'],
  'puebla': ['Puebla'],
  'santos-laguna': ['Santos Laguna', 'Santos'],
  'atletico-san-luis': ['Atlético de San Luis', 'Atletico de San Luis', 'ADSL', 'San Luis'],
  'fc-juarez': ['FC Juárez', 'FC Juarez', 'Juárez', 'Juarez'],
  'queretaro': ['Querétaro', 'Queretaro', 'Gallos Blancos de Querétaro', 'Gallos Blancos'],
  'atlante': ['Atlante']
};

export function canonicalTeamSlug(name) {
  if (!name) return '';
  const normalized = name.trim();
  for (const [slug, aliases] of Object.entries(TEAM_ALIASES)) {
    if (aliases.includes(normalized) || normalized.toLowerCase() === slug) {
      return slug;
    }
  }
  return slugify(normalized);
}

export function parseNumeric(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = parseInt(value, 10);
  return isNaN(num) ? 0 : num;
}

export function parseNullableNumeric(value) {
  if (value === null || value === undefined || value === '' || value === '–' || value === '-') return null;
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
}

export function normalizeTournamentSlug(text) {
  if (!text) return '';
  const lower = text.toLowerCase();
  if (lower.includes('apertura')) {
    const yearMatch = lower.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : new Date().getFullYear();
    return `apertura-${year}`;
  }
  if (lower.includes('clausura')) {
    const yearMatch = lower.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : new Date().getFullYear();
    return `clausura-${year}`;
  }
  return slugify(text);
}

export function compareTeams(team1, team2) {
  const slug1 = canonicalTeamSlug(team1);
  const slug2 = canonicalTeamSlug(team2);
  return slug1 === slug2;
}

export function validateStanding(standing) {
  const errors = [];
  if (standing.played !== (standing.won + standing.drawn + standing.lost)) {
    errors.push('played != won + drawn + lost');
  }
  if (standing.goals_difference !== (standing.goals_for - standing.goals_against)) {
    errors.push('goal_difference mismatch');
  }
  const expectedPoints = standing.won * 3 + standing.drawn;
  if (standing.points !== expectedPoints) {
    errors.push(`points mismatch: got ${standing.points}, expected ${expectedPoints}`);
  }
  return errors;
}