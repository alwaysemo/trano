import type { Component } from 'vue'

type KeysOfType<State, Value> = {
	[Key in keyof State]: State[Key] extends Value ? Key : never
}[keyof State]

type BaseMenuItem<State> = {
	label: string
	hint: string
	key: keyof State
}

type SwitchMenuItem<State> = BaseMenuItem<State> & {
	type: 'switch'
	key: KeysOfType<State, boolean>
}

type SelectMenuItem<State> = BaseMenuItem<State> & {
	type: 'select'
	key: KeysOfType<State, string>
	options: { label: string; value: string; flag?: string }[]
}

type SliderMenuItem<State> = BaseMenuItem<State> & {
	type: 'slider'
	key: KeysOfType<State, number>
}

export type MenuItem<State> = SwitchMenuItem<State> | SelectMenuItem<State> | SliderMenuItem<State>

export type Menus<State> = {
	title: string
	description: string
	icon: Component
	items: MenuItem<State>[]
}
