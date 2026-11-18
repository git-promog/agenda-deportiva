'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import ChannelCapsule from '@/components/ChannelCapsule';
import { resolveChannelsForDisplay } from '@/lib/channelCatalog';
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
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setShowVideo(desktopQuery.matches && !reducedMotionQuery.matches);
    };

    update();
    desktopQuery.addEventListener?.('change', update);
    reducedMotionQuery.addEventListener?.('change', update);

    return () => {
      desktopQuery.removeEventListener?.('change', update);
      reducedMotionQuery.removeEventListener?.('change', update);
    };
  }, []);

  if (!evento) return null;

  const live = isEventLive(evento.fecha, evento.hora);
  const fecha = formatMexicoDate(evento.fecha, 'short');
  const teams = evento.evento.split(/ vs /i);
  const isMatch = teams.length === 2;
  const canales = resolveChannelsForDisplay(evento.canales)
    .map((canal) => canal.nombre)
    .join(' · ');
  const eventUrl = `https://www.guiasports.com/?evento=${evento.id}`;

  return (
    <article className="gs-home-hero" aria-labelledby="home-hero-title">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-home-poster.jpg')" }}
        aria-hidden="true"
      />
      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-home-poster.jpg"
          aria-hidden="true"
          className="gs-home-hero-video"
        >
          <source src="/video/herohome.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-slate-950/80" aria-hidden="true" />
      <div className="gs-home-hero-content">
        <div className="gs-home-hero-top">
          <div className={`gs-home-hero-label ${live ? 'gs-home-hero-label-live' : ''}`}>
            {live && <span className="gs-results-heading-dot" aria-hidden="true" />}
            <span>{live ? 'En vivo ahora' : tipo}</span>
          </div>

          <div className="gs-home-hero-side">
            <div className="gs-home-hero-side-copy">
              <span className="gs-home-hero-sport">
                <span className="gs-home-hero-sport-bullet" aria-hidden="true">•</span>
                {evento.deporte || 'Deportes'}
              </span>
              <span className="gs-home-hero-league">{evento.competicion || evento.deporte}</span>
            </div>
            <span className="gs-home-hero-sport-icon" aria-hidden="true" suppressHydrationWarning>
              {EMOJIS[evento.deporte] || '🏆'}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <h2 id="home-hero-title" className="gs-home-hero-title" aria-label={evento.evento}>
            {isMatch ? (
              <>
                <span>{teams[0].trim()}</span>
                <span className="gs-home-hero-vs">vs</span>
                <span>{teams[1].trim()}</span>
              </>
            ) : (
              evento.evento
            )}
          </h2>

          <div className="gs-home-hero-info mt-5" aria-label="Información del evento">
            <div className="gs-home-hero-info-item">
              <span className="gs-home-hero-info-label">Cuándo</span>
              <span className="gs-home-hero-info-value gs-home-hero-info-value-time">
                <Clock className="mr-1 inline-block" size={17} aria-hidden="true" />
                {evento.hora || 'Por definir'} <span aria-hidden="true">•</span> {fecha}
              </span>
            </div>
            <div className="gs-home-hero-info-item">
              <span className="gs-home-hero-info-label">Dónde verlo</span>
              <span className="gs-home-hero-info-value line-clamp-1">{canales || 'Por confirmar'}</span>
            </div>
          </div>
        </div>

        <div className="gs-home-hero-actions">
          <ChannelCapsule canales={evento.canales} className="min-w-0 flex-1" />
          <ShareButton
            titulo={evento.evento}
            url={eventUrl}
            variant="icon"
            className="gs-home-hero-share !min-h-11 !min-w-11 !rounded-lg"
          />
          {onClick && (
            <button
              type="button"
              onClick={onClick}
              className="gs-home-hero-primary"
              aria-label={`Ver detalles de ${evento.evento}`}
            >
              <ChevronRight size={21} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
