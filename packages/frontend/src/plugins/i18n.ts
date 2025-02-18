import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import type { InitOptions } from 'i18next'
import { localeBrowserMappings, localeResourceMappings } from '@/config'

const languageDetector = new LanguageDetector()

languageDetector.addDetector({
  name: 'defaultLocalDetector',
  lookup() {
    const detected = typeof window !== 'undefined' ? navigator.language : 'en'
    return localeBrowserMappings[detected] || detected
  },
})

const options: InitOptions = {
  resources: localeResourceMappings,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['defaultLocalDetector', 'querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
  },
}

i18n
  .use(languageDetector)
  .init(options)

export { i18n }
export default i18n
