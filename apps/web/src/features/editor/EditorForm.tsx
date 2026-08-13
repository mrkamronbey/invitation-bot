'use client';

import { type ReactNode, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATE_CATALOG } from '@invitation/contracts';
import type { EditorInput, ScheduleRow } from '@/shared/api/editor-types';
import type { SiteDict } from '@/shared/i18n/site';
import { createInvitationAction, updateInvitationAction } from '@/app/dashboard/editor-actions';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { toast } from '@/shared/ui/toast';

/** Majburiy maydonlar — bo'sh/xato bo'lsa scroll + highlight qilinadi. */
type FieldKey = 'groomName' | 'brideName' | 'eventDate' | 'venueMapUrl';
const invalidRing = 'border-destructive ring-2 ring-destructive/40';

interface EditorFormProps {
  readonly mode: 'create' | 'edit';
  readonly invitationId?: string;
  readonly initial?: EditorInput;
  readonly t: SiteDict['editor'];
}

const empty: EditorInput = {
  templateId: TEMPLATE_CATALOG[0]?.id,
  groomName: '',
  brideName: '',
  eventDate: '',
  eventTime: '',
  venueName: '',
  venueAddress: '',
  story: '',
  dressCode: '',
  parents: { groom: { father: '', mother: '' }, bride: { father: '', mother: '' } },
  schedule: [],
  gift: { cardNumber: '', cardHolder: '', note: '' },
  gallery: [],
};

