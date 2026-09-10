import { createI18n } from 'vue-i18n'
import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import pt from './locales/pt.json'
import zhCN from './locales/zh-CN.json'
import zhTW from './locales/zh-TW.json'

export const default_language = 'en' as const

export type LocaleType = 'de' | 'en' | 'es' | 'fr' | 'ja' | 'ko' | 'pt' | 'zh-CN' | 'zh-TW'

export const i18n = createI18n({
	legacy: false,
	locale: default_language,
	fallbackLocale: default_language,
	messages: {
		en,
		'zh-CN': zhCN,
		'zh-TW': zhTW,
		ja,
		ko,
		fr,
		es,
		de,
		pt,
	},
})
