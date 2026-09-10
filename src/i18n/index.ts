import { createI18n } from 'vue-i18n'
import { invoke } from '@tauri-apps/api/core'
import deDE from './locales/de-DE.json'
import enUS from './locales/en-US.json'
import esES from './locales/es-ES.json'
import frFR from './locales/fr-FR.json'
import jaJP from './locales/ja-JP.json'
import koKR from './locales/ko-KR.json'
import ptPT from './locales/pt-PT.json'
import zhCN from './locales/zh-CN.json'
import zhTW from './locales/zh-TW.json'

export const default_language = 'en-US' as const

export type LocaleType = 'de-DE' | 'en-US' | 'es-ES' | 'fr-FR' | 'ja-JP' | 'ko-KR' | 'pt-PT' | 'zh-CN' | 'zh-TW'

export const i18n = createI18n({
	legacy: false,
	locale: default_language,
	fallbackLocale: default_language,
	messages: {
		'de-DE': deDE,
		'en-US': enUS,
		'es-ES': esES,
		'fr-FR': frFR,
		'ja-JP': jaJP,
		'ko-KR': koKR,
		'pt-PT': ptPT,
		'zh-CN': zhCN,
		'zh-TW': zhTW,
	},
})

const locales = new Set<LocaleType>(['de-DE', 'en-US', 'es-ES', 'fr-FR', 'ja-JP', 'ko-KR', 'pt-PT', 'zh-CN', 'zh-TW'])

export const initializeLanguage = async () => {
	try {
		const preferences = await invoke<{ language: string }>('load_preferences')
		if (locales.has(preferences.language as LocaleType)) {
			i18n.global.locale.value = preferences.language as LocaleType
		}
	} catch (error) {
		console.error('加载语言设置失败:', error)
	}
}
