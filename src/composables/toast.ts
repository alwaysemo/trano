import { toast as sonnerToast } from 'vue-sonner'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
	message: string
	type?: ToastType
	duration?: number
}

let nextId = 0

function show(messageOrOptions: string | ToastOptions, type: ToastType = 'info') {
	const options = typeof messageOrOptions === 'string' ? { message: messageOrOptions, type } : messageOrOptions
	const id = nextId++
	sonnerToast[options.type ?? 'info'](options.message, {
		id: String(id),
		duration: options.duration ?? 3000,
	})
	return id
}

function remove(id: number) {
	sonnerToast.dismiss(String(id))
}

export const toast = {
	show,
	success: (message: string, duration?: number) => show({ message, type: 'success', duration }),
	error: (message: string, duration?: number) => show({ message, type: 'error', duration }),
	warning: (message: string, duration?: number) => show({ message, type: 'warning', duration }),
	info: (message: string, duration?: number) => show({ message, type: 'info', duration }),
	remove,
	clear: () => sonnerToast.dismiss(),
}
