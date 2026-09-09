<script setup lang="ts">
	import type { Menus } from './types'
	import type { LocalePreference } from './utils/language'
	import { useI18n } from 'vue-i18n'
	import { computed, onMounted, reactive, watch } from 'vue'
	import { invoke } from '@tauri-apps/api/core'
	import IconifyDownload from '@iconify-vue/lucide/download'
	import IconifyRefreshCw from '@iconify-vue/lucide/refresh-cw'
	import IconifyGlobe from '@iconify-vue/lucide/globe-2'
	import IconifyMonitor from '@iconify-vue/lucide/monitor'
	import IconifySparkles from '@iconify-vue/lucide/sparkles'
	import IconifySave from '@iconify-vue/lucide/save'
	import { useAutoUpdate } from './utils/auto_update'
	import { DEFAULT_FONT_SIZE, FONT_SIZE_MAX, FONT_SIZE_MIN, FONT_SIZE_STEP } from './utils/font_size'
	import { getLanguagePreference, setLanguagePreference } from './utils/language'
	import { isLaunchLoginEnabled, setLaunchLogin } from './utils/launch_login'
	import { DEFAULT_POSITION, normalizePosition } from './utils/position'
	import { setShowInDock, DEFAULT_SHOW_IN_DOCK } from './utils/show_in_dock'
	import { DEFAULT_SMART_TRANSLATE } from './utils/smart_translate'

	const { t } = useI18n()

	const state = reactive({
		language: getLanguagePreference(),
		launch_login: false,
		auto_update: true,
		show_in_dock: DEFAULT_SHOW_IN_DOCK,
		position: DEFAULT_POSITION,
		font_size: DEFAULT_FONT_SIZE,
		smart_translate: DEFAULT_SMART_TRANSLATE,
	})
	type PreferenceState = typeof state
	const {
		availableUpdate,
		isInstallingUpdate,
		isCheckingUpdate,
		checkForUpdates,
		installUpdate,
		clearAvailableUpdate,
	} = useAutoUpdate(computed(() => state.auto_update))
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
		state.auto_update = preferences.auto_update
		state.show_in_dock = preferences.show_in_dock
		state.position = normalizePosition(preferences.position)
		state.font_size = preferences.font_size
		state.smart_translate = preferences.smart_translate
	}

	const savePreferences = () => {
		void invoke('save_preferences', {
			preferences: {
				language: state.language,
				auto_update: state.auto_update,
				show_in_dock: state.show_in_dock,
				position: state.position,
				font_size: state.font_size,
				smart_translate: state.smart_translate,
			},
		}).catch((error) => console.error('保存偏好设置失败:', error))
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
					key: 'launch_login',
				},
				{
					label: t('settings.items.autoUpdate'),
					hint: t('settings.items.autoUpdateHint'),
					type: 'switch',
					key: 'auto_update',
				},
				{
					label: t('settings.items.showInDock'),
					hint: t('settings.items.showInDockHint'),
					type: 'switch',
					key: 'show_in_dock',
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
					key: 'font_size',
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
					key: 'smart_translate',
				},
			],
		},
	])

	watch(
		() => state.language,
		(language) => setLanguagePreference(language),
	)

	onMounted(async () => {
		try {
			await loadPreferences()
			state.launch_login = await isLaunchLoginEnabled()
			await checkForUpdates()
		} catch (error) {
			console.error('读取开机自启设置失败:', error)
		} finally {
			isLoading = false
		}
	})

	watch(
		() => state.launch_login,
		async (enabled) => {
			if (!(await setLaunchLogin(enabled))) state.launch_login = !enabled
		},
	)

	watch(
		() => state.auto_update,
		(enabled) => {
			if (isLoading) return
			if (enabled) {
				void checkForUpdates()
			} else {
				clearAvailableUpdate()
			}
		},
	)

	watch(
		() => state.show_in_dock,
		(show) => {
			if (isLoading) return
			setShowInDock(show)
		},
	)

	watch(
		state,
		() => {
			savePreferences()
		},
		{ deep: true },
	)
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
							<template v-if="item.key === 'auto_update'">
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
										{{ option.flag ?? '' }} {{ option.label }}
									</ShadcnSelectItem>
								</ShadcnSelectContent>
							</ShadcnSelect>
							<ShadcnSlider
								v-else-if="item.type === 'slider'"
								v-model="state[item.key]"
								:min="FONT_SIZE_MIN"
								:max="FONT_SIZE_MAX"
								:step="FONT_SIZE_STEP"
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
