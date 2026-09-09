<script setup lang="ts">
	import type { Menus } from '@windows/settings/components/Preference/types'
	import type { LocalePreference } from '@i18n'
	import { useI18n } from 'vue-i18n'
	import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
	import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart'
	import { check, type Update } from '@tauri-apps/plugin-updater'
	import { relaunch } from '@tauri-apps/plugin-process'
	import { invoke } from '@tauri-apps/api/core'
	import IconifyDownload from '@iconify-vue/lucide/download'
	import IconifyRefreshCw from '@iconify-vue/lucide/refresh-cw'
	import IconifyGlobe from '@iconify-vue/lucide/globe-2'
	import IconifyMonitor from '@iconify-vue/lucide/monitor'
	import IconifySparkles from '@iconify-vue/lucide/sparkles'
	import IconifySave from '@iconify-vue/lucide/save'
	import { toast } from '@/composables/toast'
	import { getLocalePreference, setLocale } from '@i18n'

	const { t } = useI18n()

	const state = reactive({
		language: getLocalePreference() as LocalePreference,
		launchAtLogin: false,
		autoUpdate: true,
		showInDock: true,
		position: 'center',
		fontSize: 14,
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
	let savePreferencesTimer: ReturnType<typeof setTimeout> | undefined
	let isLoading = true

	const loadPreferences = async () => {
		const preferences = await invoke<{
			language: LocalePreference
			auto_update: boolean
			show_in_dock: boolean
			position: string
			font_size: number
			smart_translate: boolean
		}>('load_preferences')

		state.language = preferences.language
		state.autoUpdate = preferences.auto_update
		state.showInDock = preferences.show_in_dock
		state.position = preferences.position
		state.fontSize = preferences.font_size
		state.smartTranslate = preferences.smart_translate
	}

	const savePreferences = () => {
		if (isLoading) return
		if (savePreferencesTimer) clearTimeout(savePreferencesTimer)
		savePreferencesTimer = setTimeout(() => {
			void invoke('save_preferences', {
				preferences: {
					language: state.language,
					auto_update: state.autoUpdate,
					show_in_dock: state.showInDock,
					position: state.position,
					font_size: state.fontSize,
					smart_translate: state.smartTranslate,
				},
			}).catch((error) => console.error('保存偏好设置失败:', error))
		}, 150)
	}

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

	const list = computed<Array<Menus<PreferenceState>>>(() => [
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
				{
					label: t('settings.items.showInDock'),
					hint: t('settings.items.showInDockHint'),
					type: 'switch',
					key: 'showInDock',
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
			await loadPreferences()
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

	watch(
		() => state.showInDock,
		(show) => {
			if (isLoading) return
			void invoke('set_icon_visibility', { show }).catch((error) =>
				console.error('更新程序坞/任务栏图标设置失败:', error),
			)
		},
	)

	watch(
		state,
		() => {
			markSettingsUpdated()
			savePreferences()
		},
		{ deep: true },
	)

	onUnmounted(() => {
		if (saveStatusTimer) clearTimeout(saveStatusTimer)
		if (savePreferencesTimer) clearTimeout(savePreferencesTimer)
	})
</script>

<template>
	<div>
		<div class="flex items-center justify-between pb-4.5">
			<div>
				<p class="text-xs font-thin text-gray-400">TRANO / PREFERENCE</p>
				<h1 class="mt-1 text-2xl font-bold leading-none">{{ t('settings.preferenceTitle') }}</h1>
			</div>
			<div
				class="flex items-center gap-2 rounded-[20px] trano-effect-glass py-2 px-2 leading-none"
				data-status="updated"
			>
				<em>~</em>
				<span class="text-[10px]">{{ t(`settings.updated`) }}</span>
			</div>
		</div>

		<div class="grid h-[calc(100vh-36px-62px)] gap-6 overflow-y-auto">
			<section v-for="group in list" :key="group.title">
				<div class="flex items-center gap-2 leading-none">
					<component :is="group.icon" class="h-8 w-8 rounded-md trano-effect-glass p-2" />
					<div>
						<h3 class="text-sm">{{ group.title }}</h3>
						<p class="text-xs text-gray-400">{{ group.description }}</p>
					</div>
				</div>
				<ul class="mt-2 rounded-xl trano-effect-glass">
					<li
						v-for="item in group.items"
						:key="item.label"
						class="flex items-center justify-between p-3 transition-all first:rounded-t-xl last:rounded-b-xl not-last:border-b not-last:border-white/50 hover:bg-white/25"
					>
						<div class="flex flex-col gap-1 leading-none">
							<strong class="text-sm">{{ item.label }}</strong>
							<span class="text-xs text-gray-400">{{ item.hint }}</span>
						</div>
						<div class="flex items-center gap-2.5">
							<template v-if="item.key === 'autoUpdate'">
								<ShadcnButton
									class="check-update-button"
									type="button"
									size="sm"
									:disabled="isCheckingUpdate || isInstallingUpdate"
									@click="checkForUpdates(true)"
								>
									<IconifyRefreshCw class="iconify" />
									{{ isCheckingUpdate ? t('settings.checkingUpdates') : t('settings.checkForUpdates') }}
								</ShadcnButton>
								<ShadcnButton
									v-if="availableUpdate"
									class="update-button"
									type="button"
									size="sm"
									:disabled="isInstallingUpdate"
									@click="installUpdate"
								>
									<IconifyDownload class="iconify" />
									{{ isInstallingUpdate ? t('settings.updateInstalling') : t('settings.updateNow') }}
								</ShadcnButton>
							</template>
							<ShadcnSwitch v-if="item.type === 'switch'" v-model="state[item.key]" />
							<ShadcnSelect v-else-if="item.type === 'select'" v-model="state[item.key]">
								<ShadcnSelectTrigger>
									<ShadcnSelectValue />
								</ShadcnSelectTrigger>
								<ShadcnSelectContent>
									<ShadcnSelectItem v-for="option in item.options" :key="option.value" :value="option.value">
										{{ option.flag }} {{ option.label }}
									</ShadcnSelectItem>
								</ShadcnSelectContent>
							</ShadcnSelect>
							<ShadcnSlider
								v-else-if="item.type === 'slider'"
								v-model="state[item.key]"
								:min="10"
								:max="32"
								:step="2"
								class="w-30"
							/>
						</div>
					</li>
				</ul>
			</section>
			<div class="mb-6 flex items-center justify-end gap-1">
				<IconifySave class="h-3 w-3" />
				<span class="text-xs">{{ t('settings.autoSave') }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	/** */
</style>
