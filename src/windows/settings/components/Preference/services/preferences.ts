import { invoke } from '@tauri-apps/api/core'
import type { LocaleType } from './language'

export type PreferencesType = {
	language: LocaleType
	launch_login: boolean
	auto_update: boolean
	show_in_dock: boolean
	position: string
	font_size: number
	smart_translate: boolean
}

export const loadPreferences = () => invoke<PreferencesType>('load_preferences')

export const savePreferences = (preferences: PreferencesType) => invoke('save_preferences', { preferences })
