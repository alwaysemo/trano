<script setup lang="ts">
	import { useI18n } from 'vue-i18n'
	import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
	import { createSwapy, type SlotItemMapArray, type Swapy, type SwapEvent } from 'swapy'
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
			name: 'Bing翻译',
			icon: SvgBing,
			hint: '内置翻译源 - 无需配置',
			options: [{ name: '名称', key: 'name', type: 'input', placeholder: '请输入翻译源名称' }],
		},
		{
			key: '2',
			type: 'Google',
			name: 'Google翻译',
			icon: SvgGoogle,
			hint: '内置翻译源 - 无需配置',
			options: [{ name: '名称', key: 'name', type: 'input', placeholder: '请输入翻译源名称' }],
		},
		{
			key: '3',
			type: 'Baidu',
			name: 'Baidu翻译',
			icon: SvgBaidu,
			options: [
				{ name: '名称', key: 'name', type: 'input', placeholder: '请输入翻译源名称' },
				{ name: 'AppID', key: 'appid', type: 'input', placeholder: '请输入AppId' },
				{ name: 'AppKey', key: 'appkey', type: 'input', placeholder: '请输入AppKey' },
			],
		},
	])

	const selected = ref<Source>(list.value[0])
	const values = reactive<Record<string, Record<string, string>>>({
		Bing: { name: 'Bing翻译' },
		Google: { name: 'Google翻译' },
		Baidu: { name: 'Baidu翻译', appid: '', appkey: '' },
	})
	const selectedValues = computed(() => values[selected.value.type])

	const selectSource = (source: Source) => {
		selected.value = source
	}
</script>

<template>
	<div>
		<div class="module-header-container">
			<div>
				<p>TRANO / SOURCE</p>
				<h1>{{ t('settings.source') }}</h1>
			</div>
			<span class="status-mark" data-status="warning">已保存</span>
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
					<BaseButton>
						<IconifyMinus class="iconify" />
					</BaseButton>
					<BaseButton>
						<IconifyPlus class="iconify" />
					</BaseButton>
				</div>
			</div>
			<div class="source-config-container">
				<div class="source-config-header">
					<div>
						<h2>{{ selected.name }}</h2>
						<p>{{ selected.hint ?? '自定义翻译源 - 请完成配置' }}</p>
					</div>
					<img :src="selected.icon" :alt="selected.type" />
				</div>
				<div class="source-options-container">
					<label v-for="item in selected.options" :key="item.key">
						<span>{{ item.name }}</span>
						<BaseInput
							v-if="item.type === 'input'"
							v-model="selectedValues[item.key]"
							:placeholder="item.placeholder"
						/>
					</label>

					<div>
						<BaseButton>验证</BaseButton>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use '@assets/styles/variable.scss' as *;
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
				padding: 10px;
				ul {
					position: relative;
					z-index: 2;
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
			.source-options-container {
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
		}
	}
</style>
