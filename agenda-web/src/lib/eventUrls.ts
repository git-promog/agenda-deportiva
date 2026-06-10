export interface EventUrlSource {
  id: string | number;
  evento: string;
  competicion?: string | null;
  fecha?: string | null;
}

export const SITE_URL = "https://www.guiasports.com";

export function slugifyText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function buildEventSlug(evento: EventUrlSource) {
  const eventPart = slugifyText(evento.evento || "evento");
  const competitionPart = slugifyText(evento.competicion || "deportes");
  const datePart = slugifyText(evento.fecha || "proximo");
  return `${eventPart}-${competitionPart}-${datePart}--${evento.id}`;
}

export function getEventIdFromSlug(slug: string) {
  const decoded = decodeURIComponent(slug);
  const markerIndex = decoded.lastIndexOf("--");
  if (markerIndex === -1) return null;
  const id = decoded.slice(markerIndex + 2).trim();
  return id || null;
}

export function buildEventPath(evento: EventUrlSource) {
  return `/evento/${buildEventSlug(evento)}`;
}

export function buildEventUrl(evento: EventUrlSource) {
  return `${SITE_URL}${buildEventPath(evento)}`;
}
