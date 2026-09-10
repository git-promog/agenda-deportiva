import React from 'react';
import { ArrowUpRight, Clock, Tv } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import { formatMexicoDate, isEventLive } from '@/lib/mexicoTime';
import { Evento } from '@/types';

const EMOJIS: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️",
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉",
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐",
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

interface Props {
  evento: Evento | null;
  tipo: string;
  onClick?: () => void;
}

export default function HomeHero({ evento, tipo, onClick }: Props) {
  if (!evento) return null;

  const live = isEventLive(evento.fecha, evento.hora);
  const fecha = formatMexicoDate(evento.fecha, 'long');
  const canal = evento.canales || 'Por confirmar';

  return (
    <article className="gs-home-hero" aria-labelledby="home-hero-title">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="gs-home-hero-video"
      >
        <source src="/video/herohome.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-950/80" aria-hidden="true" />
      <div className="gs-home-hero-content">
        <div className="gs-home-hero-top">
          <div className={`gs-home-hero-label ${live ? 'gs-home-hero-label-live' : ''}`}>
            {live && <span className="gs-results-heading-dot" aria-hidden="true" />}
            <span>{live ? 'En vivo ahora' : tipo}</span>
          </div>
          <ShareButton
            titulo={evento.evento}
            url={`https://www.guiasports.com/?evento=${evento.id}`}
            variant="icon"
            className="gs-home-hero-share"
          />
        </div>

        <div>
          <p className="gs-home-hero-context">
            <span className="mr-2 text-base" suppressHydrationWarning>{EMOJIS[evento.deporte] || '🏆'}</span>
            {evento.competicion || evento.deporte}
          </p>
          <h2 id="home-hero-title" className="gs-home-hero-title">{evento.evento}</h2>

          <div className="gs-home-hero-info mt-6" aria-label="Información del evento">
            <div className="gs-home-hero-info-item">
              <span className="gs-home-hero-info-label">Cuándo</span>
              <span className="gs-home-hero-info-value gs-home-hero-info-value-time">
                <Clock className="mr-1 inline-block" size={17} aria-hidden="true" />
                {evento.hora} · {fecha}
              </span>
            </div>
            <div className="gs-home-hero-info-item">
              <span className="gs-home-hero-info-label">Dónde verlo</span>
              <span className="gs-home-hero-info-value">
                <Tv className="mr-1 inline-block text-blue-400" size={17} aria-hidden="true" />
                {canal}
              </span>
            </div>
          </div>
        </div>

        <div className="gs-home-hero-actions">
          <span className="hidden text-xs text-slate-400 sm:inline">Consulta el detalle y guarda el contexto.</span>
          {onClick && (
            <button type="button" onClick={onClick} className="gs-home-hero-action">
              Ver evento <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
