<script setup lang="ts">
	import type { HTMLAttributes } from 'vue'
	import { useVModel } from '@vueuse/core'
	import { cn } from '@/lib/utils'

	const props = defineProps<{
		defaultValue?: string | number
		modelValue?: string | number
		class?: HTMLAttributes['class']
	}>()

	const emits = defineEmits<{
		(e: 'update:modelValue', payload: string | number): void
	}>()

	const modelValue = useVModel(props, 'modelValue', emits, {
		passive: true,
		defaultValue: props.defaultValue,
	})
</script>

<template>
	<input
		v-model="modelValue"
		data-slot="input"
		:class="
			cn(
				'border-primary bg-input/30 focus-visible:border-primary focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 file:text-foreground placeholder:text-muted-foreground h-9 w-full min-w-0 rounded-4xl border px-3 py-1 text-sm transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3',
				props.class,
			)
		"
	/>
</template>
