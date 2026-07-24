import 'server-only';
import { cookies } from 'next/headers';

export type SiteLang = 'uz' | 'ru';
export const SITE_LANG_COOKIE = 'site_lang';

/** Cookie'dan sayt tilini o'qiydi (default uz). */
export async function getSiteLang(): Promise<SiteLang> {
  const v = (await cookies()).get(SITE_LANG_COOKIE)?.value;
  return v === 'ru' ? 'ru' : 'uz';
}

export interface SiteDict {
  nav: { login: string; start: string };
  hero: { badge: string; title1: string; title2: string; subtitle: string; create: string; demo: string };
  about: { eyebrow: string; title: string; text: string };
  how: { title: string; subtitle: string; steps: Array<{ title: string; text: string }> };
  invite: { eyebrow: string; title: string; subtitle: string; items: Array<{ title: string; text: string }>; more: string };
  why: { title: string; items: Array<{ title: string; text: string }> };
  sample: { eyebrow: string; title: string; subtitle: string; open: string };
  faq: { title: string; items: Array<{ q: string; a: string }> };
  cta: { title: string; text: string; tg: string; site: string };
  footer: string;
  login: { title: string; subtitle: string; notConfigured: string; hint: string; errServer: string; errAuth: string };
  dash: {
    title: string; hello: (n: string) => string; newBtn: string; saved: string;
    empty: string; emptyHint: string; nashr: string; qoralama: string;
    responses: string; guestsWord: string; view: string; copy: string; copied: string;
    guests: string; edit: string; del: string; logout: string;
  };
}

