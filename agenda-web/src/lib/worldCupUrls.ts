import type { WCMatch } from "@/data/mundialData";
import { SITE_URL, slugifyText } from "@/lib/eventUrls";

export function buildWorldCupMatchSlug(match: WCMatch) {
  const teamsPart = slugifyText(`${match.equipo1} vs ${match.equipo2}`);
  const phasePart = slugifyText(match.fase || "mundial-2026");
  const datePart = slugifyText(match.fecha || "partido");
  return `${teamsPart}-${phasePart}-${datePart}--${match.id}`;
}

export function getWorldCupMatchIdFromSlug(slug: string) {
  const decoded = decodeURIComponent(slug);
  const markerIndex = decoded.lastIndexOf("--");
  if (markerIndex === -1) return null;
  const id = decoded.slice(markerIndex + 2).trim();
  return id || null;
}

export function buildWorldCupMatchPath(match: WCMatch) {
  return `/mundial-2026/partido/${buildWorldCupMatchSlug(match)}`;
}

export function buildWorldCupMatchUrl(match: WCMatch) {
  return `${SITE_URL}${buildWorldCupMatchPath(match)}`;
}
