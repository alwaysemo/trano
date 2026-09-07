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

export const localePreferences = ['default', 'zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'es', 'de', 'pt'] as const
export type LocalePreference = (typeof localePreferences)[number]
export type SupportedLocale = Exclude<LocalePreference, 'default'>

const localeStorageKey = 'trano-locale'

const normalizeLocale = (locale: string): SupportedLocale | undefined => {
	const normalizedLocale = locale.toLowerCase()
	return localePreferences.find(
		(preference): preference is SupportedLocale =>
			preference !== 'default' && preference.toLowerCase() === normalizedLocale,
	)
}

const detectSystemLocale = (): SupportedLocale => {
	if (typeof navigator === 'undefined') return 'en'

	const systemLocale = navigator.language.toLowerCase()
	if (['zh-tw', 'zh-hk', 'zh-mo'].some((locale) => systemLocale.startsWith(locale)) || systemLocale.includes('hant')) {
		return 'zh-TW'
	}

	const language = systemLocale.split('-')[0]
	return (
		normalizeLocale(systemLocale) ??
		localePreferences.find(
			(preference): preference is SupportedLocale =>
				preference !== 'default' && preference.toLowerCase().startsWith(`${language}-`),
		) ??
		'en'
	)
}

const isLocalePreference = (value: string | null): value is LocalePreference =>
	value === 'default' || (value !== null && normalizeLocale(value) !== undefined)

export const getLocalePreference = (): LocalePreference => {
	if (typeof localStorage === 'undefined') return 'default'
	const storedLocale = localStorage.getItem(localeStorageKey)
	if (!isLocalePreference(storedLocale)) return 'default'
	if (storedLocale === 'default') return storedLocale
	return normalizeLocale(storedLocale) ?? 'default'
}

export const resolveLocale = (preference: LocalePreference): SupportedLocale =>
	preference === 'default' ? detectSystemLocale() : preference

export const i18n = createI18n({
	legacy: false,
	locale: resolveLocale(getLocalePreference()),
	fallbackLocale: 'en',
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

export const setLocale = (preference: LocalePreference) => {
	i18n.global.locale.value = resolveLocale(preference)
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(localeStorageKey, preference)
	}
}
