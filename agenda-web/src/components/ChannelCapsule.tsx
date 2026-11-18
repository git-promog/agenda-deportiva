'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Tv } from 'lucide-react';
import { resolveChannelsForDisplay, type CanalDisplay } from '@/lib/channelCatalog';

interface ChannelCapsuleProps {
  canales: string | null | undefined;
  className?: string;
  showIcon?: boolean;
}

interface ChannelTooltip {
  nombre: string;
  x: number;
  y: number;
  placement: 'top' | 'bottom';
}

interface ChannelBadgeProps {
  channel: CanalDisplay;
  onShowName: (nombre: string, element: HTMLElement) => void;
  onHideName: () => void;
}

function ChannelBadge({ channel, onShowName, onHideName }: ChannelBadgeProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!channel.logo || imageFailed) {
    return (
      <span
        className={`inline-flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-md border px-2.5 py-1.5 text-[11px] font-bold ${
          channel.unconfirmed
            ? 'border-amber-400/20 bg-amber-400/10 text-amber-200'
            : 'border-white/10 bg-white/[0.06] text-slate-200'
        }`}
      >
        {channel.nombre}
      </span>
    );
  }

  return (
    <button
      type="button"
      data-channel-badge
      aria-label={channel.nombre}
      className="relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-md border border-white/10 bg-slate-900/80 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      onMouseEnter={(event) => onShowName(channel.nombre, event.currentTarget)}
      onMouseLeave={onHideName}
      onFocus={(event) => onShowName(channel.nombre, event.currentTarget)}
      onBlur={onHideName}
      onClick={(event) => {
        event.stopPropagation();
        onShowName(channel.nombre, event.currentTarget);
      }}
    >
      <Image
        src={channel.logo}
        alt=""
        width={44}
        height={44}
        loading="lazy"
        decoding="async"
        className="h-full w-full rounded-md object-cover"
        onError={() => setImageFailed(true)}
      />
    </button>
  );
}

export default function ChannelCapsule({
  canales,
  className = '',
  showIcon = true,
}: ChannelCapsuleProps) {
  const channels = resolveChannelsForDisplay(canales);
  const [tooltip, setTooltip] = useState<ChannelTooltip | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollInfo, setScrollInfo] = useState({
    overflow: false,
    progress: 0,
    thumb: 100,
  });

  const updateScrollInfo = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const maxScroll = element.scrollWidth - element.clientWidth;
    const overflow = maxScroll > 2;
    const progress = overflow ? element.scrollLeft / maxScroll : 0;
    const thumb = element.scrollWidth > 0
      ? Math.min(100, Math.max(14, (element.clientWidth / element.scrollWidth) * 100))
      : 100;

    setScrollInfo((previous) => {
      if (
        previous.overflow === overflow &&
        Math.abs(previous.progress - progress) < 0.01 &&
        Math.abs(previous.thumb - thumb) < 0.01
      ) {
        return previous;
      }
      return { overflow, progress, thumb };
    });
  }, []);

  useEffect(() => {
    updateScrollInfo();
    const element = scrollRef.current;
    const content = contentRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(updateScrollInfo);
    observer.observe(element);
    if (content) observer.observe(content);
    return () => observer.disconnect();
  }, [canales, updateScrollInfo]);

  const showName = (nombre: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const placement: ChannelTooltip['placement'] = rect.top < 64 ? 'bottom' : 'top';
    const margin = 84;
    setTooltip({
      nombre,
      x: Math.min(Math.max(rect.left + rect.width / 2, margin), window.innerWidth - margin),
      y: placement === 'top' ? rect.top - 8 : rect.bottom + 8,
      placement,
    });
  };

  const hideName = () => setTooltip(null);

  useEffect(() => {
    if (!tooltip) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-channel-badge]')) return;
      setTooltip(null);
    };
    const handleScroll = () => setTooltip(null);
    const handleResize = () => setTooltip(null);

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [tooltip]);

  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      {showIcon && (
        <span
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300"
          aria-hidden="true"
        >
          <Tv size={21} strokeWidth={2.2} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={updateScrollInfo}
          className="min-w-0 overflow-x-auto rounded-full border border-sky-400/20 bg-slate-950/70 px-2 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Canales de transmisión"
        >
          <div ref={contentRef} className="mx-auto flex w-max items-center gap-1.5">
            {channels.map((channel) => (
              <ChannelBadge
                key={`${channel.id}-${channel.nombre}`}
                channel={channel}
                onShowName={showName}
                onHideName={hideName}
              />
            ))}
          </div>
        </div>

        {scrollInfo.overflow && (
          <>
            <div className="relative mt-0.5 h-0.5 w-full overflow-hidden rounded-full bg-sky-400/15" aria-hidden="true">
              <span
                className="absolute top-0 h-full rounded-full bg-sky-400/70 transition-[left] duration-150"
                style={{
                  width: `${scrollInfo.thumb}%`,
                  left: `${scrollInfo.progress * (100 - scrollInfo.thumb)}%`,
                }}
              />
            </div>
            <span className="sr-only">Desliza horizontalmente para ver más canales</span>
          </>
        )}
      </div>

      {tooltip &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            role="tooltip"
            style={{ left: tooltip.x, top: tooltip.y }}
            className={`pointer-events-none fixed z-[300] max-w-[12rem] -translate-x-1/2 rounded-md border border-sky-400/30 bg-slate-950/95 px-2 py-1 text-center text-[10px] font-bold leading-snug text-slate-100 shadow-lg ${
              tooltip.placement === 'top' ? '-translate-y-full' : ''
            }`}
          >
            {tooltip.nombre}
          </span>,
          document.body
        )}
    </div>
  );
}
