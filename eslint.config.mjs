// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Arxitektura qatlam qoidalari (Clean Architecture bog'liqlik yo'nalishi):
 *   domain      → hech narsani import qilmaydi (framework, boshqa qatlam yo'q)
 *   contracts   → mustaqil (faqat zod)
 *   application → domain + contracts (infrastructure/apps EMAS)
 *   infrastructure → domain + contracts (application/apps EMAS)
 * Bu qoidalar bog'liqlik ichkariga yo'nalishini majburlaydi.
 */
const layerBoundaries = [
  {
    files: ['packages/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@invitation/application*',
                '@invitation/infrastructure*',
                '@invitation/contracts*',
                '@invitation/i18n*',
              ],
              message: "domain qatlami toza bo'lishi kerak — boshqa qatlamlarni import qilmang.",
            },
            {
              group: ['@supabase/*', 'grammy*', 'next*', 'zod*'],
              message: "domain frameworkka/kutubxonaga bog'liq bo'lmasin (framework-agnostic).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@invitation/infrastructure*'],
              message:
                'application infrastructure ni import qilmaydi — portlarga tayaning (Dependency Rule).',
            },
            {
              group: ['@supabase/*', 'grammy*', 'next*'],
              message: "application frameworkka bog'liq bo'lmasin.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/infrastructure/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@invitation/application*', '@invitation/i18n*'],
              message:
                'infrastructure application/i18n ni import qilmaydi — tarjima presentation qatlamida (matn tashqaridan inject qilinadi).',
            },
          ],
        },
      ],
    },
  },
];

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  ...layerBoundaries,
);
