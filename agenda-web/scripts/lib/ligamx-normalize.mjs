export const TEAM_ALIASES = {
  'america': ['America', 'América', 'Club America', 'Club América', 'Aguilas America', 'Águilas América'],
  'guadalajara': ['Guadalajara', 'Chivas', 'Chivas Guadalajara'],
  'cruz-azul': ['Cruz Azul'],
  'pumas': ['Pumas', 'UNAM', 'Pumas UNAM', 'Pumas de la UNAM'],
  'tigres': ['Tigres', 'UANL', 'Tigres UANL', 'Tigres de la UANL'],
  'monterrey': ['Monterrey', 'Rayados'],
  'toluca': ['Toluca'],
  'pachuca': ['Pachuca'],
  'leon': ['León', 'Leon'],
  'atlas': ['Atlas'],
  'tijuana': ['Tijuana', 'Xolos', 'Xolos de Tijuana'],
  'necaxa': ['Necaxa'],
  'puebla': ['Puebla'],
  'santos-laguna': ['Santos Laguna', 'Santos'],
  'atletico-san-luis': ['Atlético de San Luis', 'Atletico de San Luis', 'ADSL', 'San Luis'],
  'fc-juarez': ['FC Juárez', 'FC Juarez', 'Juárez', 'Juarez'],
  'queretaro': ['Querétaro', 'Queretaro', 'Gallos Blancos de Querétaro', 'Gallos Blancos'],
  'atlante': ['Atlante']
};

export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getCanonicalTeam(teamName) {
  if (!teamName) return { slug: '', canonicalName: '' };
  const cleanName = teamName.trim();
  const slugified = slugify(cleanName);

  for (const [slug, aliases] of Object.entries(TEAM_ALIASES)) {
    if (slug === slugified) {
      return { slug, canonicalName: aliases[0] };
    }
    for (const alias of aliases) {
      if (slugify(alias) === slugified) {
        return { slug, canonicalName: aliases[0] };
      }
    }
  }

  return { slug: slugified, canonicalName: cleanName };
}

export function parseNumber(val, defaultVal = 0) {
  if (val === null || val === undefined) return defaultVal;
  const str = val.toString().replace(/[^0-9.-]/g, '');
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? defaultVal : parsed;
}

export function parseDecimal(val, defaultVal = 0) {
  if (val === null || val === undefined) return defaultVal;
  const str = val.toString().replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(str);
  return isNaN(parsed) ? defaultVal : parsed;
}
