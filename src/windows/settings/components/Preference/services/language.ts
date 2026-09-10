import type { LocaleType } from '@i18n'
import { default_language, i18n } from '@i18n'

export const getLanguage = (): LocaleType => {
	const language = navigator.language
	const locale = Object.keys(i18n.global.messages.value).find((item) => item === language)
	if (locale) return locale as LocaleType
	else return default_language
}

export const setLanguage = (locale: LocaleType) => {
	i18n.global.locale.value = locale
}
