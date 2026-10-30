<script setup lang="ts">
	import type { Source } from './types'
	import { useI18n } from 'vue-i18n'
	import IconifyCheck from '@iconify-vue/lucide/check'
	import IconifyPlus from '@iconify-vue/lucide/plus'
	import IconifyLanguages from '@iconify-vue/lucide/languages'

	const { title, items, addedIds = [] } = defineProps<{ title: string; items: Source[]; addedIds?: string[] }>()
	const emit = defineEmits<{ pick: [item: Source] }>()
	const { t } = useI18n()

	function label(item: Source): string {
		return item.labelKey ? t(item.labelKey) : item.label
	}
</script>

<template>
	<section>
		<p class="px-1.5 text-[11px] font-semibold tracking-wide text-gray-500">{{ title }}</p>
		<ul class="mt-1 grid grid-cols-2 gap-0.5">
			<li v-for="item in items" :key="item.type">
				<button
					type="button"
					class="group flex w-full cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-white/60 disabled:cursor-default disabled:hover:bg-transparent"
					:disabled="addedIds.includes(item.type)"
					@click="emit('pick', item)"
				>
					<img
						v-if="item.icon"
						class="h-5 w-5 shrink-0 transition-opacity"
						:class="{ 'opacity-40': addedIds.includes(item.type) }"
						:src="item.icon"
						:alt="label(item)"
					/>
					<span v-else class="trano-effect-glass flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
						<IconifyLanguages class="h-3 w-3 text-gray-500" />
					</span>
					<span
						class="min-w-0 flex-1 truncate text-[13px] leading-tight"
						:class="addedIds.includes(item.type) ? 'text-gray-500' : ''"
					>
						{{ label(item) }}
					</span>
					<IconifyCheck v-if="addedIds.includes(item.type)" class="h-3.5 w-3.5 shrink-0 text-gray-400" />
					<IconifyPlus
						v-else
						class="h-3.5 w-3.5 shrink-0 text-gray-400 opacity-40 transition-opacity group-hover:opacity-100"
					/>
				</button>
			</li>
		</ul>
	</section>
</template>
