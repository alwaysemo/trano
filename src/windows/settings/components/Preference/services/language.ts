import { default_language, i18n } from '@i18n'
import type { LocaleType } from '@i18n'

export type { LocaleType } from '@i18n'
export type LanguageOption = LocaleType | 'default'

const supportedLocales = Object.keys(i18n.global.messages.value) as LocaleType[]

const normalizeLocale = (value: string) => value.toLowerCase().replace(/_/g, '-')

const matchLocale = (language: string): LocaleType | undefined => {
	const normalizedLanguage = normalizeLocale(language)

	return supportedLocales.find((locale) => {
		const normalizedLocale = normalizeLocale(locale)
		return (
			normalizedLocale === normalizedLanguage ||
			normalizedLocale.split('-')[0] === normalizedLanguage.split('-')[0]
		)
	})
}

export const getLanguage = (): LocaleType => {
	const browserLanguages = Array.from(new Set([...(navigator.languages ?? []), navigator.language]))

	for (const language of browserLanguages) {
		const locale = matchLocale(language)
		if (locale) return locale
	}

	return default_language
}

export const setLanguage = (locale: LanguageOption) => {
	i18n.global.locale.value = locale === 'default' ? getLanguage() : locale
}
