export type SourceOption = {
	name: string
	key: string
	type: 'input'
	placeholder: string
}

export type Source = {
	key: string
	type: string
	name: string
	icon: string
	hint?: string
	options: SourceOption[]
}
