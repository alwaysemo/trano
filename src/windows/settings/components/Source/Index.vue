<script setup lang="ts">
	import type { Source } from './types'
	import { useI18n } from 'vue-i18n'
	import { onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue'
	import { createSwapy } from 'swapy'
	import IconifyPlus from '@iconify-vue/lucide/plus'
	import IconifyMinus from '@iconify-vue/lucide/minus'
	import IconGoogle from '@assets/svg/google.svg'
	import IconBing from '@assets/svg/bing.svg'
	import IconBaidu from '@assets/svg/baidu.svg'

	const { t } = useI18n()
	const swapy = ref<ReturnType<typeof createSwapy> | null>(null)
	const container = useTemplateRef<HTMLElement>('container')

	const source = reactive<Source[]>([
		{
			type: 'google',
			label: t('settings.sourceGoogle'),
			value: false,
			icon: IconGoogle,
			hint: t('settings.sourceBuiltInHint'),
			options: [],
		},
		{
			type: 'bing',
			label: t('settings.sourceBing'),
			value: false,
			icon: IconBing,
			hint: t('settings.sourceBuiltInHint'),
			options: [],
		},
		{
			type: 'baidu',
			label: t('settings.sourceBaidu'),
			value: false,
			icon: IconBaidu,
			hint: t('settings.sourceCustomHint'),
			options: [
				{
					key: 'name',
					type: 'input',
					value: t(t('settings.sourceBaidu')),
					name: t('settings.sourceName'),
					placeholder: t('settings.sourcePlaceholderName'),
				},
				{
					key: 'app_id',
					type: 'input',
					value: '',
					name: t('settings.sourceAppId'),
					placeholder: t('settings.sourcePlaceholderAppId'),
				},
				{
					key: 'secret_key',
					type: 'input',
					value: '',
					name: t('settings.sourceAppKey'),
					placeholder: t('settings.sourcePlaceholderAppKey'),
				},
			],
		},
	])
	const selectedSource = ref<Source>(source[0]!)

	onMounted(() => {
		if (container.value) swapy.value = createSwapy(container.value)
	})

	onUnmounted(() => {
		if (swapy.value) swapy.value.destroy()
	})
</script>

<template>
	<div>
		<div class="flex items-center justify-between pb-4.5">
			<div>
				<p class="text-xs font-thin text-gray-400">TRANO / SOURCE</p>
				<h1 class="mt-1 text-2xl leading-none font-bold">{{ t('settings.source') }}</h1>
			</div>
			<div class="trano-effect-glass flex items-center gap-2 rounded-lg px-2 py-1 leading-none" data-status="updated">
				<em>~</em>
				<span class="text-[10px]">{{ t(`settings.updated`) }}</span>
			</div>
		</div>

		<div class="grid h-[calc(100vh-36px-62px-10px)] grid-cols-[200px_1fr] gap-2">
			<div class="trano-effect-glass overflow-hidden rounded-lg">
				<ul class="h-[calc(100%-40px)] overflow-y-auto p-2" ref="container">
					<li class="not-first:mt-2" v-for="item in source" :key="item.type" :data-swapy-slot="item.type">
						<div
							class="flex h-15 cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2"
							:data-swapy-item="item.type"
							:class="{ 'trano-effect-glass': selectedSource.type === item.type }"
							@click="selectedSource = item"
						>
							<img class="h-8 w-8" :src="item.icon" :alt="item.label" />
							<p class="mr-auto text-sm">{{ item.label }}</p>
							<ShadcnSwitch v-model="item.value" />
						</div>
					</li>
				</ul>
				<div class="flex justify-end gap-1 border-t p-2">
					<ShadcnButton type="button" size="xs">
						<IconifyMinus class="h-2 w-2" />
					</ShadcnButton>
					<ShadcnButton type="button" size="xs">
						<IconifyPlus class="h-2 w-2" />
					</ShadcnButton>
				</div>
			</div>
			<div class="trano-effect-glass overflow-y-auto rounded-lg p-4">
				<div class="flex items-center gap-3 border-b pb-4">
					<img
						class="trano-effect-glass h-12 w-12 rounded-md p-2"
						:src="selectedSource.icon"
						:alt="selectedSource.label"
					/>
					<div>
						<h2 class="text-lg font-semibold">{{ selectedSource.label }}</h2>
						<p class="text-xs text-gray-400">{{ selectedSource.hint }}</p>
					</div>
				</div>
				<div v-if="selectedSource.options.length" class="mt-4 space-y-2">
					<div v-for="option in selectedSource.options" :key="option.key">
						<label class="pl-3 text-sm">{{ option.name }}</label>
						<ShadcnInput v-model="option.value" type="text" :placeholder="option.placeholder" />
					</div>
					<div class="mt-6 flex justify-end">
						<ShadcnButton type="button">{{ t('settings.sourceValidate') }}</ShadcnButton>
					</div>
				</div>
				<p v-else class="py-8 text-center text-sm text-gray-400">{{ t('settings.sourceNoConfiguration') }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	/** */
</style>
