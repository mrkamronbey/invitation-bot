/**
 * To'lov (port) — monetizatsiya bosqichida ishlatiladi.
 * Bugun `TelegramStarsAdapter`, ertaga `ClickAdapter`/`PaymeAdapter` qo'shsa bo'ladi —
 * use-case o'zgarmaydi (Ports & Adapters).
 */
export interface PaymentInvoice {
  readonly payload: string;
  readonly url?: string;
}

export interface CreateInvoiceInput {
  readonly invitationId: string;
  readonly title: string;
  readonly description: string;
  readonly amountStars: number;
}

export interface PaymentPort {
  createInvoice(input: CreateInvoiceInput): Promise<PaymentInvoice>;
}
