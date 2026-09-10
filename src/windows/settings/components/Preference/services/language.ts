import { DEFAULT_LOCALE, i18n } from '@i18n'

const locales = ['default', 'zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'es', 'de', 'pt'] as const
export type LocaleType = (typeof locales)[number]
type LanguageType = Exclude<LocaleType, 'default'>

export const getLanguage = (): LanguageType => {
	const language = navigator.language
	const locale = locales.find((item) => item === language)
	if (locale !== 'default' && locale) return locale
	else return DEFAULT_LOCALE
}

export const setLanguage = (locale: LocaleType) => {
	i18n.global.locale.value = locale === 'default' ? getLanguage() : locale
}
