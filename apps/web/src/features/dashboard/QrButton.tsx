'use client';

import { type ReactNode, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/shared/ui/button';

/** Taklifnoma havolasi uchun QR-kod — ko'rsatadi va yuklab olishga beradi. */
export function QrButton({ url, name }: { readonly url: string; readonly name: string }): ReactNode {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function show(): Promise<void> {
    if (!dataUrl) {
      try {
        const png = await QRCode.toDataURL(url, {
          width: 512,
          margin: 2,
          color: { dark: '#0f3d2e', light: '#ffffff' },
        });
        setDataUrl(png);
      } catch {
        return;
      }
    }
    setOpen((v) => !v);
  }

  const fileName = `${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-qr.png`;

  return (
    <>
      <Button type="button" size="sm" variant="ghost" onClick={show}>
        QR
      </Button>
      {open && dataUrl ? (
        <div className="mt-3 flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-4">
          <img src={dataUrl} alt="QR" className="h-40 w-40" />
          <a
            href={dataUrl}
            download={fileName}
            className="text-sm font-medium text-primary hover:underline"
          >
            QR-kodni yuklab olish
          </a>
        </div>
      ) : null}
    </>
  );
}
