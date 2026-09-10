import type { Ref } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { check, type Update } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { toast } from '@/composables/toast'

export const useAutoUpdate = (autoUpdate: Ref<boolean>) => {
	const { t } = useI18n()
	const availableUpdate = ref<Update | null>(null)
	const isInstallingUpdate = ref(false)
	const isCheckingUpdate = ref(false)

	const checkForUpdates = async (force = false) => {
		if ((!autoUpdate.value && !force) || isCheckingUpdate.value) return

		isCheckingUpdate.value = true
		try {
			const update = await check()
			availableUpdate.value = update
			if (update) {
				toast.success(t('settings.updateFound', { version: update.version }))
			} else {
				toast.info(t('settings.upToDate'))
			}
		} catch (error) {
			console.error('检查更新失败:', error)
			toast.error(t('settings.updateCheckFailed'))
		} finally {
			isCheckingUpdate.value = false
		}
	}

	const installUpdate = async () => {
		if (!availableUpdate.value || isInstallingUpdate.value) return

		isInstallingUpdate.value = true
		try {
			await availableUpdate.value.downloadAndInstall()
			await relaunch()
		} catch (error) {
			isInstallingUpdate.value = false
			console.error('安装更新失败:', error)
			toast.error(t('settings.updateInstallFailed'))
		}
	}

	const clearAvailableUpdate = () => {
		availableUpdate.value = null
	}

	return {
		availableUpdate,
		isInstallingUpdate,
		isCheckingUpdate,
		checkForUpdates,
		installUpdate,
		clearAvailableUpdate,
	}
}