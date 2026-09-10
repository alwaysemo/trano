<script setup lang="ts">
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()
</script>

<template>
	<div>
		<div class="flex items-center justify-between pb-4.5">
			<div>
				<p class="text-xs font-thin text-gray-400">TRANO / MINE</p>
				<h1 class="mt-1 text-2xl font-bold leading-none">{{ t('settings.my') }}</h1>
			</div>
			<div
				class="flex items-center gap-2 rounded-[20px] trano-effect-glass py-1 px-2 leading-none"
				data-status="updated"
			>
				<em>~</em>
				<span class="text-[10px]">{{ t(`settings.updated`) }}</span>
			</div>
		</div>

		<div class="grid h-[calc(100vh-36px-62px)] gap-6 overflow-y-auto"></div>
	</div>
</template>

<style scoped lang="scss">
	/** */
</style>
