import type { LocaleType } from '@i18n'
import type { Component } from 'vue'

export interface State {
	language: LocaleType | 'default'
	launch_login: boolean
	auto_update: boolean
	show_in_dock: boolean
	position: string
	font_size: number
	smart_translate: boolean
}

type ItemKey = keyof State

type SelectItem = {
	label: string
	hint: string
	type: 'select'
	key: ItemKey
	options: Array<{
		label: string
		value: string
		flag?: string
	}>
}

type SwitchItem = {
	label: string
	hint: string
	type: 'switch'
	key: ItemKey
}

type SliderItem = {
	label: string
	hint: string
	type: 'slider'
	key: ItemKey
}

export type SettingItem = SelectItem | SwitchItem | SliderItem

export interface List {
	title: string
	description: string
	icon: Component
	items: SettingItem[]
}
