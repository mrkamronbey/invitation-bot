'use client';

import { type ReactNode, useState } from 'react';
import { Button } from '@/shared/ui/button';

/** Taklifnoma havolasini clipboard'ga nusxalaydi. */
export function CopyLinkButton({ url }: { readonly url: string }): ReactNode {
  const [copied, setCopied] = useState(false);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard mavjud emas — e'tiborsiz
    }
  }

  return (
    <Button type="button" variant="secondary" size="sm" onClick={copy}>
      {copied ? 'Nusxalandi ✓' : 'Havolani nusxalash'}
    </Button>
  );
}
