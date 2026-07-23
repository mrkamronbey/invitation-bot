'use client';

import { type ReactNode, useEffect, useRef } from 'react';

interface Props {
  readonly botUsername: string;
  readonly authUrl: string; // absolute: https://.../api/auth/telegram
}

/**
 * Telegram Login Widget — rasmiy skriptni container ichiga joylaydi.
 * Muvaffaqiyatli kirishда Telegram `authUrl`ga (query params bilan) yo'naltiradi.
 */
export function TelegramLoginButton({ botUsername, authUrl }: Props): ReactNode {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !botUsername) return;
    el.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-auth-url', authUrl);
    script.setAttribute('data-request-access', 'write');
    el.appendChild(script);
    return () => {
      el.innerHTML = '';
    };
  }, [botUsername, authUrl]);

  return <div ref={ref} className="flex min-h-[48px] justify-center" />;
}