function Section({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}): ReactNode {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}): ReactNode {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

/** Taklifnoma yaratish/tahrirlash formasi + jonli preview. */
export function EditorForm({ mode, invitationId, initial, t }: EditorFormProps): ReactNode {
  const router = useRouter();
  const [f, setF] = useState<EditorInput>({ ...empty, ...initial });
  const [busy, setBusy] = useState(false);
  const [invalid, setInvalid] = useState<ReadonlySet<FieldKey>>(new Set());
  const [uploading, setUploading] = useState(false);

  const fieldRefs = useRef<Record<FieldKey, HTMLInputElement | null>>({
    groomName: null,
    brideName: null,
    eventDate: null,
    venueMapUrl: null,
  });

  const clearInvalid = (key: FieldKey): void =>
    setInvalid((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });

  async function uploadFiles(files: FileList | null): Promise<void> {
    if (!files || files.length === 0) return;
    setUploading(true);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const json = (await res.json()) as { url?: string; error?: string };
        if (json.url) added.push(json.url);
        else if (json.error) toast.error(json.error);
      } catch {
        toast.error('Rasm yuklashda xatolik.');
      }
    }
    if (added.length > 0) setF((prev) => ({ ...prev, gallery: [...(prev.gallery ?? []), ...added] }));
    setUploading(false);
  }

  const set = <K extends keyof EditorInput>(key: K, value: EditorInput[K]): void =>
    setF((prev) => ({ ...prev, [key]: value }));

  const setParent = (
    side: 'groom' | 'bride',
    who: 'father' | 'mother',
    value: string,
  ): void =>
    setF((prev) => ({
      ...prev,
      parents: {
        ...prev.parents,
        [side]: { ...prev.parents?.[side], [who]: value },
      },
    }));

  const schedule = f.schedule ?? [];
  const setSchedule = (rows: ScheduleRow[]): void => set('schedule', rows);

  const dateLabel = useMemo(() => {
    if (!f.eventDate) return '';
    const [y, m, d] = f.eventDate.split('-');
    return `${d}.${m}.${y}${f.eventTime ? ` · ${f.eventTime}` : ''}`;
  }, [f.eventDate, f.eventTime]);

  /** Majburiy maydonlarni tekshiradi; xato bo'lsa birinchisiga scroll + fokus. */
  function validate(): boolean {
    const bad: FieldKey[] = [];
    if (!f.groomName.trim()) bad.push('groomName');
    if (!f.brideName.trim()) bad.push('brideName');
    if (!f.eventDate) bad.push('eventDate');
    if (!/^https?:\/\/.+/.test((f.venueMapUrl ?? '').trim())) bad.push('venueMapUrl');

    const firstKey = bad[0];
    if (firstKey) {
      setInvalid(new Set(bad));
      toast.error(t.errFix);
      const first = fieldRefs.current[firstKey];
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => first?.focus({ preventScroll: true }), 300);
      return false;
    }
    setInvalid(new Set());
    return true;
  }

  async function submit(): Promise<void> {
    if (!validate()) return;
    setBusy(true);
    const galleryClean = (f.gallery ?? []).map((g) => g.trim()).filter(Boolean);
    const payload: EditorInput = { ...f, gallery: galleryClean };
    const res =
      mode === 'create'
        ? await createInvitationAction(payload)
        : await updateInvitationAction(invitationId ?? '', payload);
    if (res.ok) {
      router.push('/dashboard?saved=1');
    } else {
      toast.error(res.error);
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* ── Forma ── */}
      <div className="space-y-6">
        {/* Shablon tanlash — preview kartochkalari */}
        <Section title={t.secTemplate}>
          <p className="text-sm text-muted-foreground">{t.templateHint}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {TEMPLATE_CATALOG.map((tpl) => {
              const active = (f.templateId ?? TEMPLATE_CATALOG[0]?.id) === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => set('templateId', tpl.id)}
                  aria-pressed={active}
                  className={`overflow-hidden rounded-xl border-2 text-left transition-colors ${
                    active
                      ? 'border-primary ring-2 ring-primary/25'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img
                    src={tpl.previewImage}
                    alt=""
                    className="aspect-[3/5] w-full bg-muted object-cover object-top"
                  />
                  <span className="flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium">
                    {tpl.name}
                    {active ? <span className="text-primary">✓</span> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        <Section title={t.secMain}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.groom}>
              <Input
                ref={(el) => {
                  fieldRefs.current.groomName = el;
                }}
                value={f.groomName}
                onChange={(e) => {
                  set('groomName', e.target.value);
                  clearInvalid('groomName');
                }}
                placeholder="Aziz"
                aria-invalid={invalid.has('groomName')}
                className={invalid.has('groomName') ? invalidRing : undefined}
              />
            </Field>
            <Field label={t.bride}>
              <Input
                ref={(el) => {
                  fieldRefs.current.brideName = el;
                }}
                value={f.brideName}
                onChange={(e) => {
                  set('brideName', e.target.value);
                  clearInvalid('brideName');
                }}
                placeholder="Malika"
                aria-invalid={invalid.has('brideName')}
                className={invalid.has('brideName') ? invalidRing : undefined}
              />
            </Field>
            <Field label={t.date}>
              <Input
                ref={(el) => {
                  fieldRefs.current.eventDate = el;
                }}
                type="date"
                value={f.eventDate}
                onChange={(e) => {
                  set('eventDate', e.target.value);
                  clearInvalid('eventDate');
                }}
                aria-invalid={invalid.has('eventDate')}
                className={invalid.has('eventDate') ? invalidRing : undefined}
              />
            </Field>
            <Field label={t.time}>
              <Input
                type="time"
                value={f.eventTime ?? ''}
                onChange={(e) => set('eventTime', e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title={t.secVenue}>
          <Field label={t.venueName}>
            <Input
              value={f.venueName ?? ''}
              onChange={(e) => set('venueName', e.target.value)}
              placeholder="Navro‘z To‘yxonasi"
            />
          </Field>
          <Field label={t.address}>
            <Input
              value={f.venueAddress ?? ''}
              onChange={(e) => set('venueAddress', e.target.value)}
              placeholder="Toshkent sh., Chilonzor tumani"
            />
          </Field>
          <div className="space-y-1.5">
            <Label>
              {t.venueMap} <span className="text-destructive">*</span>
            </Label>
            <Input
              ref={(el) => {
                fieldRefs.current.venueMapUrl = el;
              }}
              type="url"
              inputMode="url"
              value={f.venueMapUrl ?? ''}
              onChange={(e) => {
                set('venueMapUrl', e.target.value);
                clearInvalid('venueMapUrl');
              }}
              placeholder="https://yandex.uz/maps/-/..."
              aria-invalid={invalid.has('venueMapUrl')}
              className={invalid.has('venueMapUrl') ? invalidRing : undefined}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">{t.venueMapHint}</p>
          </div>
        </Section>

        <Section title={t.secDetails}>
          <Field label={t.story}>
            <Textarea
              value={f.story ?? ''}
              onChange={(e) => set('story', e.target.value)}
              rows={3}
              placeholder="Eng baxtli kunimizda sizni ko‘rishdan mamnun bo‘lamiz."
            />
          </Field>
          <Field label={t.dressCode}>
            <Input
              value={f.dressCode ?? ''}
              onChange={(e) => set('dressCode', e.target.value)}
              placeholder="Rasmiy kiyim"
            />
          </Field>
        </Section>

        <Section title={t.secParents}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.groomFather}>
              <Input
                value={f.parents?.groom?.father ?? ''}
                onChange={(e) => setParent('groom', 'father', e.target.value)}
              />
            </Field>
            <Field label={t.groomMother}>
              <Input
                value={f.parents?.groom?.mother ?? ''}
                onChange={(e) => setParent('groom', 'mother', e.target.value)}
              />
            </Field>
            <Field label={t.brideFather}>
              <Input
                value={f.parents?.bride?.father ?? ''}
                onChange={(e) => setParent('bride', 'father', e.target.value)}
              />
            </Field>
            <Field label={t.brideMother}>
              <Input
                value={f.parents?.bride?.mother ?? ''}
                onChange={(e) => setParent('bride', 'mother', e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title={t.secSchedule}>
          <div className="space-y-3">
            {schedule.map((row, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  className="w-28"
                  value={row.time}
                  onChange={(e) => {
                    const next = [...schedule];
                    next[i] = { ...row, time: e.target.value };
                    setSchedule(next);
                  }}
                  placeholder="16:30"
                />
                <Input
                  value={row.title}
                  onChange={(e) => {
                    const next = [...schedule];
                    next[i] = { ...row, title: e.target.value };
                    setSchedule(next);
                  }}
                  placeholder="Nikoh marosimi"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSchedule(schedule.filter((_, j) => j !== i))}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSchedule([...schedule, { time: '', title: '' }])}
            >
              {t.addBand}
            </Button>
          </div>
        </Section>

        <Section title={t.secGift}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.cardNumber}>
              <Input
                value={f.gift?.cardNumber ?? ''}
                onChange={(e) => set('gift', { ...f.gift, cardNumber: e.target.value })}
                placeholder="8600 1234 5678 9010"
              />
            </Field>
            <Field label={t.cardHolder}>
              <Input
                value={f.gift?.cardHolder ?? ''}
                onChange={(e) => set('gift', { ...f.gift, cardHolder: e.target.value })}
                placeholder="Aziz Karimov"
              />
            </Field>
          </div>
          <Field label={t.note}>
            <Textarea
              rows={2}
              value={f.gift?.note ?? ''}
              onChange={(e) => set('gift', { ...f.gift, note: e.target.value })}
            />
          </Field>
        </Section>

        <Section title={t.secGallery}>
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-accent/10">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void uploadFiles(e.target.files)}
              />
              {uploading ? t.uploading : t.upload}
            </label>
            <span className="text-xs text-muted-foreground">{t.uploadHint}</span>
          </div>

          {(f.gallery ?? []).length > 0 ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {(f.gallery ?? []).map((src, i) => (
                <div key={src + i} className="group relative overflow-hidden rounded-lg border border-border">
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        'gallery',
                        (f.gallery ?? []).filter((_, j) => j !== i),
                      )
                    }
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-sm text-destructive shadow"
                    aria-label="O‘chirish"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </Section>

        <div className="flex gap-3">
          <Button onClick={submit} disabled={busy} size="lg">
            {busy ? t.saving : mode === 'create' ? t.create : t.save}
          </Button>
          <Button variant="ghost" size="lg" onClick={() => router.push('/dashboard')} disabled={busy}>
            {t.cancel}
          </Button>
        </div>
      </div>

      {/* ── Jonli preview ── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary/80">Ko‘rinishi</p>
        <div className="overflow-hidden rounded-2xl border border-gold-light/30 bg-[radial-gradient(ellipse_at_center,#12402e_0%,#0b241a_70%)] p-8 text-center">
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gold-light/90">
            Taklifnoma
          </p>
          <span className="gold-shimmer mx-auto my-4 block h-px w-8 bg-gold-light" />
          <p className="font-display text-4xl leading-tight text-ivory">
            {f.groomName || 'Kuyov'}
          </p>
          <span className="my-1 block font-display text-2xl italic text-gold-light">&amp;</span>
          <p className="font-display text-4xl leading-tight text-ivory">
            {f.brideName || 'Kelin'}
          </p>
          {dateLabel ? (
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-ivory/80">{dateLabel}</p>
          ) : null}
          {f.venueName ? <p className="mt-2 text-sm text-gold-light">{f.venueName}</p> : null}
        </div>
      </div>
    </div>
  );
}
