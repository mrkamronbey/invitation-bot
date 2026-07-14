import type { Invitation } from '@invitation/domain';

/**
 * Namuna taklifnoma — Supabase env sozlanmaganida (masalan lokal/preview'da)
 * `/aziz-va-malika` sahifasi tirik ko'rinishi uchun.
 */
export const demoInvitation: Invitation = {
  id: '00000000-0000-0000-0000-000000000001',
  ownerId: '00000000-0000-0000-0000-000000000000',
  slug: 'aziz-va-malika',
  templateId: 'classic',
  groomName: 'Aziz',
  brideName: 'Malika',
  eventDate: '2026-09-15',
  eventTime: '17:00',
  venue: {
    name: 'Navro‘z To‘yxonasi',
    address: 'Toshkent sh., Chilonzor tumani',
    geo: { lat: 41.2995, lng: 69.2401 },
  },
  story:
    'Ikki yurak bir bo‘ldi. Eng baxtli kunimizda siz — aziz mehmonimizni ko‘rishdan mamnun bo‘lamiz.',
  dressCode: 'Rasmiy kiyim',
  coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
  ],
  musicSource: 'none',
  status: 'published',
  isPremium: false,
  locale: 'uz',
};
