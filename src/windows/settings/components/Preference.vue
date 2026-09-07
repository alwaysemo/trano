<script setup lang="ts">
	import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
	import { useI18n } from 'vue-i18n'
	import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart'
	import { check, type Update } from '@tauri-apps/plugin-updater'
	import { relaunch } from '@tauri-apps/plugin-process'
	import IconifyDownload from '@iconify-vue/lucide/download'
	import IconifyRefreshCw from '@iconify-vue/lucide/refresh-cw'
	import IconifyGlobe from '@iconify-vue/lucide/globe-2'
	import IconifyMonitor from '@iconify-vue/lucide/monitor'
	import IconifySparkles from '@iconify-vue/lucide/sparkles'
	import IconifySave from '@iconify-vue/lucide/save'
	import Button from '@components/base/Button.vue'
	import Switch from '@components/base/Switch.vue'
	import Select from '@components/base/Select.vue'
	import Slider from '@components/base/Slider.vue'
	import type { Menus } from '@windows/settings/components/types'
	import { getLocalePreference, setLocale } from '@/i18n'
	import { toast } from '@/components/base/toast'

	const { t } = useI18n()

	const state = reactive({
		language: getLocalePreference(),
		launchAtLogin: false,
		autoUpdate: true,
		position: 'center',
		fontSize: 16,
		smartTranslate: true,
	})
	type PreferenceState = typeof state
	let syncingLaunchAtLogin = false
	const saveStatus = ref<'updated' | 'saved'>('saved')
	const availableUpdate = ref<Update | null>(null)
	const updateVersion = ref<string | null>(null)
	const isInstallingUpdate = ref(false)
	const isCheckingUpdate = ref(false)
	let saveStatusTimer: ReturnType<typeof setTimeout> | undefined
	let isLoading = true

	const markSettingsUpdated = () => {
		if (isLoading) return

		saveStatus.value = 'updated'
		if (saveStatusTimer) clearTimeout(saveStatusTimer)
		saveStatusTimer = setTimeout(() => {
			saveStatus.value = 'saved'
		}, 1000)
	}

	const updateLaunchAtLogin = async (enabled: boolean) => {
		if (syncingLaunchAtLogin) return

		syncingLaunchAtLogin = true
		try {
			if (enabled) {
				await enable()
			} else {
				await disable()
			}
		} catch (error) {
			state.launchAtLogin = !enabled
			console.error('更新开机自启设置失败:', error)
		} finally {
			syncingLaunchAtLogin = false
		}
	}

	const checkForUpdates = async (force = false) => {
		if ((!state.autoUpdate && !force) || isCheckingUpdate.value) return

		isCheckingUpdate.value = true
		try {
			const update = await check()
			availableUpdate.value = update
			updateVersion.value = update?.version ?? null
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

	const menus = computed<Array<Menus<PreferenceState>>>(() => [
		{
			title: t('settings.groups.general'),
			description: t('settings.groups.generalDescription'),
			icon: IconifyGlobe,
			items: [
				{
					label: t('settings.items.language'),
					hint: t('settings.items.languageHint'),
					type: 'select',
					key: 'language',
					options: [
						{ label: t('settings.options.default'), value: 'default', flag: '🌐' },
						{ label: t('settings.options.zhCN'), value: 'zh-CN', flag: '🇨🇳' },
						{ label: t('settings.options.zhTW'), value: 'zh-TW', flag: '🇨🇳' },
						{ label: t('settings.options.en'), value: 'en', flag: '🇺🇸' },
						{ label: t('settings.options.ja'), value: 'ja', flag: '🇯🇵' },
						{ label: t('settings.options.ko'), value: 'ko', flag: '🇰🇷' },
						{ label: t('settings.options.fr'), value: 'fr', flag: '🇫🇷' },
						{ label: t('settings.options.es'), value: 'es', flag: '🇪🇸' },
						{ label: t('settings.options.de'), value: 'de', flag: '🇩🇪' },
						{ label: t('settings.options.pt'), value: 'pt', flag: '🇵🇹' },
					],
				},
				{
					label: t('settings.items.launchAtLogin'),
					hint: t('settings.items.launchAtLoginHint'),
					type: 'switch',
					key: 'launchAtLogin',
				},
				{
					label: t('settings.items.autoUpdate'),
					hint: t('settings.items.autoUpdateHint'),
					type: 'switch',
					key: 'autoUpdate',
				},
			],
		},
		{
			title: t('settings.groups.translationWindow'),
			description: t('settings.groups.translationWindowDescription'),
			icon: IconifyMonitor,
			items: [
				{
					label: t('settings.items.position'),
					hint: t('settings.items.positionHint'),
					type: 'select',
					key: 'position',
					options: [
						{ label: t('settings.options.center'), value: 'center' },
						{ label: t('settings.options.last'), value: 'last' },
						{ label: t('settings.options.cursor'), value: 'cursor' },
					],
				},
				{
					label: t('settings.items.fontSize'),
					hint: t('settings.items.fontSizeHint'),
					type: 'slider',
					key: 'fontSize',
				},
			],
		},
		{
			title: t('settings.groups.smartExperience'),
			description: t('settings.groups.smartExperienceDescription'),
			icon: IconifySparkles,
			items: [
				{
					label: t('settings.items.smartTranslate'),
					hint: t('settings.items.smartTranslateHint'),
					type: 'switch',
					key: 'smartTranslate',
				},
			],
		},
	])

	watch(
		() => state.language,
		(language) => setLocale(language),
	)

	onMounted(async () => {
		try {
			state.launchAtLogin = await isEnabled()
			await checkForUpdates()
		} catch (error) {
			console.error('读取开机自启设置失败:', error)
		} finally {
			isLoading = false
		}
	})

	watch(
		() => state.launchAtLogin,
		(enabled) => void updateLaunchAtLogin(enabled),
	)

	watch(
		() => state.autoUpdate,
		(enabled) => {
			if (isLoading) return
			if (enabled) {
				void checkForUpdates()
			} else {
				availableUpdate.value = null
				updateVersion.value = null
			}
		},
	)

	watch(state, markSettingsUpdated, { deep: true })

	onUnmounted(() => {
		if (saveStatusTimer) clearTimeout(saveStatusTimer)
	})
</script>

<template>
	<div>
		<div class="module-header-container">
			<div>
				<p>TRANO / PREFERENCE</p>
				<h1>{{ t('settings.preferenceTitle') }}</h1>
			</div>
			<span class="status-mark" :data-status="saveStatus === 'updated' ? 'warning' : 'success'">
				{{ t(`settings.${saveStatus}`) }}
			</span>
		</div>

		<div class="module-main-container">
			<section v-for="group in menus" :key="group.title">
				<div class="primary-container">
					<component :is="group.icon" class="iconify" />
					<div>
						<h3>{{ group.title }}</h3>
						<p>{{ group.description }}</p>
					</div>
				</div>
				<ul class="module-menus-container">
					<li v-for="item in group.items" :key="item.label">
						<div class="name-container">
							<strong>{{ item.label }}</strong>
							<span>{{ item.hint }}</span>
						</div>
						<div class="content-container">
							<template v-if="item.key === 'autoUpdate'">
								<Button
									class="check-update-button"
									type="button"
									:disabled="isCheckingUpdate || isInstallingUpdate"
									@click="checkForUpdates(true)"
								>
									<IconifyRefreshCw class="iconify" />
									{{ t(isCheckingUpdate ? 'settings.checkingUpdates' : 'settings.checkForUpdates') }}
								</Button>
								<Button
									v-if="availableUpdate"
									class="update-button"
									type="button"
									:disabled="isInstallingUpdate"
									@click="installUpdate"
								>
									<IconifyDownload class="iconify" />
									{{ t(isInstallingUpdate ? 'settings.updateInstalling' : 'settings.updateNow') }}
								</Button>
							</template>
							<Switch v-if="item.type === 'switch'" v-model="state[item.key]" />
							<Select v-else-if="item.type === 'select'" v-model="state[item.key]" :options="item.options" />
							<Slider
								v-else-if="item.type === 'slider'"
								v-model="state[item.key]"
								:min="12"
								:max="28"
								:step="1"
								value-template="{value}px"
							/>
						</div>
					</li>
				</ul>
			</section>
			<div class="module-footer-container">
				<IconifySave class="iconify" />
				<span v-if="updateVersion">{{ t('settings.updateAvailable', { version: updateVersion }) }}</span>
				<span v-else>{{ t('settings.autoSave') }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use './style.scss';
</style>
