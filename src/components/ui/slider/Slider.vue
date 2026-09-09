<script setup lang="ts">
	import type { SliderRootProps } from 'reka-ui'
	import type { HTMLAttributes } from 'vue'
	import { computed } from 'vue'
	import { reactiveOmit } from '@vueuse/core'
	import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from 'reka-ui'
	import { cn } from '@/lib/utils'

	type SliderProps = Omit<SliderRootProps, 'modelValue'> & {
		modelValue?: number | number[]
		class?: HTMLAttributes['class']
	}

	const props = defineProps<SliderProps>()
	const emits = defineEmits<{
		'update:modelValue': [payload: number | number[] | undefined]
		valueCommit: [payload: number[]]
	}>()

	const delegatedProps = reactiveOmit(props, 'class', 'modelValue')
	const normalizedModelValue = computed(() =>
		props.modelValue == null ? undefined : Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue],
	)

	const forwarded = useForwardPropsEmits(delegatedProps, emits)

	function handleModelValueUpdate(value: number[] | undefined) {
		if (Array.isArray(props.modelValue)) {
			emits('update:modelValue', value)
			return
		}

		emits('update:modelValue', value?.[0])
	}
</script>

<template>
	<SliderRoot
		v-slot="{ modelValue }"
		data-slot="slider"
		:data-vertical="props.orientation === 'vertical' ? '' : undefined"
		:class="
			cn(
				'data-vertical:min-h-40 relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col',
				props.class,
			)
		"
		v-bind="forwarded"
		:model-value="normalizedModelValue"
		@update:model-value="handleModelValueUpdate"
	>
		<SliderTrack
			data-slot="slider-track"
			:data-horizontal="props.orientation !== 'vertical' ? '' : undefined"
			:data-vertical="props.orientation === 'vertical' ? '' : undefined"
			class="bg-muted rounded-4xl data-horizontal:h-3 data-vertical:w-3 relative grow overflow-hidden data-horizontal:w-full data-vertical:h-full"
		>
			<SliderRange
				data-slot="slider-range"
				:data-horizontal="props.orientation !== 'vertical' ? '' : undefined"
				:data-vertical="props.orientation === 'vertical' ? '' : undefined"
				class="bg-primary absolute select-none data-horizontal:h-full data-vertical:w-full"
			/>
		</SliderTrack>

		<SliderThumb
			v-for="(_, key) in Array.isArray(modelValue) ? modelValue : [modelValue]"
			:key="key"
			data-slot="slider-thumb"
			:data-vertical="props.orientation === 'vertical' ? '' : undefined"
			class="border-primary ring-ring/50 size-4 rounded-4xl border bg-white shadow-sm transition-colors hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50"
		/>
	</SliderRoot>
</template>
