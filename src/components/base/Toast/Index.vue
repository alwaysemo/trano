<script setup lang="ts">
	import { onBeforeUnmount, onMounted, watch } from 'vue'
	import IconifyAlertCircle from '@iconify-vue/lucide/circle-alert'
	import IconifyCheckCircle from '@iconify-vue/lucide/circle-check'
	import IconifyInfo from '@iconify-vue/lucide/info'
	import IconifyX from '@iconify-vue/lucide/x'
	import { toast } from '@components/base/Toast/toast'

	const timers = new Map<number, ReturnType<typeof setTimeout>>()

	function startTimer(id: number, duration: number) {
		if (duration <= 0) return
		timers.set(
			id,
			setTimeout(() => {
				toast.remove(id)
				timers.delete(id)
			}, duration),
		)
	}

	function dismiss(id: number) {
		const timer = timers.get(id)
		if (timer) clearTimeout(timer)
		timers.delete(id)
		toast.remove(id)
	}

	onMounted(() => {
		watch(
			() => toast.items.map((item) => item.id),
			() =>
				toast.items.forEach((item) => {
					if (!timers.has(item.id)) startTimer(item.id, item.duration)
				}),
			{ immediate: true },
		)
	})
	onBeforeUnmount(() => timers.forEach((timer) => clearTimeout(timer)))
</script>

<template>
	<Teleport to="body">
		<div class="toast-region" aria-live="polite" aria-atomic="false">
			<TransitionGroup name="toast" tag="div" class="toast-list">
				<div v-for="item in toast.items" :key="item.id" class="toast-item" :data-type="item.type" role="status">
					<IconifyCheckCircle v-if="item.type === 'success'" class="toast-icon" />
					<IconifyAlertCircle v-else-if="item.type === 'error' || item.type === 'warning'" class="toast-icon" />
					<IconifyInfo v-else class="toast-icon" />
					<span class="toast-message">{{ item.message }}</span>
					<button class="toast-close" type="button" aria-label="关闭提示" @click="dismiss(item.id)">
						<IconifyX />
					</button>
					<span
						v-if="item.duration > 0"
						class="toast-progress"
						:style="{ animationDuration: `${item.duration}ms` }"
					></span>
				</div>
			</TransitionGroup>
		</div>
	</Teleport>
</template>

<style scoped lang="scss">
	.toast-region {
		position: fixed;
		z-index: 1000;
		top: 50px;
		left: 50%;
		width: min(360px, calc(100vw - 28px));
		pointer-events: none;
		transform: translateX(-50%);
	}

	.toast-list {
		display: grid;
		gap: 8px;
	}

	.toast-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 50px;
		padding: 10px 12px;
		overflow: hidden;
		color: #272b32;
		font-size: 12px;
		line-height: 1.2;
		background: #ffffff5c;
		border: 1px solid #ffffff9c;
		border-radius: 10px;
		box-shadow:
			inset 4px 2px 9px #ffffff80,
			0 7px 18px #6474852b;
		backdrop-filter: blur(16px) saturate(125%);
		pointer-events: auto;
	}

	.toast-item[data-type='success'] .toast-icon {
		color: #38a958;
	}
	.toast-item[data-type='error'] .toast-icon {
		color: #df4d4d;
	}
	.toast-item[data-type='warning'] .toast-icon {
		color: #c58918;
	}
	.toast-item[data-type='info'] .toast-icon {
		color: #397fd1;
	}

	.toast-icon {
		flex: 0 0 auto;
		width: 18px;
		height: 18px;
	}

	.toast-message {
		flex: 1;
		min-width: 0;
		word-break: break-word;
	}

	.toast-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		width: 22px;
		height: 22px;
		padding: 0;
		color: #59616d;
		background: transparent;
		border-radius: 50%;
		cursor: pointer;
	}

	.toast-close :deep(svg) {
		width: 14px;
		height: 14px;
	}

	.toast-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 1px;
		width: 100%;
		background-color: #59616d;
		opacity: 0.45;
		transform-origin: left;
		animation: toast-progress linear forwards;
	}

	.toast-enter-active,
	.toast-leave-active {
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}
	.toast-enter-from,
	.toast-leave-to {
		opacity: 0;
		transform: translateY(-10px) scale(0.96);
	}
	.toast-move {
		transition: transform 0.3s ease;
	}

	@keyframes toast-progress {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.toast-enter-active,
		.toast-leave-active,
		.toast-move {
			transition: none;
		}
		.toast-progress {
			animation: none;
		}
	}
</style>
