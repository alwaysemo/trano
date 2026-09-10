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
			label: 'Google翻译',
			value: false,
			icon: IconGoogle,
			hint: '内置翻译源 - 无需配置',
			options: [],
		},
		{
			type: 'bing',
			label: 'Bing翻译',
			value: false,
			icon: IconBing,
			hint: '内置翻译源 - 无需配置',
			options: [],
		},
		{
			type: 'baidu',
			label: '百度翻译',
			value: false,
			icon: IconBaidu,
			hint: '百度翻译 - 您的超级翻译伙伴',
			options: [
				{ key: 'name', type: 'input', value: '百度翻译', name: '百度翻译', placeholder: '请输入名称' },
				{ key: 'app_id', type: 'input', value: '', name: 'AppId', placeholder: '请输入AppId' },
				{ key: 'secret_key', type: 'input', value: '', name: 'SecretKey', placeholder: '请输入SecretKey' },
			],
		},
	])

	onMounted(() => {
		if (container.value) swapy.value = createSwapy(container.value)
	})

	onUnmounted(() => {
		swapy.value?.destroy()
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
							class="trano-effect-glass flex h-15 items-center gap-2 overflow-hidden rounded-md p-2"
							:data-swapy-item="item.type"
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
			<div class="trano-effect-glass rounded-lg p-2">

			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	/** */
</style>
