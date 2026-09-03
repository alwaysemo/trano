import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const host: string = process.env.TAURI_DEV_HOST || 'localhost'
const port: number = Number(process.env.TAURI_DEV_PORT || 3000)

// https://vite.dev/config/
export default defineConfig(async () => ({
	plugins: [vue()],
	// 防止 Vite 清除 Rust 显示的错误
	clearScreen: false,

	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@views': fileURLToPath(new URL('./src/views', import.meta.url)),
			'@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
			'@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
			'@components': fileURLToPath(new URL('./src/components', import.meta.url)),
			'@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				charset: false,
				outputStyle: 'compressed',
				api: 'modern-compiler',
				// additionalData: `@use '@assets/style/color.scss' as color;
				// 					@use '@assets/style/base.scss' as *;
				// 					@use '@assets/style/transition.scss' as *;`,
			},
		},
	},
	server: {
		port,
		strictPort: true,
		host: host,
		hmr: { protocol: 'ws', host, port },
		watch: {
			// Vite 忽略监听 `src-tauri` 目录
			ignored: ['**/src-tauri/**'],
		},
	},
	build: {
		rollupOptions: {
			input: {
				input: fileURLToPath(new URL('./input.html', import.meta.url)),
				screenshot: fileURLToPath(new URL('./screenshot.html', import.meta.url)),
				selection: fileURLToPath(new URL('./selection.html', import.meta.url)),
				settings: fileURLToPath(new URL('./settings.html', import.meta.url)),
			},
		},
	},
	// 添加有关当前构建目标的额外前缀，使这些 CLI 设置的 Tauri 环境变量可以在客户端代码中访问
	envPrefix: ['VITE_', 'TAURI_ENV_*'],
}))
