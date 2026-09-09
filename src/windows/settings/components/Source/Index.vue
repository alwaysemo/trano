<script setup lang="ts">
	import { useI18n } from 'vue-i18n'
	import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
	import { createSwapy, type Swapy } from 'swapy'
	import IconifyMinus from '@iconify-vue/lucide/minus'
	import IconifyPlus from '@iconify-vue/lucide/plus'
	import SvgBing from '@assets/svg/bing.svg'
	import SvgGoogle from '@assets/svg/googlefanyi.svg'
	import SvgBaidu from '@assets/svg/baidufanyi.svg'
	import type { Source } from './types'

	const { t } = useI18n()

	const swapy = ref<Swapy | null>(null)
	const container = ref<HTMLElement | null>(null)

	onMounted(() => {
		if (container.value) {
			swapy.value = createSwapy(container.value)
		}
	})

	onUnmounted(() => {
		swapy.value?.destroy()
	})

	const list = ref<Source[]>([
		{
			key: '1',
			type: 'Bing',
			name: t('settings.sourceBing'),
			icon: SvgBing,
			hint: t('settings.sourceBuiltInHint'),
			options: [
				{
					name: t('settings.sourceName'),
					key: 'name',
					type: 'input',
					placeholder: t('settings.sourcePlaceholderName'),
				},
			],
		},
		{
			key: '2',
			type: 'Google',
			name: t('settings.sourceGoogle'),
			icon: SvgGoogle,
			hint: t('settings.sourceBuiltInHint'),
			options: [
				{
					name: t('settings.sourceName'),
					key: 'name',
					type: 'input',
					placeholder: t('settings.sourcePlaceholderName'),
				},
			],
		},
		{
			key: '3',
			type: 'Baidu',
			name: t('settings.sourceBaidu'),
			icon: SvgBaidu,
			options: [
				{
					name: t('settings.sourceName'),
					key: 'name',
					type: 'input',
					placeholder: t('settings.sourcePlaceholderName'),
				},
				{
					name: t('settings.sourceAppId'),
					key: 'appid',
					type: 'input',
					placeholder: t('settings.sourcePlaceholderAppId'),
				},
				{
					name: t('settings.sourceAppKey'),
					key: 'appkey',
					type: 'input',
					placeholder: t('settings.sourcePlaceholderAppKey'),
				},
			],
		},
	])

	const selected = ref<Source>(list.value[0])
	watch(
		() => list.value,
		(providers) => {
			const currentKey = selected.value?.key
			selected.value = providers.find((provider) => provider.key === currentKey) ?? providers[0]
		},
		{ immediate: true },
	)
	const sourceProviders = computed(() =>
		list.value.map((source) => ({
			...source,
			options: source.options.map((option) => ({ ...option })),
		})),
	)
	const showProviderPicker = ref(false)
	const values = reactive<Record<string, Record<string, string>>>({
		1: { name: t('settings.sourceBing') },
		2: { name: t('settings.sourceGoogle') },
		3: { name: t('settings.sourceBaidu'), appid: '', appkey: '' },
	})
	const selectedValues = computed(() => values[selected.value.key] ?? {})
	let customSourceNumber = 1

	const selectSource = (source: Source) => {
		selected.value = source
	}

	const addSource = async (provider: Source) => {
		const key = `custom-${customSourceNumber++}`
		const source: Source = {
			key,
			type: `${provider.type}-${customSourceNumber - 1}`,
			name: provider.name,
			icon: provider.icon,
			hint: provider.hint,
			options: provider.options.map((option) => ({ ...option })),
		}

		list.value.push(source)
		values[source.key] = Object.fromEntries(
			source.options.map((option) => [option.key, option.key === 'name' ? source.name : '']),
		)
		selected.value = source
		showProviderPicker.value = false
		await nextTick()
		swapy.value?.update()
	}

	const openProviderPicker = () => {
		showProviderPicker.value = true
	}

	const removeSource = async () => {
		if (list.value.length === 1) return
		if (!selected.value) return

		const index = list.value.findIndex((source) => source.key === selected.value.key)
		if (index === -1) return

		const [removed] = list.value.splice(index, 1)
		delete values[removed.key]
		selected.value = list.value[Math.min(index, list.value.length - 1)]
		await nextTick()
		swapy.value?.update()
	}
