import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const host: string = process.env.TAURI_DEV_HOST || 'localhost'
const port: number = Number(process.env.TAURI_DEV_PORT || 3000)

// https://vite.dev/config/
export default defineConfig(async () => ({
	plugins: [vue()],

	// 防止 Vite 清除 Rust 显示的错误
	clearScreen: false,
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
	// 添加有关当前构建目标的额外前缀，使这些 CLI 设置的 Tauri 环境变量可以在客户端代码中访问
	envPrefix: ['VITE_', 'TAURI_ENV_*'],
}))
