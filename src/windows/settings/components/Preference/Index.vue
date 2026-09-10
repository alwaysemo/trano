<script setup lang="ts">
	import type { State, List } from './types'
	import { invoke } from '@tauri-apps/api/core'
	import { computed, onMounted, reactive, watch } from 'vue'
	import { useI18n } from 'vue-i18n'
	import IconifyRefreshCw from '@iconify-vue/lucide/refresh-cw'
	import IconifyGlobe from '@iconify-vue/lucide/globe-2'
	import IconifyMonitor from '@iconify-vue/lucide/monitor'
	import IconifySparkles from '@iconify-vue/lucide/sparkles'
	import { getSystemLanguage, getLanguage, setLanguage } from './services/language'
	import { loadLaunchLogin, saveLaunchLogin } from './services/launchLogin'
	import { setShowInDock } from './services/showInDock'

	const { t } = useI18n()

	const state = reactive<State>({
		language: getLanguage(),
		launch_login: false,
		auto_update: true,
		show_in_dock: false,
		position: 'cneter',
		font_size: 14,
		smart_translate: true,
	})

	const list = computed<List[]>(() => [
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
						{ label: t('settings.options.en'), value: 'en-US', flag: '🇺🇸' },
						{ label: t('settings.options.ja'), value: 'ja-JP', flag: '🇯🇵' },
						{ label: t('settings.options.ko'), value: 'ko-KR', flag: '🇰🇷' },
						{ label: t('settings.options.fr'), value: 'fr-FR', flag: '🇫🇷' },
						{ label: t('settings.options.es'), value: 'es-ES', flag: '🇪🇸' },
						{ label: t('settings.options.de'), value: 'de-DE', flag: '🇩🇪' },
						{ label: t('settings.options.pt'), value: 'pt-PT', flag: '🇵🇹' },
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

	onMounted(async () => {
		Object.assign(state, await invoke<State>('load_preferences'))
		state.launch_login = await loadLaunchLogin()
	})

	watch(
		() => state.language,
		(language) => setLanguage(language),
	)

	watch(
		() => state.launch_login,
		async (enabled) => await saveLaunchLogin(enabled),
	)

	watch(
		() => state.show_in_dock,
		(show) => {
			setShowInDock(show)
		},
	)

	watch(
		state,
		() => {
			invoke('save_preferences', {
				preferences: {
					language: state.language === 'default' ? getSystemLanguage() : state.language,
					launch_login: state.launch_login,
					auto_update: state.auto_update,
					show_in_dock: state.show_in_dock,
					position: state.position,
					font_size: state.font_size,
					smart_translate: state.smart_translate,
				},
			}).catch((error) => console.error('保存偏好设置失败:', error))
		},
		{ deep: true },
	)
</script>

<template>
	<div>
		<div class="flex items-center justify-between pb-4.5">
			<div>
				<p class="text-xs font-thin text-gray-400">TRANO / PREFERENCE</p>
				<h1 class="mt-1 text-2xl leading-none font-bold">{{ t('settings.preferenceTitle') }}</h1>
			</div>
			<div
				class="trano-effect-glass flex items-center gap-2 rounded-lg px-2 py-1 leading-none"
				data-status="updated"
			>
				<em>~</em>
				<span class="text-[10px]">{{ t(`settings.updated`) }}</span>
			</div>
		</div>

		<div class="grid h-[calc(100vh-36px-62px)] gap-6 overflow-y-auto pb-20">
			<section v-for="group in list" :key="group.title">
				<div class="flex items-center gap-2 leading-none">
					<component :is="group.icon" class="trano-effect-glass h-8 w-8 rounded-lg p-2" />
					<div>
						<h3 class="text-sm">{{ group.title }}</h3>
						<p class="text-xs text-gray-400">{{ group.description }}</p>
					</div>
				</div>
				<ul class="trano-effect-glass mt-2 rounded-lg">
					<li
						v-for="item in group.items"
						:key="item.label"
						class="flex items-center justify-between p-3 transition-all not-last:border-b not-last:border-white/50 first:rounded-t-xl last:rounded-b-xl hover:bg-white/25"
					>
						<div class="flex flex-col gap-1 leading-none">
							<strong class="text-sm">{{ item.label }}</strong>
							<span class="text-xs text-gray-400">{{ item.hint }}</span>
						</div>
						<div class="flex items-center gap-2.5">
							<template v-if="item.key === 'auto_update'">
								<ShadcnButton class="check-update-button" type="button" size="xs">
									<IconifyRefreshCw class="iconify" />
									{{ t('settings.checkForUpdates') }}
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
								:min="10"
								:max="32"
								:step="2"
								class="w-30"
							/>
						</div>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<style scoped lang="scss">
	/** */
</style>
