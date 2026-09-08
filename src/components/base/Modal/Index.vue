<script setup lang="ts">
	import { computed, nextTick, onBeforeUnmount, watch } from 'vue'
	import { useI18n } from 'vue-i18n'
	import IconifyX from '@iconify-vue/lucide/x'
	import { modal } from '@components/base/Modal/modal'

	const { t } = useI18n()

	const emit = defineEmits<{
		'update:modelValue': [value: boolean]
		close: []
	}>()

	const props = withDefaults(
		defineProps<{
			modelValue?: boolean
			title?: string
			width?: string
			closable?: boolean
			maskClosable?: boolean
		}>(),
		{
			title: '',
			width: '420px',
			closable: true,
			maskClosable: true,
		},
	)

	const serviceItem = computed(() => modal.state.item)
	const serviceMode = computed(() => props.modelValue === undefined)
	const visible = computed(() => (serviceMode.value ? serviceItem.value !== null : props.modelValue))
	const currentTitle = computed(() => (serviceMode.value ? serviceItem.value?.title : props.title) ?? '')
	const currentWidth = computed(() => (serviceMode.value ? serviceItem.value?.width : props.width) ?? '420px')
	const currentClosable = computed(() => serviceMode.value ? serviceItem.value?.closable ?? true : props.closable)
	const currentMaskClosable = computed(() => serviceMode.value ? serviceItem.value?.maskClosable ?? true : props.maskClosable)

	function close() {
		if (serviceMode.value) {
			modal.close()
			return
		}
		emit('update:modelValue', false)
		emit('close')
	}

	function handleMaskClick() {
		if (currentMaskClosable.value) close()
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && visible.value && currentClosable.value) close()
	}

	function confirm() {
		if (serviceMode.value) modal.close(true)
	}

	watch(
		visible,
		async (visible) => {
			if (visible) {
				document.addEventListener('keydown', handleKeydown)
				await nextTick()
				document.body.style.overflow = 'hidden'
			} else {
				document.removeEventListener('keydown', handleKeydown)
				document.body.style.removeProperty('overflow')
			}
		},
		{ immediate: true },
	)

	onBeforeUnmount(() => {
		document.removeEventListener('keydown', handleKeydown)
		document.body.style.removeProperty('overflow')
	})
</script>

<template>
	<Teleport to="body">
		<Transition name="modal">
			<div v-if="visible" class="modal-overlay" @click.self="handleMaskClick">
				<section
					class="modal-container"
					role="dialog"
					aria-modal="true"
					:aria-label="currentTitle || undefined"
					:style="{ width: currentWidth }"
					v-motion-pop-visible
				>
					<header v-if="currentTitle || currentClosable" class="modal-header">
						<h2 v-if="currentTitle" class="modal-title">{{ currentTitle }}</h2>
						<button v-if="currentClosable" class="modal-close" type="button" :aria-label="t('common.closeDialog')" @click="close">
							<IconifyX class="iconify" />
						</button>
					</header>
					<div class="modal-content">
						<template v-if="serviceMode">{{ serviceItem?.content }}</template>
						<slot v-else></slot>
					</div>
					<footer v-if="serviceMode || $slots.footer" class="modal-footer">
						<template v-if="serviceMode">
							<BaseButton v-if="serviceItem?.showCancel" @click="close">
								{{ serviceItem.cancelText }}
							</BaseButton>
							<BaseButton @click="confirm">{{ serviceItem?.confirmText }}</BaseButton>
						</template>
						<slot v-else name="footer"></slot>
					</footer>
				</section>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
	@use '@assets/styles/variable.scss' as *;

	.modal-overlay {
		position: fixed;
		z-index: 1100;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		border-radius: 16px;
		backdrop-filter: blur(10px);
		background-color: #ffffff2f;
		.modal-container {
			border-radius: 12px;
			@include glass-effect;
			background-color: #ffffff6c;
			overflow: auto;
            box-shadow: 0 0 10px #66666649;
		}

		.modal-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 12px 16px;
			border-bottom: $glass-border;
			.modal-title {
				min-width: 0;
				font-size: 14px;
				line-height: 1.3;
			}
			.modal-close {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				flex: 0 0 auto;
				width: 24px;
				height: 24px;
				padding: 0;
				background-color: transparent;
				border: 1px solid transparent;
				border-radius: 50%;
				transition: all 0.3s;
				&:hover {
					@include glass-effect;
				}
				cursor: pointer;
			}
			.iconify {
				width: 16px;
				height: 16px;
			}
		}

		.modal-content {
			padding: 12px;
		}

		.modal-footer {
			display: flex;
			justify-content: flex-end;
			gap: 8px;
			padding: 0 18px 16px;
		}
	}

	.modal-enter-active,
	.modal-leave-active {
		transition: opacity 0.25s ease;
	}

	.modal-enter-active .modal-container,
	.modal-leave-active .modal-container {
		transition: transform 0.25s ease;
	}

	.modal-enter-from,
	.modal-leave-to {
		opacity: 0;
	}

	.modal-enter-from .modal-container,
	.modal-leave-to .modal-container {
		transform: translateY(-10px) scale(0.97);
	}

	@media (prefers-reduced-motion: reduce) {
		.modal-enter-active,
		.modal-leave-active,
		.modal-enter-active .modal-container,
		.modal-leave-active .modal-container {
			transition: none;
		}
	}
</style>
