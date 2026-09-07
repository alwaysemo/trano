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
	.button-container {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		padding: 5px 10px;
		border: 1px solid #ffffff89;
		border-radius: 99px;
		background: #ffffff45;
		box-shadow: inset 1px 1px 3px #ffffff70;
		color: #147ffa;
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
