<script setup lang="ts">
	import { useI18n } from 'vue-i18n'
	import IconifySave from '@iconify-vue/lucide/save'

	const { t } = useI18n()
</script>

<template>
	<div>
		<div class="flex items-center justify-between pb-4.5">
			<div>
				<p class="text-xs font-thin text-gray-400">TRANO / NETWORK</p>
				<h1 class="mt-1 text-2xl font-bold leading-none">{{ t('settings.network') }}</h1>
			</div>
			<span
				class="relative flex items-center gap-1.25 rounded-[99px] border border-white/50 bg-white/25 py-1.25 pl-5 pr-2.25 text-[10px] text-amber-500 shadow-[inset_1px_1px_3px_white/45%] before:absolute before:left-2.5 before:top-1/2 before:h-1.25 before:w-1.25 before:-translate-y-1/2 before:rounded-full before:bg-amber-500 after:absolute after:left-2.5 after:top-1/2 after:h-1.25 after:w-1.25 after:-translate-y-1/2 after:animate-ping after:rounded-full after:bg-amber-500"
			>
			</span>
		</div>

		<div class="h-[calc(100vh-96px)]"></div>
		<div class="mb-6 flex items-center justify-end gap-1">
			<IconifySave class="h-3.5 w-3.5" />
			<span class="text-xs">{{ t('settings.autoSave') }}</span>
			<span>{{ t('settings.autoSave') }}</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
	/** */
</style>
