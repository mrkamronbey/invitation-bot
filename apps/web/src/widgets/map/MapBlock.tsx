import type { ReactNode } from 'react';
import type { Venue } from '@invitation/domain';
import { getMessages } from '@invitation/i18n';

interface MapBlockProps {
  readonly venue: Venue;
  readonly locale: string;
}

/** To'yxona joyi — Yandex Maps (O'zbekistonda aniqroq) + "Yo'l ko'rsatish". */
export function MapBlock({ venue, locale }: MapBlockProps): ReactNode {
  const m = getMessages(locale).web;
  const geo = venue.geo;

  return (
    <div className="overflow-hidden rounded-xl border border-blush bg-white/60 shadow-sm">
      <div className="p-5 text-center">
        {venue.name ? <p className="font-serif text-xl text-ink">{venue.name}</p> : null}
        {venue.address ? <p className="mt-1 text-sm text-ink/70">{venue.address}</p> : null}
      </div>

      {geo ? (
        <>
          <iframe
            title="Yandex xarita"
            className="h-64 w-full border-0"
            loading="lazy"
            src={`https://yandex.uz/map-widget/v1/?ll=${geo.lng}%2C${geo.lat}&z=16&pt=${geo.lng}%2C${geo.lat}%2Cpm2rdm`}
          />
          <div className="p-4 text-center">
            <a
              href={`https://yandex.uz/maps/?rtext=~${geo.lat}%2C${geo.lng}&rtt=auto`}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-gold px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {m.directions}
            </a>
          </div>
        </>
      ) : null}
    </div>
  );
}
