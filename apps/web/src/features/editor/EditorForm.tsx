'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EditorInput, ScheduleRow } from '@/shared/api/editor-types';
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
export function EditorForm({ mode, invitationId, initial }: EditorFormProps): ReactNode {
  const router = useRouter();
  const [f, setF] = useState<EditorInput>({ ...empty, ...initial });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <Section title="Asosiy">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kuyov ismi">
              <Input
                value={f.groomName}
                onChange={(e) => set('groomName', e.target.value)}
                placeholder="Aziz"
              />
            </Field>
            <Field label="Kelin ismi">
              <Input
                value={f.brideName}
                onChange={(e) => set('brideName', e.target.value)}
                placeholder="Malika"
              />
            </Field>
            <Field label="Sana">
              <Input
                type="date"
                value={f.eventDate}
                onChange={(e) => set('eventDate', e.target.value)}
              />
            </Field>
            <Field label="Vaqt (ixtiyoriy)">
              <Input
                type="time"
                value={f.eventTime ?? ''}
                onChange={(e) => set('eventTime', e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="To‘yxona / joy">
          <Field label="To‘yxona nomi">
            <Input
              value={f.venueName ?? ''}
              onChange={(e) => set('venueName', e.target.value)}
              placeholder="Navro‘z To‘yxonasi"
            />
          </Field>
          <Field label="Manzil">
            <Input
              value={f.venueAddress ?? ''}
              onChange={(e) => set('venueAddress', e.target.value)}
              placeholder="Toshkent sh., Chilonzor tumani"
            />
          </Field>
        </Section>

        <Section title="Tafsilotlar">
          <Field label="Qisqa hikoya / taklif matni">
            <Textarea
              value={f.story ?? ''}
              onChange={(e) => set('story', e.target.value)}
              rows={3}
              placeholder="Eng baxtli kunimizda sizni ko‘rishdan mamnun bo‘lamiz."
            />
          </Field>
          <Field label="Dress-code (ixtiyoriy)">
            <Input
              value={f.dressCode ?? ''}
              onChange={(e) => set('dressCode', e.target.value)}
              placeholder="Rasmiy kiyim"
            />
          </Field>
        </Section>

        <Section title="Ota-onalar (ixtiyoriy)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kuyov otasi">
              <Input
                value={f.parents?.groom?.father ?? ''}
                onChange={(e) => setParent('groom', 'father', e.target.value)}
              />
            </Field>
            <Field label="Kuyov onasi">
              <Input
                value={f.parents?.groom?.mother ?? ''}
                onChange={(e) => setParent('groom', 'mother', e.target.value)}
              />
            </Field>
            <Field label="Kelin otasi">
              <Input
                value={f.parents?.bride?.father ?? ''}
                onChange={(e) => setParent('bride', 'father', e.target.value)}
              />
            </Field>
            <Field label="Kelin onasi">
              <Input
                value={f.parents?.bride?.mother ?? ''}
                onChange={(e) => setParent('bride', 'mother', e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Kun tartibi (ixtiyoriy)">
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
              + Band qo‘shish
            </Button>
          </div>
        </Section>

        <Section title="Sovg‘a (ixtiyoriy)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Karta raqami">
              <Input
                value={f.gift?.cardNumber ?? ''}
                onChange={(e) => set('gift', { ...f.gift, cardNumber: e.target.value })}
                placeholder="8600 1234 5678 9010"
              />
            </Field>
            <Field label="Karta egasi">
              <Input
                value={f.gift?.cardHolder ?? ''}
                onChange={(e) => set('gift', { ...f.gift, cardHolder: e.target.value })}
                placeholder="Aziz Karimov"
              />
            </Field>
          </div>
          <Field label="Izoh">
            <Textarea
              rows={2}
              value={f.gift?.note ?? ''}
              onChange={(e) => set('gift', { ...f.gift, note: e.target.value })}
            />
          </Field>
        </Section>

        <Section title="Galereya (ixtiyoriy)">
          <Field label="Rasm URL manzillari — har biri yangi qatorda">
            <Textarea
              rows={4}
              value={(f.gallery ?? []).join('\n')}
              onChange={(e) => set('gallery', e.target.value.split('\n'))}
              placeholder="https://...jpg"
            />
          </Field>
        </Section>

        {error ? (
          <p className="rounded-lg bg-destructive/15 px-4 py-3 text-sm text-destructive-foreground">
            {error}
          </p>
        ) : null}

        <div className="flex gap-3">
          <Button onClick={submit} disabled={busy} size="lg">
            {busy ? 'Saqlanmoqda…' : mode === 'create' ? 'Yaratish' : 'Saqlash'}
          </Button>
          <Button variant="ghost" size="lg" onClick={() => router.push('/dashboard')} disabled={busy}>
            Bekor qilish
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