</script>

<template>
	<div>
		<div class="flex items-center justify-between pb-4.5">
			<div>
				<p class="text-xs font-thin text-gray-400">TRANO / SOURCE</p>
				<h1 class="mt-1 text-2xl font-bold leading-none">{{ t('settings.source') }}</h1>
			</div>
			<span
				class="relative flex items-center gap-1.25 rounded-[99px] border border-white/50 bg-white/25 py-1.25 pl-5 pr-2.25 text-[10px] text-amber-500 shadow-[inset_1px_1px_3px_rgb(255_255_255_/_45%)] before:absolute before:left-2.5 before:top-1/2 before:h-1.25 before:w-1.25 before:-translate-y-1/2 before:rounded-full before:bg-amber-500 after:absolute after:left-2.5 after:top-1/2 after:h-1.25 after:w-1.25 after:-translate-y-1/2 after:animate-ping after:rounded-full after:bg-amber-500"
				>{{ t('settings.sourceSaved') }}</span
			>
		</div>

		<div
			class="grid h-[calc(100vh-106px)] grid-cols-[200px_1fr] gap-2 [&>div]:overflow-hidden [&>div]:rounded-xl [&>div]:border [&>div]:border-white/50 [&>div]:bg-white/10 [&>div]:shadow-[inset_4px_2px_8px_rgb(255_255_255_/_50%)] [&>div]:backdrop-blur-[20px]"
		>
			<div class="grid grid-rows-[1fr_50px]">
				<div>
					<ul ref="container" class="relative z-2 flex h-full flex-col gap-1.5 overflow-y-auto p-2.5">
						<li v-for="item in list" :key="item.key" :data-swapy-slot="item.key">
							<div
								class="flex cursor-pointer items-center gap-2.5 rounded-md border border-transparent p-1 transition-all hover:border-white/50 hover:bg-white/10 hover:shadow-[inset_4px_2px_8px_rgb(255_255_255_/_50%)] hover:backdrop-blur-[20px] data-[selected=true]:border-white/50 data-[selected=true]:bg-white/10 data-[selected=true]:shadow-[inset_4px_2px_8px_rgb(255_255_255_/_50%)] data-[selected=true]:backdrop-blur-[20px]"
								:data-swapy-item="item.key"
								:data-selected="selected.type === item.type"
								@click="selectSource(item)"
							>
								<img
									class="h-7.5 w-7.5 rounded-md border border-white/50 bg-white/10 p-1.5 shadow-[inset_4px_2px_8px_rgb(255_255_255_/_50%)] backdrop-blur-[20px]"
									:src="item.icon"
									:alt="item.type"
								/>
								<span>{{ item.name }}</span>
							</div>
						</li>
					</ul>
				</div>
				<div class="flex items-center justify-end gap-1 border-t border-gray-100 px-3">
					<ShadcnButton :disabled="list.length === 1" @click="removeSource">
						<IconifyMinus class="iconify" />
					</ShadcnButton>
					<ShadcnButton @click="openProviderPicker">
						<IconifyPlus class="iconify" />
					</ShadcnButton>
				</div>
			</div>
			<div class="overflow-y-auto p-6">
				<div class="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
					<div>
						<h2 class="text-lg leading-tight">{{ selected.name }}</h2>
						<p class="mt-1.5 text-xs text-gray-400">{{ selected.hint ?? t('settings.sourceCustomHint') }}</p>
					</div>
					<img
						class="h-12 w-12 rounded-[10px] border border-gray-100 bg-[#ffffff1d] p-2 shadow-[inset_4px_2px_8px_#ffffff7e] backdrop-blur-[20px]"
						:src="selected.icon"
						:alt="selected.type"
					/>
				</div>
				<div class="grid gap-3.5 pt-5">
					<label
						v-for="item in selected.options"
						:key="item.key"
						class="grid grid-cols-[80px_1fr] items-center gap-4 text-xs"
					>
						<span class="text-right">{{ item.name }}</span>
						<ShadcnInput
							v-if="item.type === 'input'"
							v-model="selectedValues[item.key]"
							:placeholder="item.placeholder"
						/>
					</label>
				</div>
				<div class="mt-5 text-right">
					<ShadcnButton>{{ t('settings.sourceValidate') }}</ShadcnButton>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	/** */
</style>
