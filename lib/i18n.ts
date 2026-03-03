import { defineI18n } from 'fumadocs-core/i18n'

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'de', 'tr', 'pt', 'ru', 'zh'],
  parser: 'dir', // locale lives in directory name (docs/en/..., docs/de/...), not filename
})
