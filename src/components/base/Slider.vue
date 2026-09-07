<script setup lang="ts">
	import { computed, ref, useAttrs } from 'vue'

	defineOptions({ inheritAttrs: false })

	const props = defineProps({
		valueTemplate: {
			type: String,
			default: '{value}',
		},
		formatValue: Function,
	})
	const attrs = useAttrs()
	const model = defineModel({
		type: Number,
		default: 0,
	})
	const isValueVisible = ref(false)
	const progress = computed(() => {
		const min = Number(attrs.min ?? 0)
		const max = Number(attrs.max ?? 100)
		const range = max - min

		if (!Number.isFinite(range) || range <= 0) return 0

		return Math.min(100, Math.max(0, ((model.value - min) / range) * 100))
	})
	const formattedValue = computed(() => {
		const formatter = props.formatValue
		if (formatter) return formatter(model.value)

		return props.valueTemplate
			.replace('{value}', String(model.value))
			.replace('{percent}', `${Math.round(progress.value)}%`)
	})
	const sliderStyle = computed(() => ({
		'--slider-progress': `${progress.value}%`,
		'--slider-progress-ratio': progress.value / 100,
	}))
</script>

<template>
	<div class="slider-container" :class="{ active: isValueVisible }" :style="sliderStyle">
		<div class="slider-value" aria-hidden="true">
			<slot name="value" :value="model" :percent="progress">
				{{ formattedValue }}
			</slot>
		</div>
		<input
			v-bind="$attrs"
			v-model.number="model"
			class="slider"
			type="range"
			@blur="isValueVisible = false"
			@focus="isValueVisible = true"
			@pointercancel="isValueVisible = false"
			@pointerdown="isValueVisible = true"
			@pointerup="isValueVisible = false"
		/>
	</div>
</template>

<style scoped lang="scss">
	.slider-container {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		min-width: 160px;
	}

	.slider-value {
		position: absolute;
		z-index: 1;
		top: -26px;
		left: calc(8px + (100% - 18px) * var(--slider-progress-ratio));
		padding: 4px 8px;
		color: inherit;
		font-size: 10px;
		line-height: 1;
		white-space: nowrap;
		background: #ffffff1d;
		border: 1px solid #ffffff89;
		border-radius: 8px;
		box-shadow:
			inset 4px 2px 8px #ffffff7e,
			2px 3px 6px #0e274140;
		backdrop-filter: blur(20px);
		opacity: 0;
		transform: translateX(-50%) translateY(4px) scale(0.9);
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
		pointer-events: none;
	}

	.slider-container.active .slider-value {
		opacity: 1;
		transform: translateX(-50%) translateY(0) scale(1);
	}

	.slider {
		width: 100%;
		height: 18px;
		padding: 0;
		margin: 0;
		appearance: none;
		background: transparent;
		cursor: pointer;
	}

	.slider::-webkit-slider-runnable-track {
		height: 8px;
		background: linear-gradient(
			90deg,
			#34ca7a 0%,
			#a2dba8 calc(var(--slider-progress) - 10px),
			#ced4e1 calc(var(--slider-progress) + 10px),
			#bac2d3 100%
		);
		border: 1px solid #ffffff89;
		border-radius: 4px;
		box-shadow:
			inset 1px 1px 1px #ebf2fa6b,
			inset -2px -2px 2px #ebf2fa6b;
	}

	.slider::-webkit-slider-thumb {
		width: 18px;
		height: 18px;
		margin-top: -6px;
		appearance: none;
		background: linear-gradient(180deg, #ffffff5c 0%, #ffffff6c 66%, #ffffff00 100%);
		border: 0;
		backdrop-filter: blur(20px);
		border-radius: 20px;
		box-shadow:
			1px 1px 2px #64748535,
			-1px -1px 2px #fcfdff4a;
		transition: transform 0.3s ease;
	}

	.slider:hover::-webkit-slider-thumb {
		transform: scale(1.2);
	}
</style>
