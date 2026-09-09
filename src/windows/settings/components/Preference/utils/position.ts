export const POSITION_OPTIONS = ['center', 'last', 'cursor'] as const
export type TranslationWindowPosition = (typeof POSITION_OPTIONS)[number]
export const DEFAULT_POSITION: TranslationWindowPosition = 'center'

export const normalizePosition = (position: string): TranslationWindowPosition =>
	POSITION_OPTIONS.includes(position as TranslationWindowPosition)
		? (position as TranslationWindowPosition)
		: DEFAULT_POSITION