<script setup lang="ts">
	defineOptions({ inheritAttrs: false })

	const model = defineModel({
		type: String,
		default: '',
	})
</script>

<template>
	<input v-model="model" class="trano-input" type="text" v-bind="$attrs" />
</template>

<style scoped lang="scss">
	@use '@assets/styles/variable.scss' as *;

	.trano-input {
		padding: 8px 10px;
		border-radius: 6px;
		color: inherit;
		font: inherit;
		font-size: 12px;
		@include glass-effect;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&::placeholder {
			color: currentColor;
			opacity: 0.5;
		}

		&:focus-visible {
			border: 1px solid $color-primary;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.6;
		}
	}
</style>
