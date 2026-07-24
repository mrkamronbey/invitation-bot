import type { ReactNode } from 'react';

interface MapBlockProps {
  readonly lat: number;
  readonly lng: number;
  readonly venueName?: string;
  readonly address?: string;
  readonly directionsLabel: string;
}

/**
 * Manzil bloki — OpenStreetMap ko'rinishi (kalitsiz) + Google/Yandex "yo'l
 * ko'rsatish" tugmalari. Royal (to'q) mavzuga mos oltin qirrali.
 */
export function MapBlock({
  lat,
  lng,
  venueName,
  address,
  directionsLabel,
}: MapBlockProps): ReactNode {
  const d = 0.008;
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  const osm = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const google = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const yandex = `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto`;

  return (
    <div className="mx-auto max-w-md">
      {venueName ? (
        <p className="text-center font-display text-2xl text-gold-light">{venueName}</p>
      ) : null}
      {address ? <p className="mt-1 text-center text-sm text-ivory/70">{address}</p> : null}

      <div className="mt-5 overflow-hidden rounded-xl border border-gold-light/30 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]">
        <iframe
          title="map"
          src={osm}
          className="h-56 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <a
          href={google}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gold-light px-6 py-2.5 text-sm font-medium text-emerald-deep transition hover:bg-gold"
        >
          {directionsLabel} · Google
        </a>
        <a
          href={yandex}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-gold-light/40 px-6 py-2.5 text-sm font-medium text-gold-light transition hover:bg-gold-light/10"
        >
          Yandex
        </a>
      </div>
    </div>
  );
}
