<script setup lang="ts">
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()
</script>

<template>
	<div>
		<div class="module-header-container">
			<div>
				<p>TRANO / SHORTCUTKEY</p>
				<h1>{{ t('settings.shortcut') }}</h1>
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
	@use './style.scss';

	.module-main-container {
		height: calc(100vh - 36px - 20px - 40px);
	}
</style>
