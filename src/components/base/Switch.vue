<script setup lang="ts">
	defineOptions({ inheritAttrs: false })

	const model = defineModel({
		type: Boolean,
		default: false,
	})
</script>

<template>
	<label class="switch">
		<input v-model="model" type="checkbox" v-bind="$attrs" />
		<span class="slider"></span>
	</label>
</template>

<style scoped lang="scss">
	.switch {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 26px;
	}

	.switch input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(63deg, #aeb6c2 0%, #d6dbe3 58%, #97a7be 100%);
		background-size: 300% 300%;
		background-position: right center;
		transition: 0.5s cubic-bezier(0.24, 0.51, 0.32, 0.98);
		border-radius: 30px;
		box-shadow:
			inset 3px 3px 3px #ebf2fa6b,
			inset -4px -4px 4px #ebf2fa6b;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 18px;
		width: 18px;
		border-radius: 20px;
		left: 4px;
		top: 50%;
		margin-top: -9px;
		background: linear-gradient(127deg, #ffffff34 0%, #ffffff83 66%, #ffffff06 100%);
		background-size: 350% 250%;
		background-position: left center;
		box-shadow:
			3px 3px 4px #64748580,
			-3px -3px 4px #ebf2fa66;
		transition:
			background-size 0.4s cubic-bezier(0.7, 0.34, 0.5, 1),
			background-position 0.4s cubic-bezier(0.7, 0.34, 0.5, 1),
			box-shadow 0.4s cubic-bezier(0.7, 0.34, 0.5, 1);
	}

	.switch input:checked + .slider {
		background-image: linear-gradient(-90deg, #1effce 0%, #47c464 100%);
		background-position: left center;
		box-shadow:
			inset 3px 3px 3px #ffffff57,
			inset -4px -4px 4px #ffffffb5;
	}

	.switch input:checked + .slider:before {
		transform: translateX(24px) scale(1.15);
		background-size: 380% 300%;
		background-position: right;
		animation: bounce 0.4s ease;
	}

	.switch input:not(:checked) + .slider:before {
		animation: bounce-reverse 0.4s ease;
	}

	@keyframes bounce {
		0% {
			transform: translateX(0) scale(1);
		}
		50% {
			transform: translateX(27px) scaleX(0.8) scaleY(1.2);
		}
		75% {
			transform: translateX(23.2px) scaleX(1.1) scaleY(0.9);
		}
		100% {
			transform: translateX(24px) scale(1.15);
		}
	}

	@keyframes bounce-reverse {
		0% {
			transform: translateX(24px) scale(1.15);
		}
		50% {
			transform: translateX(-3px) scaleX(0.8) scaleY(1.2);
		}
		75% {
			transform: translateX(1.5px) scaleX(1.1) scaleY(0.9);
		}
		100% {
			transform: translateX(0) scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.slider,
		.slider:before {
			transition: none;
			animation: none !important;
		}
	}
</style>
