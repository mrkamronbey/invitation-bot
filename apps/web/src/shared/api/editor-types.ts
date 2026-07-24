/** Editor formasi yuboradigan (serializable) ma'lumot — client ↔ server action. */
export interface ScheduleRow {
  time: string;
  title: string;
}

export interface EditorInput {
  groomName: string;
  brideName: string;
  eventDate: string; // YYYY-MM-DD
  eventTime?: string; // HH:mm
  venueName?: string;
  venueAddress?: string;
  venueMapUrl?: string;
  story?: string;
  dressCode?: string;
  parents?: {
    groom?: { father?: string; mother?: string };
    bride?: { father?: string; mother?: string };
  };
  schedule?: ScheduleRow[];
  gift?: { cardNumber?: string; cardHolder?: string; note?: string };
  gallery?: string[];
  locale?: string;
}

export type EditorResult = { ok: true; slug: string } | { ok: false; error: string };
