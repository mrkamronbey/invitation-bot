'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EditorInput, ScheduleRow } from '@/shared/api/editor-types';
import type { SiteDict } from '@/shared/i18n/site';
import { createInvitationAction, updateInvitationAction } from '@/app/dashboard/editor-actions';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface EditorFormProps {
  readonly mode: 'create' | 'edit';
  readonly invitationId?: string;
  readonly initial?: EditorInput;
  readonly t: SiteDict['editor'];
}

const empty: EditorInput = {
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
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
        else if (json.error) setError(json.error);
      } catch {
        setError('Rasm yuklashda xatolik.');
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

  async function submit(): Promise<void> {
    setBusy(true);
    setError(null);
    const galleryClean = (f.gallery ?? []).map((g) => g.trim()).filter(Boolean);
    const payload: EditorInput = { ...f, gallery: galleryClean };
    const res =
      mode === 'create'
        ? await createInvitationAction(payload)
        : await updateInvitationAction(invitationId ?? '', payload);
    if (res.ok) {
      router.push('/dashboard?saved=1');
    } else {
      setError(res.error);
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* ── Forma ── */}
      <div className="space-y-6">
        <Section title={t.secMain}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.groom}>
              <Input
                value={f.groomName}
                onChange={(e) => set('groomName', e.target.value)}
                placeholder="Aziz"
              />
            </Field>
            <Field label={t.bride}>
              <Input
                value={f.brideName}
                onChange={(e) => set('brideName', e.target.value)}
                placeholder="Malika"
              />
            </Field>
            <Field label={t.date}>
              <Input
                type="date"
                value={f.eventDate}
                onChange={(e) => set('eventDate', e.target.value)}
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

        {error ? (
          <p className="rounded-lg bg-destructive/15 px-4 py-3 text-sm text-destructive-foreground">
            {error}
          </p>
        ) : null}

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
