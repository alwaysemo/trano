import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const host: string = process.env.TAURI_DEV_HOST || 'localhost'
const port: number = Number(process.env.TAURI_DEV_PORT || 3000)

// https://vite.dev/config/
export default defineConfig(async () => ({
	plugins: [vue()],

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent Vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port,
		strictPort: true,
		host: host,
		hmr: { protocol: 'ws', host, port },
		watch: {
			// 3. tell Vite to ignore watching `src-tauri`
			ignored: ['**/src-tauri/**'],
		},
	},
}))
