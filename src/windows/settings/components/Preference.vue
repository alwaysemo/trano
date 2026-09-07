<script setup lang="ts">
	import { computed, reactive, watch } from 'vue'
	import { useI18n } from 'vue-i18n'
	import IconifyGlobe from '@iconify-vue/lucide/globe-2'
	import IconifyMonitor from '@iconify-vue/lucide/monitor'
	import IconifySparkles from '@iconify-vue/lucide/sparkles'
	import IconifySave from '@iconify-vue/lucide/save'
	import Switch from '@components/base/Switch.vue'
	import Select from '@components/base/Select.vue'
	import Slider from '@components/base/Slider.vue'
	import type { Menus } from '@windows/settings/components/types'
	import { getLocalePreference, setLocale } from '@/i18n'

	const { t } = useI18n()

	const state = reactive({
		language: getLocalePreference(),
		launchAtLogin: true,
		autoUpdate: true,
		position: 'center',
		fontSize: 16,
		smartTranslate: true,
	})
	type PreferenceState = typeof state

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
</script>

<template>
	<div>
		<div class="module-header-container">
			<div>
				<p>TRANO / PREFERENCE</p>
				<h1>{{ t('settings.preferenceTitle') }}</h1>
			</div>
			<span class="status-mark" :data-status="'danger'">{{ t('settings.synced') }}</span>
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
						<div>
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
				<span>{{ t('settings.autoSave') }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use './style.scss';
</style>
