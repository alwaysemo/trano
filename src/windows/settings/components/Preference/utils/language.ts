import { i18n } from '@i18n'

export const localePreferenceOptions = ['default', 'zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'es', 'de', 'pt'] as const
export type LocalePreference = (typeof localePreferenceOptions)[number]
export type SupportedLocale = Exclude<LocalePreference, 'default'>

const localeStorageKey = 'trano-locale'

const normalizeLocale = (locale: string): SupportedLocale | undefined => {
	const normalizedLocale = locale.toLowerCase()
	return localePreferenceOptions.find(
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
		localePreferenceOptions.find(
			(preference): preference is SupportedLocale =>
				preference !== 'default' && preference.toLowerCase().startsWith(`${language}-`),
		) ??
		'en'
	)
}

const resolveLocale = (preference: LocalePreference): SupportedLocale =>
	preference === 'default' ? detectSystemLocale() : preference

const isLocalePreference = (value: string | null): value is LocalePreference =>
	value === 'default' || (value !== null && normalizeLocale(value) !== undefined)

const getLocalePreference = (): LocalePreference => {
	if (typeof localStorage === 'undefined') return 'default'
	const storedLocale = localStorage.getItem(localeStorageKey)
	if (!isLocalePreference(storedLocale)) return 'default'
	if (storedLocale === 'default') return storedLocale
	return normalizeLocale(storedLocale) ?? 'default'
}

const setLocale = (preference: LocalePreference) => {
	i18n.global.locale.value = resolveLocale(preference)
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(localeStorageKey, preference)
	}
}

export const getLanguagePreference = (): LocalePreference => getLocalePreference()

export const setLanguagePreference = (preference: LocalePreference) => setLocale(preference)
