import { reactive } from 'vue'
import { i18n } from '@/i18n'

const translate = (key: string, fallback: string) => (i18n.global.te(key) ? i18n.global.t(key) : fallback)

export interface ModalOptions {
	title?: string
	content: string
	width?: string
	closable?: boolean
	maskClosable?: boolean
	showCancel?: boolean
	confirmText?: string
	cancelText?: string
}

// eslint-disable-next-line no-unused-vars
type ModalResolver = (value: boolean | PromiseLike<boolean>) => void

export interface ModalItem extends Required<ModalOptions> {
	id: number
	resolve: ModalResolver
}

const state = reactive<{ item: ModalItem | null }>({ item: null })
let nextId = 0

function close(confirmed = false) {
	const item = state.item
	if (!item) return

	state.item = null
	item.resolve(confirmed)
}

function show(optionsOrContent: string | ModalOptions): Promise<boolean> {
	if (state.item) close(false)

	const options = typeof optionsOrContent === 'string' ? { content: optionsOrContent } : optionsOrContent
	return new Promise((resolve) => {
		state.item = {
			id: nextId++,
			content: options.content,
			title: options.title ?? translate('common.prompt', 'Prompt'),
			width: options.width ?? '420px',
			closable: options.closable ?? true,
			maskClosable: options.maskClosable ?? true,
			showCancel: options.showCancel ?? false,
			confirmText: options.confirmText ?? translate('common.ok', 'OK'),
			cancelText: options.cancelText ?? translate('common.cancel', 'Cancel'),
			resolve,
		}
	})
}

export const modal = {
	state,
	show,
	confirm: (content: string, title = translate('common.confirm', 'Please confirm')) => show({ content, title, showCancel: true }),
	alert: (content: string, title = translate('common.prompt', 'Prompt')) => show({ content, title }),
	close,
}
