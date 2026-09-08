<script setup lang="ts">
	defineOptions({ inheritAttrs: false })

	withDefaults(
		defineProps<{
			type?: 'button' | 'submit' | 'reset'
			disabled?: boolean
		}>(),
		{
			type: 'button',
			disabled: false,
		},
	)
</script>

<template>
	<button class="button-container" :type="type" :disabled="disabled" v-bind="$attrs">
		<slot></slot>
	</button>
</template>

<style scoped lang="scss">
	@use '@assets/styles/variable.scss' as *;
	.button-container {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		padding: 5px 10px;
		border: $glass-border;
		border-radius: 99px;
		background: #ffffff45;
		box-shadow: inset 1px 1px 3px #ffffff70;
		color: #9d5efb;
		font-size: 10px;
		cursor: pointer;
		transition:
			background-color 0.2s,
			opacity 0.2s;

		&:hover {
			background: #ffffffab;
		}

		&:disabled {
			cursor: wait;
			opacity: 0.6;
		}

		:deep(.iconify) {
			width: 13px;
			height: 13px;
		}
	}
</style>
