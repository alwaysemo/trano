import type { LocaleType } from '@i18n'
import { i18n, default_language } from '@i18n'

export const getSystemLanguage = (): LocaleType => {
	const language = navigator.language
	const locale = Object.keys(i18n.global.messages.value).find((item) => item === language)
	if (locale) return locale as LocaleType
	else return default_language
}

export const getLanguage = (): LocaleType => {
	return i18n.global.locale.value
}

export const setLanguage = (locale: LocaleType | 'default') => {
	i18n.global.locale.value = locale === 'default' ? getSystemLanguage() : locale
}
