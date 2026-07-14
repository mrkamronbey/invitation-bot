# Shriftlar

Gilroy shrift fayllarini shu papkaga tashlang (aynan shu nomlar bilan):

- `Gilroy-Regular.woff2` (400)
- `Gilroy-Medium.woff2` (500)
- `Gilroy-SemiBold.woff2` (600)
- `Gilroy-Bold.woff2` (700)

`.woff2` yo'q bo'lsa `.ttf`/`.otf` ni ham qo'yish mumkin — u holda
`apps/web/src/app/globals.css` dagi `@font-face` `src` larini mos formatga o'zgartiring
(masalan `format('truetype')` va `.ttf`).

Fayl bo'lmasa sayt tizim shriftiga tushadi — build buzilmaydi.
