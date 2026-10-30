<script setup lang="ts">
	import type { Source, SourceEntry, SourceOption } from './types'
	import { useI18n } from 'vue-i18n'
	import { computed, nextTick, onMounted, onUnmounted, reactive, ref, useTemplateRef, watch } from 'vue'
	import { invoke } from '@tauri-apps/api/core'
	import { createSwapy } from 'swapy'
	import { toast } from '@/composables/toast'
	import IconifyPlus from '@iconify-vue/lucide/plus'
	import IconifyMinus from '@iconify-vue/lucide/minus'
	import IconifyLanguages from '@iconify-vue/lucide/languages'
	import IconGoogle from '@assets/svg/google.svg'
	import IconBing from '@assets/svg/bing.svg'
	import IconBaidu from '@assets/svg/baidu.svg'
	import IconDeepL from '@assets/svg/deepl.svg'
	import IconYoudao from '@assets/svg/youdao.svg'
	import IconTencent from '@assets/svg/tencent.svg'
	import IconHuoshan from '@assets/svg/huoshanyun.svg'
	import IconOllama from '@assets/svg/ollama.svg'
	import PickerGroup from './PickerGroup.vue'

	const { t } = useI18n()
	const swapy = ref<ReturnType<typeof createSwapy> | null>(null)
	const container = useTemplateRef<HTMLElement>('container')

	function makeOption(
		key: string,
		nameKey: string,
		placeholderKey: string,
		password = false,
		value = '',
	): SourceOption {
		return { key, nameKey, placeholderKey, value, password }
	}

	/** 自定义翻译源：名称 + AppID + AppKey 的通用鉴权结构 */
	function createCustomSource(id: string, values: Record<string, string> = {}, enabled = false): Source {
		return {
			type: id,
			label: t('settings.sourceCustom'),
			value: enabled,
			hintKey: 'settings.sourceCustomHint',
			custom: true,
			options: [
				makeOption('name', 'settings.sourceName', 'settings.sourcePlaceholderName', false, values['name'] ?? ''),
				makeOption('app_id', 'settings.sourceAppId', 'settings.sourcePlaceholderAppId', false, values['app_id'] ?? ''),
				makeOption(
					'secret_key',
					'settings.sourceAppKey',
					'settings.sourcePlaceholderAppKey',
					true,
					values['secret_key'] ?? '',
				),
			],
		}
	}

	/** 内置翻译源清单：同时作为左侧列表的初始数据和「添加翻译源」弹窗的候选目录 */
	function createBuiltInSources(): Source[] {
		return [
			{
				type: 'google',
				label: t('settings.sourceGoogle'),
				labelKey: 'settings.sourceGoogle',
				value: false,
				icon: IconGoogle,
				hintKey: 'settings.sourceBuiltInHint',
				options: [],
			},
			{
				type: 'bing',
				label: t('settings.sourceBing'),
				labelKey: 'settings.sourceBing',
				value: false,
				icon: IconBing,
				hintKey: 'settings.sourceBuiltInHint',
				options: [],
			},
			{
				type: 'baidu',
				label: t('settings.sourceBaidu'),
				labelKey: 'settings.sourceBaidu',
				value: false,
				icon: IconBaidu,
				hintKey: 'settings.sourceKeyedHint',
				options: [
					makeOption('app_id', 'settings.sourceAppId', 'settings.sourcePlaceholderAppId'),
					makeOption('secret_key', 'settings.sourceAppKey', 'settings.sourcePlaceholderAppKey', true),
				],
			},
			{
				type: 'deepl',
				label: t('settings.sourceDeepL'),
				labelKey: 'settings.sourceDeepL',
				value: false,
				icon: IconDeepL,
				hintKey: 'settings.sourceKeyedHint',
				options: [makeOption('api_key', 'settings.sourceApiKey', 'settings.sourcePlaceholderApiKey', true)],
			},
			{
				type: 'youdao',
				label: t('settings.sourceYoudao'),
				labelKey: 'settings.sourceYoudao',
				value: false,
				icon: IconYoudao,
				hintKey: 'settings.sourceKeyedHint',
				options: [
					makeOption('app_id', 'settings.sourceAppId', 'settings.sourcePlaceholderAppId'),
					makeOption('secret_key', 'settings.sourceAppKey', 'settings.sourcePlaceholderAppKey', true),
				],
			},
			{
				type: 'tencent',
				label: t('settings.sourceTencent'),
				labelKey: 'settings.sourceTencent',
				value: false,
				icon: IconTencent,
				hintKey: 'settings.sourceKeyedHint',
				options: [
					makeOption('secret_id', 'settings.sourceSecretId', 'settings.sourcePlaceholderSecretId'),
					makeOption('secret_key', 'settings.sourceSecretKey', 'settings.sourcePlaceholderSecretKey', true),
				],
			},
			{
				type: 'huoshanyun',
				label: t('settings.sourceHuoshan'),
				labelKey: 'settings.sourceHuoshan',
				value: false,
				icon: IconHuoshan,
				hintKey: 'settings.sourceKeyedHint',
				options: [
					makeOption('access_key_id', 'settings.sourceAccessKeyId', 'settings.sourcePlaceholderAccessKeyId'),
					makeOption(
						'access_key_secret',
						'settings.sourceAccessKeySecret',
						'settings.sourcePlaceholderAccessKeySecret',
						true,
					),
				],
			},
			{
				type: 'ollama',
				label: t('settings.sourceOllama'),
				labelKey: 'settings.sourceOllama',
				value: false,
				icon: IconOllama,
				hintKey: 'settings.sourceLocalHint',
				options: [
					makeOption(
						'base_url',
						'settings.sourceBaseUrl',
						'settings.sourcePlaceholderBaseUrl',
						false,
						'http://localhost:11434',
					),
					makeOption('model', 'settings.sourceModel', 'settings.sourcePlaceholderModel'),
				],
			},
		]
	}

	/** 候选目录：弹窗里可选的所有翻译源类型；左侧列表由目录克隆出来的实例组成 */
	const catalog = createBuiltInSources()

	/** 首次启动的默认列表：只放不需要密钥的内置源，其余类型由用户从弹窗里挑 */
	const source = reactive<Source[]>(
		catalog.filter((item) => item.type === 'google' || item.type === 'bing').map((item) => cloneSource(item)),
	)
	const selectedSource = ref<Source | null>(source[0] ?? null)
	const status = ref<'updated' | 'saved'>('saved')
	const loaded = ref(false)
	const addDialogOpen = ref(false)
	const removeDialogOpen = ref(false)
	let saveTimer: ReturnType<typeof setTimeout> | undefined

	/** 目录里的定义只读，添加时克隆一份，避免列表改动污染目录 */
	function cloneSource(definition: Source): Source {
		return { ...definition, options: definition.options.map((option) => ({ ...option })) }
	}

	/** 弹窗候选：内置源按有无本地部署分成两组，后者用于 Ollama 这类本地服务 */
	const builtInCatalog = catalog.filter((item) => item.type !== 'ollama')
	const localCatalog = catalog.filter((item) => item.type === 'ollama')

	/** 内置源已经在列表里时不可重复添加，弹窗中置灰并标注 */
	const addedIds = computed(() => source.map((item) => item.type))

	/** 内置源名称走 i18n，自定义源以用户填写的名称为准 */
	function displayLabel(item: Source): string {
		if (item.custom) {
			const name = item.options.find((option) => option.key === 'name')?.value.trim()
			return name || t('settings.sourceCustom')
		}
		return item.labelKey ? t(item.labelKey) : item.label
	}

	function toEntries(): SourceEntry[] {
		return source.map((item) => ({
			id: item.type,
			enabled: item.value,
			options: Object.fromEntries(item.options.map((option) => [option.key, option.value])),
		}))
	}

	function persist() {
		invoke('save_sources', { sources: toEntries() })
			.then(() => (status.value = 'saved'))
			.catch((error) => console.error('保存翻译源设置失败:', error))
	}

	watch(
		source,
		() => {
			if (!loaded.value) return
			status.value = 'updated'
			clearTimeout(saveTimer)
			saveTimer = setTimeout(persist, 300)
		},
		{ deep: true },
	)

	/**
	 * 以存档为准还原列表：内置源按目录定义重建，未知 id 还原为自定义源，顺序保留存档顺序。
	 * null 表示首次启动，此时保留预置的免密钥源；空数组则如实渲染空列表。
	 */
	function mergeSaved(saved: SourceEntry[] | null) {
		if (!saved) {
			selectedSource.value = source[0] ?? null
			return
		}
		const merged: Source[] = []
		for (const entry of saved) {
			const definition = catalog.find((item) => item.type === entry.id)
			if (definition) {
				const item = cloneSource(definition)
				item.value = entry.enabled
				for (const option of item.options) {
					const value = entry.options[option.key]
					if (value !== undefined) option.value = value
				}
				merged.push(item)
			} else {
				merged.push(createCustomSource(entry.id, entry.options, entry.enabled))
			}
		}
		source.splice(0, source.length, ...merged)
		selectedSource.value = source[0] ?? null
	}

	/** 拖拽结束后把 swapy 的槽位顺序回写到数据层，保证 DOM、数据、存档三者一致 */
	function syncOrder(slotItemMap: { slot: string; item: string }[]) {
		const byId = new Map(source.map((item) => [item.type, item]))
		const reordered = slotItemMap.map(({ item }) => byId.get(item)).filter((item): item is Source => Boolean(item))
		for (const item of source) if (!reordered.includes(item)) reordered.push(item)
		source.splice(0, source.length, ...reordered)
		nextTick(() => swapy.value?.update())
	}

	/** 列表清空时容器随之卸载；实例必须跟着销毁，否则会绑定到已移除的 DOM */
	function ensureSwapy() {
		nextTick(() => {
			if (!container.value) {
				if (swapy.value) {
					swapy.value.destroy()
					swapy.value = null
				}
				return
			}
			if (!swapy.value) {
				swapy.value = createSwapy(container.value)
				swapy.value.onSwapEnd(({ slotItemMap, hasChanged }) => {
					if (hasChanged) syncOrder(slotItemMap.asArray)
				})
				return
			}
			swapy.value.update()
		})
	}

	/** 点击加号先弹窗选类型，不在没有提示的情况下改列表 */
	function openAddDialog() {
		addDialogOpen.value = true
	}

	function commitAddition(item: Source) {
		source.push(item)
		selectedSource.value = item
		addDialogOpen.value = false
		toast.success(t('settings.sourceAdded', { source: displayLabel(item) }))
		ensureSwapy()
	}

	/** 添加目录里的内置源：已存在则直接选中它，不重复插入 */
	function addBuiltIn(definition: Source) {
		const existing = source.find((item) => item.type === definition.type)
		if (existing) {
			selectedSource.value = existing
			addDialogOpen.value = false
			return
		}
		commitAddition(cloneSource(definition))
	}

	function addCustom() {
		commitAddition(createCustomSource(`custom-${Date.now()}`))
	}

	/** 任何翻译源都可移除：内置源随时能从弹窗里加回来 */
	function requestRemove() {
		if (!selectedSource.value) return
		removeDialogOpen.value = true
	}

	function confirmRemove() {
		const current = selectedSource.value
		const index = current ? source.findIndex((item) => item.type === current.type) : -1
		if (index !== -1) source.splice(index, 1)
		selectedSource.value = source[0] ?? null
		removeDialogOpen.value = false
		toast.success(t('settings.sourceRemoved'))
		ensureSwapy()
	}

	// 仅做必填完整性校验；真实的 API 连通性验证随翻译引擎一并实现
	function validateSelected() {
		if (!selectedSource.value) return
		for (const option of selectedSource.value.options) {
			if (!option.value.trim()) {
				toast.warning(t('settings.sourceFieldRequired', { field: t(option.nameKey) }))
				return
			}
		}
		toast.success(t('settings.sourceValidateSuccess'))
	}

	onMounted(async () => {
		try {
			mergeSaved(await invoke<SourceEntry[] | null>('load_sources'))
		} catch (error) {
			console.error('加载翻译源设置失败:', error)
		}
		loaded.value = true
		ensureSwapy()
	})

	onUnmounted(() => {
		if (saveTimer) {
			clearTimeout(saveTimer)
			persist()
		}
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
			<div class="trano-effect-glass flex items-center gap-2 rounded-lg px-2 py-1 leading-none" :data-status="status">
				<em>{{ status === 'saved' ? '✓' : '~' }}</em>
				<span class="text-[10px]">{{ status === 'saved' ? t('settings.saved') : t('settings.updated') }}</span>
			</div>
		</div>

		<div class="grid h-[calc(100vh-36px-62px-10px)] grid-cols-[200px_1fr] gap-2">
			<div class="trano-effect-glass flex flex-col overflow-hidden rounded-lg">
				<ul v-if="source.length" class="min-h-0 flex-1 overflow-y-auto p-2" ref="container">
					<li class="not-first:mt-2" v-for="item in source" :key="item.type" :data-swapy-slot="item.type">
						<div
							class="flex h-15 cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2"
							:data-swapy-item="item.type"
							:class="{ 'trano-effect-glass': selectedSource?.type === item.type }"
							@click="selectedSource = item"
						>
							<img v-if="item.icon" class="h-8 w-8" :src="item.icon" :alt="displayLabel(item)" />
							<IconifyLanguages v-else class="h-8 w-8 p-1 text-gray-400" />
							<p class="mr-auto truncate text-sm">{{ displayLabel(item) }}</p>
							<ShadcnSwitch v-model="item.value" @click.stop />
						</div>
					</li>
				</ul>
				<div v-else class="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
					<IconifyLanguages class="h-6 w-6 text-gray-400" />
					<p class="text-xs text-gray-500">{{ t('settings.sourceEmptyTitle') }}</p>
				</div>
				<div class="mt-auto flex justify-end gap-1 border-t p-2">
					<ShadcnButton
						type="button"
						size="xs"
						:title="t('settings.sourceRemove')"
						:disabled="!selectedSource"
						@click="requestRemove"
					>
						<IconifyMinus class="h-2 w-2" />
					</ShadcnButton>
					<ShadcnButton type="button" size="xs" :title="t('settings.sourceAdd')" @click="openAddDialog">
						<IconifyPlus class="h-2 w-2" />
					</ShadcnButton>
				</div>
			</div>
			<div class="trano-effect-glass flex flex-col overflow-y-auto rounded-lg p-4">
				<template v-if="selectedSource">
					<div class="flex items-center gap-3 border-b pb-4">
						<img
							v-if="selectedSource.icon"
							class="trano-effect-glass h-12 w-12 rounded-md p-2"
							:src="selectedSource.icon"
							:alt="displayLabel(selectedSource)"
						/>
						<div v-else class="trano-effect-glass flex h-12 w-12 items-center justify-center rounded-md">
							<IconifyLanguages class="h-6 w-6 text-gray-400" />
						</div>
						<div class="min-w-0">
							<h2 class="truncate text-lg font-semibold">{{ displayLabel(selectedSource) }}</h2>
							<p class="text-xs text-gray-400">{{ t(selectedSource.hintKey) }}</p>
						</div>
					</div>
					<div v-if="selectedSource.options.length" class="mt-4 space-y-2">
						<div v-for="option in selectedSource.options" :key="option.key">
							<label class="pl-3 text-sm">{{ t(option.nameKey) }}</label>
							<ShadcnInput
								v-model="option.value"
								:type="option.password ? 'password' : 'text'"
								:placeholder="t(option.placeholderKey)"
							/>
						</div>
						<div class="mt-6 flex justify-end">
							<ShadcnButton type="button" @click="validateSelected">{{ t('settings.sourceValidate') }}</ShadcnButton>
						</div>
					</div>
					<p v-else class="py-8 text-center text-sm text-gray-400">{{ t('settings.sourceNoConfiguration') }}</p>
				</template>
				<div v-else class="flex flex-1 flex-col items-center justify-center py-10 text-center">
					<IconifyLanguages class="h-8 w-8 text-gray-400" />
					<p class="mt-3 text-sm">{{ t('settings.sourceEmptyTitle') }}</p>
					<p class="mt-1 text-xs text-gray-400">{{ t('settings.sourceEmptyHint') }}</p>
				</div>
			</div>
		</div>

		<ShadcnDialog v-model:open="addDialogOpen">
			<ShadcnDialogContent class="max-h-[calc(100vh-2rem)] max-w-lg grid-rows-[auto_minmax(0,1fr)_auto] gap-4">
				<ShadcnDialogHeader>
					<ShadcnDialogTitle>{{ t('settings.sourceAddTitle') }}</ShadcnDialogTitle>
					<ShadcnDialogDescription class="sr-only">{{ t('settings.sourceAddDescription') }}</ShadcnDialogDescription>
				</ShadcnDialogHeader>
				<div class="min-h-0 space-y-3 overflow-y-auto pr-1">
					<PickerGroup
						:title="t('settings.sourceAddBuiltIn')"
						:items="builtInCatalog"
						:added-ids="addedIds"
						@pick="addBuiltIn"
					/>
					<PickerGroup
						v-if="localCatalog.length"
						:title="t('settings.sourceAddLocal')"
						:items="localCatalog"
						:added-ids="addedIds"
						@pick="addBuiltIn"
					/>
					<section>
						<p class="px-1.5 text-[11px] font-semibold tracking-wide text-gray-500">
							{{ t('settings.sourceAddCustomSection') }}
						</p>
						<ul class="mt-1 grid grid-cols-2 gap-0.5">
							<li>
								<button
									type="button"
									class="group flex w-full cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-white/60"
									@click="addCustom"
								>
									<span class="trano-effect-glass flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
										<IconifyLanguages class="h-3 w-3 text-gray-500" />
									</span>
									<span class="min-w-0 flex-1 truncate text-[13px] leading-tight">
										{{ t('settings.sourceAddCustomLabel') }}
									</span>
									<IconifyPlus
										class="h-3.5 w-3.5 shrink-0 text-gray-400 opacity-40 transition-opacity group-hover:opacity-100"
									/>
								</button>
							</li>
						</ul>
					</section>
				</div>
				<ShadcnDialogFooter>
					<ShadcnButton type="button" variant="outline" @click="addDialogOpen = false">
						{{ t('common.cancel') }}
					</ShadcnButton>
				</ShadcnDialogFooter>
			</ShadcnDialogContent>
		</ShadcnDialog>

		<ShadcnDialog v-model:open="removeDialogOpen">
			<ShadcnDialogContent>
				<ShadcnDialogHeader>
					<ShadcnDialogTitle>{{ t('common.confirm') }}</ShadcnDialogTitle>
					<ShadcnDialogDescription>
						{{ selectedSource?.custom ? t('settings.sourceRemoveConfirm') : t('settings.sourceRemoveBuiltInConfirm') }}
					</ShadcnDialogDescription>
				</ShadcnDialogHeader>
				<ShadcnDialogFooter>
					<ShadcnButton type="button" variant="outline" @click="removeDialogOpen = false">
						{{ t('common.cancel') }}
					</ShadcnButton>
					<ShadcnButton type="button" variant="destructive" @click="confirmRemove">{{ t('common.ok') }}</ShadcnButton>
				</ShadcnDialogFooter>
			</ShadcnDialogContent>
		</ShadcnDialog>
	</div>
</template>

<style scoped lang="scss">
	/** */
</style>
