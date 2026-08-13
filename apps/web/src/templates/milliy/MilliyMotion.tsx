'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Milliy shablon animatsiya qatlami (GSAP + ScrollTrigger).
 *
 * Markup deklarativ qoladi — elementlarga `data-*` atributlari qo'yiladi,
 * mantiq shu yerda turadi:
 *   data-anim="rise"      — pastdan yumshoq chiqish
 *   data-anim="letters"   — harf-harf ochilish (sarlavhalar)
 *   data-anim="draw"      — SVG chiziq o'zini chizadi (naqshlar)
 *   data-anim="zoom"      — kichikdan kattaga
 *   data-anim="line"      — chiziq markazdan yoyiladi
 *   data-parallax="0.25"  — scroll bilan sekin siljish (chuqurlik)
 *   data-stagger          — ichidagi bolalar ketma-ket chiqadi
 *
 * `prefers-reduced-motion` yoqilgan bo'lsa — hamma narsa darhol ko'rinadi.
 */
export function MilliyMotion({ children }: { readonly children: ReactNode }): ReactNode {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.querySelectorAll<HTMLElement>('[data-anim]').forEach((n) => {
        n.style.opacity = '1';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const IN = { start: 'top 88%', toggleActions: 'play none none reverse' } as const;

      // ── Pastdan chiqish ──
      gsap.utils.toArray<HTMLElement>('[data-anim="rise"]').forEach((n) => {
        gsap.from(n, {
          opacity: 0,
          y: 46,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: n, ...IN },
        });
      });

      // ── Kichikdan kattaga ──
      gsap.utils.toArray<HTMLElement>('[data-anim="zoom"]').forEach((n) => {
        gsap.from(n, {
          opacity: 0,
          scale: 0.82,
          duration: 1.15,
          ease: 'back.out(1.5)',
          scrollTrigger: { trigger: n, ...IN },
        });
      });

      // ── Chiziq markazdan yoyiladi ──
      gsap.utils.toArray<HTMLElement>('[data-anim="line"]').forEach((n) => {
        gsap.from(n, {
          scaleX: 0,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
          transformOrigin: 'center',
          scrollTrigger: { trigger: n, ...IN },
        });
      });

      // ── Harf-harf ochilish ──
      gsap.utils.toArray<HTMLElement>('[data-anim="letters"]').forEach((n) => {
        const text = n.textContent ?? '';
        if (!text.trim() || n.dataset.split === '1') return;
        n.dataset.split = '1';
        n.textContent = '';
        const frag = document.createDocumentFragment();
        for (const ch of Array.from(text)) {
          const s = document.createElement('span');
          s.textContent = ch === ' ' ? ' ' : ch;
          s.style.display = 'inline-block';
          s.style.willChange = 'transform, opacity';
          frag.appendChild(s);
        }
        n.appendChild(frag);
        gsap.from(n.children, {
          opacity: 0,
          y: 34,
          rotateX: -70,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.035,
          scrollTrigger: { trigger: n, ...IN },
        });
      });

      // ── SVG naqsh o'zini chizadi ──
      gsap.utils.toArray<SVGElement>('[data-anim="draw"]').forEach((svg) => {
        const strokes = svg.querySelectorAll<SVGGeometryElement>('path, polygon, line, circle, rect');
        strokes.forEach((p) => {
          let len = 0;
          try {
            len = p.getTotalLength();
          } catch {
            return; // <rect>/<circle> ba'zan qo'llab-quvvatlanmaydi
          }
          if (!len) return;
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.to(strokes, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.inOut',
          stagger: 0.09,
          scrollTrigger: { trigger: svg, start: 'top 92%', toggleActions: 'play none none reverse' },
        });
      });

      // ── Ketma-ket (stagger) guruhlar ──
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        gsap.from(Array.from(group.children), {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.14,
          scrollTrigger: { trigger: group, ...IN },
        });
      });

      // ── Parallax (chuqurlik) ──
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((n) => {
        const depth = Number(n.dataset.parallax ?? '0.2');
        gsap.to(n, {
          yPercent: -depth * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: n.parentElement ?? n,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      });

      // ── Sekin aylanuvchi naqsh (fon medalyoni) ──
      gsap.utils.toArray<HTMLElement>('[data-spin]').forEach((n) => {
        gsap.to(n, {
          rotate: Number(n.dataset.spin ?? '25'),
          ease: 'none',
          scrollTrigger: {
            trigger: n.parentElement ?? n,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, el);

    // Rasm/shrift yuklangach o'lchamlar o'zgaradi — qayta hisoblash
    const refresh = (): void => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t = window.setTimeout(refresh, 700);

    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