const uz: SiteDict = {
  nav: { login: 'Kirish', start: 'Boshlash' },
  hero: {
    badge: 'To‘y taklifnomasi · O‘zbekiston',
    title1: 'Chiroyli to‘y taklifnomasi,',
    title2: '2 daqiqada',
    subtitle:
      'Botdan yoki saytdan yarating — tizim nafis, animatsiyali web taklifnoma tayyorlaydi va har biriga noyob havola beradi.',
    create: 'Telegramda yaratish',
    demo: 'Namunani ko‘rish',
  },
  about: {
    eyebrow: 'taklif.uz nima?',
    title: 'Zamonaviy elektron taklifnoma',
    text: 'taklif.uz — to‘y uchun chiroyli web taklifnoma yaratish xizmati. Kuyov-kelin bot yoki sayt orqali ma’lumot kiritadi, tizim esa mobil, animatsiyali sahifa tayyorlaydi. Mehmonlar havolani ochib, to‘y haqidagi hamma narsani ko‘radi va kelishini bildiradi.',
  },
  how: {
    title: 'Qanday ishlaydi?',
    subtitle: 'Uch oddiy qadam.',
    steps: [
      { title: 'Boshlang', text: 'Telegram bot orqali yoki saytga kirib yangi taklifnoma yarating.' },
      { title: 'Ma’lumot kiriting', text: 'Ism, sana, joy, ota-onalar, kun tartibi, rasm — to‘ldirasiz.' },
      { title: 'Ulashing', text: 'Har taklifnomaga noyob havola — mehmonlarga yuborasiz, xolos.' },
    ],
  },
  invite: {
    eyebrow: 'Mehmon nimani ko‘radi',
    title: 'Taklifnomada nima bor?',
    subtitle: 'Havola ochilganda mehmonni kutayotgan narsalar.',
    items: [
      { title: 'Teskari sanoq', text: 'To‘yga qolgan kun, soat, daqiqani jonli sanaydi.' },
      { title: 'Manzil va xarita', text: 'To‘yxona joyi — “Yo‘l ko‘rsatish” tugmasi bilan.' },
      { title: 'Galereya', text: 'Suratlaringiz nafis ko‘rinishda.' },
      { title: 'Kun tartibi', text: 'Marosim jadvali — mehmon nima qachon bo‘lishini biladi.' },
      { title: 'RSVP javoblar', text: 'Mehmon “kelaman” bossa — sizga xabar keladi.' },
      { title: 'Sovg‘a va tilaklar', text: 'Karta ma’lumoti va tilaklar devori.' },
    ],
    more: 'Fon musiqasi · Tilaklar devori · Yumshoq animatsiyalar',
  },
  why: {
    title: 'Nega taklif.uz?',
    items: [
      { title: '2 daqiqada tayyor', text: 'Tez va oson — dizayn ustida bosh qotirmaysiz.' },
      { title: 'Premium dizayn', text: 'Nafis animatsiyali, mobil uchun mukammal sahifa.' },
      { title: 'Noyob havola', text: 'Har taklifnoma faqat o‘zining maxsus havolasida.' },
    ],
  },
  sample: {
    eyebrow: 'Namuna',
    title: 'O‘z ko‘zingiz bilan ko‘ring',
    subtitle: 'Tayyor taklifnoma qanday ko‘rinishini oching.',
    open: 'Namunani ochish',
  },
  faq: {
    title: 'Savol-javob',
    items: [
      { q: 'Qog‘oz taklifnoma kerakmi?', a: 'Yo‘q. Bu to‘liq elektron taklifnoma — havolani WhatsApp, Telegram yoki SMS orqali yuborasiz.' },
      { q: 'Botsiz, saytdan ham yarata olamanmi?', a: 'Ha. Ham botdan, ham saytdan yaratasiz — taklifnomalaringiz bitta kabinetda.' },
      { q: 'Keyin o‘zgartira olamanmi?', a: 'Albatta. Kabinetda istalgan vaqtda tahrirlaysiz — havola o‘zgarmaydi.' },
      { q: 'Mehmon javobini qanday bilaman?', a: 'Barcha “kelaman/kelmayman” javoblari kabinetda statistikada ko‘rinadi.' },
    ],
  },
  cta: {
    title: 'To‘yingizni chiroyli boshlang',
    text: 'Hoziroq yaratib, ulashishga tayyor taklifnomangizni oling.',
    tg: 'Telegramda boshlash',
    site: 'Saytga kirish',
  },
  footer: 'elektron to‘y taklifnomalari',
  login: {
    title: 'Xush kelibsiz',
    subtitle: 'Taklifnomalaringizni boshqarish uchun Telegram orqali kiring.',
    notConfigured: 'Login sozlanmagan (NEXT_PUBLIC_TELEGRAM_BOT_USERNAME kerak).',
    hint: 'Botda ro‘yxatdan o‘tgan bo‘lsangiz — o‘sha akkaunt bilan kiraverasiz.',
    errServer: 'Serverda xatolik. Birozdan so‘ng qayta urinib ko‘ring.',
    errAuth: 'Kirish tasdiqlanmadi. Qayta urinib ko‘ring.',
  },
  dash: {
    title: 'Taklifnomalarim',
    hello: (n) => `Salom, ${n}! Bu yerda taklifnomalaringizni boshqarasiz.`,
    newBtn: '+ Yangi taklifnoma',
    saved: '✓ Saqlandi! Havolani nusxalab ulashishingiz mumkin.',
    empty: 'Hozircha taklifnoma yo‘q',
    emptyHint: 'Bot yoki sayt orqali birinchi taklifnomangizni yarating.',
    nashr: 'Nashr',
    qoralama: 'Qoralama',
    responses: 'javob',
    guestsWord: 'mehmon',
    view: 'Ko‘rish',
    copy: 'Havolani nusxalash',
    copied: 'Nusxalandi ✓',
    guests: 'Mehmonlar',
    edit: 'Tahrir',
    del: 'O‘chirish',
    logout: 'Chiqish',
  },
};

