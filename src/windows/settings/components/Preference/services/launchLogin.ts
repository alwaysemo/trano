import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart'

export const loadLaunchLogin = () => isEnabled()
export const saveLaunchLogin = async (enabled: boolean) => {
	try {
		if (enabled) await enable()
		else await disable()
	} catch (error) {
		console.error('更新开机自启设置失败:', error)
	}
}
