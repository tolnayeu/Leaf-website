import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'de', 'tr', 'pt', 'ru', 'zh'],
  defaultLocale: 'en',
})
