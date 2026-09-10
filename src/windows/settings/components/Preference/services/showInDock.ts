import { invoke } from '@tauri-apps/api/core'

export const setShowInDock = (show: boolean) =>
	void invoke('set_icon_visibility', { show }).catch((error) =>
		console.error('更新程序坞/任务栏图标设置失败:', error),
	)