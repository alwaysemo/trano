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
		<div class="module-header-container">
			<div>
				<p>TRANO / SOURCE</p>
				<h1>{{ t('settings.source') }}</h1>
			</div>
			<span class="status-mark" data-status="warning">{{ t('settings.sourceSaved') }}</span>
		</div>

		<div class="module-main-container">
			<div class="source-container">
				<div class="source-main-container">
					<ul ref="container">
						<li v-for="item in list" :key="item.key" :data-swapy-slot="item.key">
							<div :data-swapy-item="item.key" :data-selected="selected.type === item.type" @click="selectSource(item)">
								<img :src="item.icon" :alt="item.type" />
								<span>{{ item.name }}</span>
							</div>
						</li>
					</ul>
				</div>
				<div class="source-footer-container">
					<ShadcnButton :disabled="list.length === 1" @click="removeSource">
						<IconifyMinus class="iconify" />
					</ShadcnButton>
					<ShadcnButton @click="openProviderPicker">
						<IconifyPlus class="iconify" />
					</ShadcnButton>
				</div>
			</div>
			<div class="source-config-container">
				<div class="source-config-header">
					<div>
						<h2>{{ selected.name }}</h2>
						<p>{{ selected.hint ?? t('settings.sourceCustomHint') }}</p>
					</div>
					<img :src="selected.icon" :alt="selected.type" />
				</div>
				<div class="source-config-main">
					<label v-for="item in selected.options" :key="item.key">
						<span>{{ item.name }}</span>
						<ShadcnInput
							v-if="item.type === 'input'"
							v-model="selectedValues[item.key]"
							:placeholder="item.placeholder"
						/>
					</label>
				</div>
				<div class="source-config-footer">
					<ShadcnButton>{{ t('settings.sourceValidate') }}</ShadcnButton>
				</div>
			</div>
		</div>

		<AppModal v-model="showProviderPicker" :title="t('settings.sourceAdd')" width="420px">
			<div class="provider-picker-list">
				<button v-for="provider in sourceProviders" :key="provider.key" type="button" @click="addSource(provider)">
					<img :src="provider.icon" :alt="provider.type" />
					<span>{{ provider.name }}</span>
				</button>
			</div>
		</AppModal>
	</div>
</template>

<style scoped lang="scss">
	@use '../style.scss';

	.module-main-container {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 8px;
		height: calc(100vh - 36px - 20px - 50px);
		> div {
			@include glass-effect;
			border-radius: 12px;
			overflow: hidden;
		}
		.source-container {
			display: grid;
			grid-template-rows: 1fr 50px;
			.source-main-container {
				ul {
					position: relative;
					z-index: 2;
					padding: 10px;
					display: flex;
					flex-direction: column;
					gap: 6px;
					overflow-y: auto;
					height: 100%;
					li {
						> div {
							padding: 4px;
							display: flex;
							gap: 10px;
							align-items: center;
							border: 1px solid transparent;
							border-radius: 6px;
							transition:
								background-color 0.3s,
								border 0.3s,
								box-shadow 0.3s,
								backdrop-filter 0.3s;
							cursor: pointer;

							img {
								width: 30px;
								height: 30px;
								padding: 6px;
								@include glass-effect;
								border-radius: 6px;
								transition: all 0.2s;
							}
							&[data-selected='true'] {
								@include glass-effect;
								img {
									background-color: none;
									border: 1px solid transparent;
									box-shadow: none;
									backdrop-filter: none;
								}
							}
						}
					}
				}
			}
			.source-footer-container {
				padding: 0 12px;
				display: flex;
				gap: 4px;
				align-items: center;
				justify-content: flex-end;
				border-top: 1px solid #ffffff7e;
			}
		}
		.source-config-container {
			padding: 24px;
			overflow-y: auto;
			.source-config-header {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				gap: 16px;
				padding-bottom: 20px;
				border-bottom: 1px solid #ffffff7e;
				h2 {
					font-size: 18px;
					line-height: 1.2;
				}
				p {
					margin-top: 6px;
					color: #89909a;
					font-size: 12px;
				}
				img {
					width: 42px;
					height: 42px;
					padding: 8px;
					@include glass-effect;
					border-radius: 10px;
				}
			}
			.source-config-main {
				display: grid;
				gap: 14px;
				padding-top: 20px;
				label {
					display: grid;
					grid-template-columns: 80px 1fr;
					align-items: center;
					gap: 16px;
					font-size: 12px;
					span {
						text-align: right;
					}
				}
			}
			.source-config-footer {
				margin-top: 20px;
				text-align: right;
			}
		}
	}

	.provider-picker-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;

		button {
			display: grid;
			place-items: center;
			gap: 8px;
			padding: 14px 8px;
			border: 1px solid transparent;
			border-radius: 8px;
			background: #ffffff24;
			color: inherit;
			font: inherit;
			font-size: 12px;
			cursor: pointer;
			transition:
				background-color 0.2s,
				border-color 0.2s;

			&:hover {
				border-color: #ffffffb8;
				background: #ffffff52;
			}

			img {
				width: 34px;
				height: 34px;
				padding: 7px;
				@include glass-effect;
				border-radius: 8px;
			}
		}
	}
</style>
