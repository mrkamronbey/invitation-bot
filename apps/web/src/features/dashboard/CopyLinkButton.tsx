'use client';

import { type ReactNode, useState } from 'react';
import { Button } from '@/shared/ui/button';

interface Props {
  readonly url: string;
  readonly copyLabel: string;
  readonly copiedLabel: string;
}

/** Taklifnoma havolasini clipboard'ga nusxalaydi. */
export function CopyLinkButton({ url, copyLabel, copiedLabel }: Props): ReactNode {
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
      {copied ? copiedLabel : copyLabel}
    </Button>
  );
}
