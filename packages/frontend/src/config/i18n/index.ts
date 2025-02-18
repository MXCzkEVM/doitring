import type { Resource } from 'i18next'

import de from '../../locales/de.json'
import en from '../../locales/en.json'
import es from '../../locales/es.json'
import fr from '../../locales/fr.json'
import id from '../../locales/id.json'
import it from '../../locales/it.json'
import ja from '../../locales/ja.json'
import ko from '../../locales/ko.json'
import nl from '../../locales/nl.json'
import pt from '../../locales/pt.json'
import ro from '../../locales/ro.json'
import ru from '../../locales/ru.json'
import tr from '../../locales/tr.json'
import vi from '../../locales/vi.json'
import zhHans from '../../locales/zh-hans.json'
import zhHant from '../../locales/zh-hant.json'

export const localeResourceMappings: Resource = {
  'de': { translation: de },
  'en': { translation: en },
  'es': { translation: es },
  'fr': { translation: fr },
  'id': { translation: id },
  'it': { translation: it },
  'ja': { translation: ja },
  'ko': { translation: ko },
  'nl': { translation: nl },
  'pt': { translation: pt },
  'ro': { translation: ro },
  'ru': { translation: ru },
  'tr': { translation: tr },
  'vi': { translation: vi },
  'zh-CN': { translation: zhHans },
  'zh-TW': { translation: zhHant },
}

export const localeBrowserMappings: Record<string, string> = {
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'de': 'de',
  'de-DE': 'de',
  'nl': 'nl',
  'nl-NL': 'nl',
  'tr': 'tr',
  'tr-TR': 'tr',
  'ko': 'ko',
  'ko-KR': 'ko',
  'ro': 'ro',
  'ro-RO': 'ro',
  'es': 'es',
  'es-ES': 'es',
  'fr': 'fr',
  'fr-FR': 'fr',
  'it': 'it',
  'it-IT': 'it',
  'ja': 'ja',
  'ja-JP': 'ja',
  'ru': 'ru',
  'ru-RU': 'ru',
  'pt': 'pt',
  'pt-PT': 'pt',
  'pt-BR': 'pt',
  'id': 'id',
  'id-ID': 'id',
  'vi': 'vi',
  'vi-VN': 'vi',
}

export const localeTextMappings: Record<string, string> = {
  'en': 'English',
  'de': 'Deutsch',
  'nl': 'Nederlands',
  'tr': 'Türkçe',
  'zh-CN': '简体中文',
  'zh-TW': '繁体中文',
  'ko': '한국어',
  'ro': 'Română',
  'es': 'Español',
  'fr': 'Français',
  'it': 'Italiano',
  'ja': '日本語',
  'ru': 'Русский',
  'pt': 'Portugués',
  'id': 'Indonesio',
  'vi': 'Tiếng Việt',
}
