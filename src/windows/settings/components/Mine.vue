<script setup lang="ts">
	import { useI18n } from 'vue-i18n'
	import IconifySave from '@iconify-vue/lucide/save'

	const { t } = useI18n()
</script>

<template>
	<div>
		<div class="module-header-container">
			<div>
				<p>TRANO / MINE</p>
				<h1>{{ t('settings.my') }}</h1>
			</div>
			<span class="status-mark" data-status="warning"> </span>
		</div>

		<div class="module-main-container"></div>
		<div class="module-footer-container">
			<IconifySave class="iconify" />
			<span>{{ t('settings.autoSave') }}</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use '@assets/styles/variable.scss' as *;
	@use './style.scss';

	.module-main-container {
		height: calc(100vh - 36px - 20px - 40px);
	}
</style>
