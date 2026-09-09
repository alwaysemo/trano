import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart'

let syncing = false

export const isLaunchLoginEnabled = () => isEnabled()

export const setLaunchLogin = async (enabled: boolean) => {
	if (syncing) return false

	syncing = true
	try {
		if (enabled) {
			await enable()
		} else {
			await disable()
		}
		return true
	} catch (error) {
		console.error('更新开机自启设置失败:', error)
		return false
	} finally {
		syncing = false
	}
}