const ru: SiteDict = {
  nav: { login: 'Войти', start: 'Начать' },
  hero: {
    badge: 'Свадебное приглашение · Узбекистан',
    title1: 'Красивое свадебное приглашение,',
    title2: 'за 2 минуты',
    subtitle:
      'Создайте через бот или на сайте — система соберёт изящное, анимированное веб-приглашение и даст уникальную ссылку.',
    create: 'Создать в Telegram',
    demo: 'Посмотреть пример',
  },
  about: {
    eyebrow: 'Что такое taklif.uz?',
    title: 'Современное электронное приглашение',
    text: 'taklif.uz — сервис создания красивых веб-приглашений на свадьбу. Жених и невеста вводят данные через бот или сайт, а система готовит мобильную анимированную страницу. Гости открывают ссылку, видят всё о свадьбе и отмечают, придут ли они.',
  },
  how: {
    title: 'Как это работает?',
    subtitle: 'Три простых шага.',
    steps: [
      { title: 'Начните', text: 'Создайте приглашение через Telegram-бот или на сайте.' },
      { title: 'Введите данные', text: 'Имена, дата, место, родители, программа, фото.' },
      { title: 'Поделитесь', text: 'У каждого приглашения — своя уникальная ссылка для гостей.' },
    ],
  },
  invite: {
    eyebrow: 'Что видит гость',
    title: 'Что внутри приглашения?',
    subtitle: 'Что ждёт гостя при открытии ссылки.',
    items: [
      { title: 'Обратный отсчёт', text: 'Живой отсчёт дней, часов и минут до свадьбы.' },
      { title: 'Адрес и карта', text: 'Место с кнопкой «Построить маршрут».' },
      { title: 'Галерея', text: 'Ваши фотографии в изящном виде.' },
      { title: 'Программа дня', text: 'Расписание — гость знает, что и когда.' },
      { title: 'Ответы RSVP', text: 'Гость отметит «приду» — вам придёт уведомление.' },
      { title: 'Подарок и пожелания', text: 'Данные карты и стена пожеланий.' },
    ],
    more: 'Фоновая музыка · Стена пожеланий · Плавные анимации',
  },
  why: {
    title: 'Почему taklif.uz?',
    items: [
      { title: 'Готово за 2 минуты', text: 'Быстро и просто — не нужно думать о дизайне.' },
      { title: 'Премиум-дизайн', text: 'Изящная анимация, идеально для телефона.' },
      { title: 'Уникальная ссылка', text: 'Каждое приглашение — только на своей ссылке.' },
    ],
  },
  sample: {
    eyebrow: 'Пример',
    title: 'Посмотрите своими глазами',
    subtitle: 'Откройте, как выглядит готовое приглашение.',
    open: 'Открыть пример',
  },
  faq: {
    title: 'Вопросы и ответы',
    items: [
      { q: 'Нужно ли бумажное приглашение?', a: 'Нет. Это полностью электронное приглашение — ссылку отправляете в WhatsApp, Telegram или SMS.' },
      { q: 'Можно создать и на сайте, без бота?', a: 'Да. И через бот, и на сайте — приглашения хранятся в одном кабинете.' },
      { q: 'Смогу ли я потом изменить?', a: 'Конечно. Редактируете в кабинете в любой момент — ссылка не меняется.' },
      { q: 'Как узнать ответы гостей?', a: 'Все ответы «приду/не приду» видны в статистике кабинета.' },
    ],
  },
  cta: {
    title: 'Начните свадьбу красиво',
    text: 'Создайте прямо сейчас и получите готовое к отправке приглашение.',
    tg: 'Начать в Telegram',
    site: 'Войти на сайт',
  },
  footer: 'электронные свадебные приглашения',
  login: {
    title: 'Добро пожаловать',
    subtitle: 'Войдите через Telegram, чтобы управлять приглашениями.',
    notConfigured: 'Вход не настроен (нужен NEXT_PUBLIC_TELEGRAM_BOT_USERNAME).',
    hint: 'Если вы регистрировались в боте — входите тем же аккаунтом.',
    errServer: 'Ошибка сервера. Попробуйте чуть позже.',
    errAuth: 'Вход не подтверждён. Попробуйте снова.',
  },
  dash: {
    title: 'Мои приглашения',
    hello: (n) => `Привет, ${n}! Здесь вы управляете приглашениями.`,
    newBtn: '+ Новое приглашение',
    saved: '✓ Сохранено! Можно скопировать ссылку и поделиться.',
    empty: 'Пока нет приглашений',
    emptyHint: 'Создайте первое приглашение через бот или сайт.',
    nashr: 'Опубл.',
    qoralama: 'Черновик',
    responses: 'ответов',
    guestsWord: 'гостей',
    view: 'Открыть',
    copy: 'Скопировать ссылку',
    copied: 'Скопировано ✓',
    guests: 'Гости',
    edit: 'Изменить',
    del: 'Удалить',
    logout: 'Выйти',
  },
};

export function getSiteDict(lang: SiteLang): SiteDict {
  return lang === 'ru' ? ru : uz;
}
