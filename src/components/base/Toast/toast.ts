import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
	message: string
	type?: ToastType
	duration?: number
}

export interface ToastItem extends Required<Omit<ToastOptions, 'duration'>> {
	id: number
	duration: number
}

const items = reactive<ToastItem[]>([])
let nextId = 0

function show(messageOrOptions: string | ToastOptions, type: ToastType = 'info') {
	const options = typeof messageOrOptions === 'string' ? { message: messageOrOptions, type } : messageOrOptions
	const item: ToastItem = {
		id: nextId++,
		message: options.message,
		type: options.type ?? 'info',
		duration: options.duration ?? 3000,
	}

	items.push(item)
	if (items.length > 4) items.shift()
	return item.id
}

function remove(id: number) {
	const index = items.findIndex((item) => item.id === id)
	if (index !== -1) items.splice(index, 1)
}

export const toast = {
	items,
	show,
	success: (message: string, duration?: number) => show({ message, type: 'success', duration }),
	error: (message: string, duration?: number) => show({ message, type: 'error', duration }),
	warning: (message: string, duration?: number) => show({ message, type: 'warning', duration }),
	info: (message: string, duration?: number) => show({ message, type: 'info', duration }),
	remove,
	clear: () => items.splice(0),
}
