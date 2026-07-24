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
  login: {
    title: string; subtitle: string; notConfigured: string; hint: string;
    errServer: string; errAuth: string;
    button: string; modalTitle: string; step1: string; openBot: string;
    step2: string; codePlaceholder: string; submit: string; submitting: string; codeError: string;
  };
  dash: {
    title: string; hello: (n: string) => string; newBtn: string; saved: string;
    empty: string; emptyHint: string; nashr: string; qoralama: string;
    responses: string; guestsWord: string; view: string; copy: string; copied: string;
    guests: string; edit: string; del: string; logout: string;
    guideTitle: string; guide1: string; guide2: string; guide3: string;
    delConfirmTitle: string; delConfirmText: string; delYes: string; delNo: string;
    navDashboard: string; navStats: string; navProfile: string;
    logoutConfirmTitle: string; logoutConfirmText: string;
  };
  stats: {
    eyebrow: string; title: string; subtitle: string;
    totalInvites: string; totalResponses: string; totalAttending: string;
    totalGuests: string; declining: string; responseRate: string;
    perInvite: string; empty: string; emptyHint: string; view: string; guests: string;
  };
  profile: {
    eyebrow: string; title: string; subtitle: string;
    account: string; name: string; telegramId: string; invitesCount: string;
    prefs: string; language: string; theme: string;
    botCard: string; botText: string; openBot: string;
  };
  editor: {
    newEyebrow: string; newTitle: string; editEyebrow: string;
    secMain: string; secVenue: string; secDetails: string; secParents: string;
    secSchedule: string; secGift: string; secGallery: string;
    groom: string; bride: string; date: string; time: string;
    venueName: string; address: string; venueMap: string; venueMapHint: string;
    story: string; dressCode: string;
    groomFather: string; groomMother: string; brideFather: string; brideMother: string;
    addBand: string; cardNumber: string; cardHolder: string; note: string;
    upload: string; uploading: string; uploadHint: string;
    create: string; save: string; saving: string; cancel: string;
    errFix: string;
  };
  guests: {
    back: string; suffix: string; responses: string; coming: string; totalGuests: string;
    comingBadge: string; notComing: string; people: string; empty: string;
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
    hint: 'Xavfsiz: telefon raqami emas, faqat bot bergan bir martalik kod.',
    errServer: 'Serverda xatolik. Birozdan so‘ng qayta urinib ko‘ring.',
    errAuth: 'Kirish tasdiqlanmadi. Qayta urinib ko‘ring.',
    button: 'Telegram orqali kirish',
    modalTitle: 'Telegram orqali kirish',
    step1: '1. Botni oching va kod oling',
    openBot: 'Botni ochish',
    step2: '2. Bot bergan 6 xonali kodni kiriting',
    codePlaceholder: '––––––',
    submit: 'Kirish',
    submitting: 'Tekshirilmoqda…',
    codeError: 'Kod noto‘g‘ri yoki muddati o‘tgan.',
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
    guideTitle: 'Keyingi qadamlar',
    guide1: 'Taklifnoma yarating yoki mavjudini tahrirlang.',
    guide2: 'Noyob havolani nusxalab mehmonlarga ulashing.',
    guide3: '“Mehmonlar” bo‘limida kim kelishini kuzatib boring.',
    delConfirmTitle: 'Taklifnomani o‘chirasizmi?',
    delConfirmText: 'Bu amalni qaytarib bo‘lmaydi. Taklifnoma va unga kelgan barcha javoblar butunlay o‘chiriladi.',
    delYes: 'Ha, o‘chirish',
    delNo: 'Bekor qilish',
    navDashboard: 'Taklifnomalar',
    navStats: 'Statistika',
    navProfile: 'Profil',
    logoutConfirmTitle: 'Hisobdan chiqasizmi?',
    logoutConfirmText: 'Siz hisobingizdan chiqasiz. Qayta kirish uchun bot orqali yangi kod olishingiz kerak bo‘ladi.',
  },
  stats: {
    eyebrow: 'Umumiy ko‘rsatkichlar',
    title: 'Statistika',
    subtitle: 'Barcha taklifnomalaringiz bo‘yicha yig‘ma ma’lumot.',
    totalInvites: 'Taklifnomalar',
    totalResponses: 'Jami javoblar',
    totalAttending: 'Kelaman deganlar',
    totalGuests: 'Jami mehmonlar',
    declining: 'Kelmaydiganlar',
    responseRate: 'O‘rtacha javob (bitta taklifnomaga)',
    perInvite: 'Taklifnomalar kesimida',
    empty: 'Hozircha ma’lumot yo‘q',
    emptyHint: 'Birinchi taklifnomangizni yaratganingizdan so‘ng statistika shu yerda paydo bo‘ladi.',
    view: 'Ko‘rish',
    guests: 'Mehmonlar',
  },
  profile: {
    eyebrow: 'Hisob',
    title: 'Profil',
    subtitle: 'Hisobingiz ma’lumotlari va sozlamalar.',
    account: 'Hisob ma’lumotlari',
    name: 'Ism',
    telegramId: 'Telegram ID',
    invitesCount: 'Taklifnomalar soni',
    prefs: 'Sozlamalar',
    language: 'Til',
    theme: 'Mavzu (och / to‘q)',
    botCard: 'Telegram bot',
    botText: 'Taklifnoma yaratish, tahrirlash va mehmon xabarlarini olish uchun botdan ham foydalanishingiz mumkin.',
    openBot: 'Botni ochish',
  },
  editor: {
    newEyebrow: 'Yangi',
    newTitle: 'Taklifnoma yaratish',
    editEyebrow: 'Tahrir',
    secMain: 'Asosiy',
    secVenue: 'To‘yxona / joy',
    secDetails: 'Tafsilotlar',
    secParents: 'Ota-onalar (ixtiyoriy)',
    secSchedule: 'Kun tartibi (ixtiyoriy)',
    secGift: 'Sovg‘a (ixtiyoriy)',
    secGallery: 'Galereya (ixtiyoriy)',
    groom: 'Kuyov ismi',
    bride: 'Kelin ismi',
    date: 'Sana',
    time: 'Vaqt (ixtiyoriy)',
    venueName: 'To‘yxona nomi',
    address: 'Manzil',
    venueMap: 'Yandex Xarita havolasi',
    venueMapHint: 'Majburiy — Yandex Xaritada to‘yxonani toping, “Ulashish” havolasini nusxalab shu yerga joylang. Mehmonlar aniq manzilni ko‘radi.',
    story: 'Qisqa hikoya / taklif matni',
    dressCode: 'Dress-code — kiyinish uslubi (ixtiyoriy)',
    groomFather: 'Kuyov otasi',
    groomMother: 'Kuyov onasi',
    brideFather: 'Kelin otasi',
    brideMother: 'Kelin onasi',
    addBand: '+ Band qo‘shish',
    cardNumber: 'Karta raqami',
    cardHolder: 'Karta egasi',
    note: 'Izoh',
    upload: '+ Rasm yuklash',
    uploading: 'Yuklanmoqda…',
    uploadHint: 'JPG/PNG, har biri 6MB gacha',
    create: 'Yaratish',
    save: 'Saqlash',
    saving: 'Saqlanmoqda…',
    cancel: 'Bekor qilish',
    errFix: 'Iltimos, belgilangan maydonlarni to‘g‘ri to‘ldiring.',
  },
  guests: {
    back: '← Orqaga',
    suffix: 'mehmonlar',
    responses: 'javob',
    coming: 'keladi',
    totalGuests: 'jami mehmon',
    comingBadge: 'Keladi',
    notComing: 'Kelmaydi',
    people: 'kishi',
    empty: 'Hozircha javoblar yo‘q. Mehmonlar javob berganda shu yerda ko‘rinadi.',
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
    hint: 'Безопасно: не номер телефона, а одноразовый код из бота.',
    errServer: 'Ошибка сервера. Попробуйте чуть позже.',
    errAuth: 'Вход не подтверждён. Попробуйте снова.',
    button: 'Войти через Telegram',
    modalTitle: 'Вход через Telegram',
    step1: '1. Откройте бот и получите код',
    openBot: 'Открыть бот',
    step2: '2. Введите 6-значный код из бота',
    codePlaceholder: '––––––',
    submit: 'Войти',
    submitting: 'Проверка…',
    codeError: 'Неверный код или срок истёк.',
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
    guideTitle: 'Дальнейшие шаги',
    guide1: 'Создайте приглашение или отредактируйте существующее.',
    guide2: 'Скопируйте уникальную ссылку и отправьте гостям.',
    guide3: 'Следите, кто придёт, в разделе «Гости».',
    delConfirmTitle: 'Удалить приглашение?',
    delConfirmText: 'Это действие необратимо. Приглашение и все полученные ответы будут удалены навсегда.',
    delYes: 'Да, удалить',
    delNo: 'Отмена',
    navDashboard: 'Приглашения',
    navStats: 'Статистика',
    navProfile: 'Профиль',
    logoutConfirmTitle: 'Выйти из аккаунта?',
    logoutConfirmText: 'Вы выйдете из аккаунта. Для повторного входа понадобится новый код из бота.',
  },
  stats: {
    eyebrow: 'Общие показатели',
    title: 'Статистика',
    subtitle: 'Сводные данные по всем вашим приглашениям.',
    totalInvites: 'Приглашений',
    totalResponses: 'Всего ответов',
    totalAttending: 'Придут',
    totalGuests: 'Всего гостей',
    declining: 'Не придут',
    responseRate: 'В среднем ответов (на приглашение)',
    perInvite: 'По приглашениям',
    empty: 'Пока нет данных',
    emptyHint: 'Статистика появится здесь после создания первого приглашения.',
    view: 'Открыть',
    guests: 'Гости',
  },
  profile: {
    eyebrow: 'Аккаунт',
    title: 'Профиль',
    subtitle: 'Данные аккаунта и настройки.',
    account: 'Данные аккаунта',
    name: 'Имя',
    telegramId: 'Telegram ID',
    invitesCount: 'Количество приглашений',
    prefs: 'Настройки',
    language: 'Язык',
    theme: 'Тема (светлая / тёмная)',
    botCard: 'Telegram-бот',
    botText: 'Вы также можете использовать бот для создания, редактирования приглашений и получения ответов гостей.',
    openBot: 'Открыть бот',
  },
  editor: {
    newEyebrow: 'Новое',
    newTitle: 'Создать приглашение',
    editEyebrow: 'Изменить',
    secMain: 'Основное',
    secVenue: 'Место',
    secDetails: 'Детали',
    secParents: 'Родители (необязательно)',
    secSchedule: 'Программа дня (необязательно)',
    secGift: 'Подарок (необязательно)',
    secGallery: 'Галерея (необязательно)',
    groom: 'Имя жениха',
    bride: 'Имя невесты',
    date: 'Дата',
    time: 'Время (необязательно)',
    venueName: 'Название места',
    address: 'Адрес',
    venueMap: 'Ссылка на Яндекс Карту',
    venueMapHint: 'Обязательно — найдите место в Яндекс Картах, скопируйте ссылку «Поделиться» и вставьте сюда. Гости увидят точный адрес.',
    story: 'Короткий текст / история',
    dressCode: 'Дресс-код — стиль одежды (необязательно)',
    groomFather: 'Отец жениха',
    groomMother: 'Мать жениха',
    brideFather: 'Отец невесты',
    brideMother: 'Мать невесты',
    addBand: '+ Добавить пункт',
    cardNumber: 'Номер карты',
    cardHolder: 'Владелец карты',
    note: 'Примечание',
    upload: '+ Загрузить фото',
    uploading: 'Загрузка…',
    uploadHint: 'JPG/PNG, до 6MB каждое',
    create: 'Создать',
    save: 'Сохранить',
    saving: 'Сохранение…',
    cancel: 'Отмена',
    errFix: 'Пожалуйста, правильно заполните отмеченные поля.',
  },
  guests: {
    back: '← Назад',
    suffix: 'гости',
    responses: 'ответов',
    coming: 'придут',
    totalGuests: 'всего гостей',
    comingBadge: 'Придёт',
    notComing: 'Не придёт',
    people: 'чел.',
    empty: 'Пока нет ответов. Ответы гостей появятся здесь.',
  },
};

export function getSiteDict(lang: SiteLang): SiteDict {
  return lang === 'ru' ? ru : uz;
}
