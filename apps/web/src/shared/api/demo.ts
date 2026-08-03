import type { Invitation } from '@invitation/domain';

/**
 * Namuna taklifnoma — Supabase env sozlanmaganida (masalan lokal/preview'da)
 * `/aziz-va-malika` sahifasi tirik ko'rinishi uchun.
 */
export const demoInvitation: Invitation = {
  id: '00000000-0000-0000-0000-000000000001',
  ownerId: '00000000-0000-0000-0000-000000000000',
  slug: 'aziz-va-malika',
  templateId: 'chateau',
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
  parents: {
    groom: { father: 'Karim aka', mother: 'Zulfiya opa' },
    bride: { father: 'Rustam aka', mother: 'Nodira opa' },
  },
  schedule: [
    { time: '16:30', title: 'Mehmonlarni kutib olish' },
    { time: '17:00', title: 'Nikoh marosimi' },
    { time: '18:30', title: 'Ziyofat' },
    { time: '21:00', title: 'Yakuniy qism' },
  ],
  gift: {
    cardNumber: '8600 1234 5678 9010',
    cardHolder: 'Aziz Karimov',
    note: 'Ishtirokingizning o‘zi biz uchun eng katta sovg‘a. Xohlasangiz, quyidagi kartaga o‘tkazishingiz mumkin.',
  },
  coverImageUrl: '/images/floral-cover.jpg',
  gallery: [
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80',
  ],
  musicSource: 'none',
  status: 'published',
  isPremium: false,
  locale: 'uz',
};
