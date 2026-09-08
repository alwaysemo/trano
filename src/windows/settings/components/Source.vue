<script setup lang="ts">
	import { useI18n } from 'vue-i18n'
	import { ref } from 'vue'
	import IconifyMinus from '@iconify-vue/lucide/minus'
	import IconifyPlus from '@iconify-vue/lucide/plus'
	import Button from '@components/base/Button.vue'
	import SvgBing from '@assets/svg/bing.svg'
	import SvgGoogle from '@assets/svg/googlefanyi.svg'

	const { t } = useI18n()

	const list = ref([
		{
			type: 'Bing',
			name: 'Bing翻译',
			icon: SvgBing,
			hint: '内置翻译源 - 无需配置',
		},
		{
			type: 'Google',
			name: 'Google翻译',
			icon: SvgGoogle,
			hint: '内置翻译源 - 无需配置',
		},
	])
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
					<ul>
						<li v-for="item in list" :key="item.name">
							<img :src="item.icon" :alt="item.type" />
							<span>{{ item.name }}</span>
						</li>
					</ul>
				</div>
				<div class="source-footer-container">
					<Button>
						<IconifyMinus class="iconify" />
					</Button>
					<Button>
						<IconifyPlus class="iconify" />
					</Button>
				</div>
			</div>
			<div></div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use '@assets/styles/variable.scss' as *;
	@use './style.scss';

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
					display: grid;
					gap: 6px;
					overflow-y: auto;
					li {
						padding: 4px;
						display: flex;
						gap: 10px;
						align-items: center;
						border: 1px solid transparent;
						transition: all 0.3s;
						cursor: pointer;
						border-radius: 6px;
						&:hover {
							@include glass-effect;
							img {
								background-color: none;
								border: 1px solid transparent;
								box-shadow: none;
								backdrop-filter: none;
							}
						}
						img {
							width: 30px;
							height: 30px;
							padding: 6px;
							@include glass-effect;
							border-radius: 6px;
							transition: all 0.3s;
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
	}
</style>
