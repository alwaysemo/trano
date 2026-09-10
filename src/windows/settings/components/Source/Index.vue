<script setup lang="ts">
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()
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

		<div class="grid h-[calc(100vh-36px-62px-10px)] grid-cols-[160px_1fr] gap-6">
			<div class="trano-effect-glass rounded-lg">1</div>
			<div>2</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	/** */
</style>
