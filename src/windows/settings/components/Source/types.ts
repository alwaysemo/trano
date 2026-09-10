export interface SourceOption {
	key: string
	type: 'input'
	name: string
	value: string
	placeholder: string
}

export interface Source {
	type: string
	label: string
	value: boolean
	icon: string
	hint?: string
	options: SourceOption[]
}
