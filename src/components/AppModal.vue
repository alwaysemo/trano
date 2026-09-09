<script setup lang="ts">
	import { computed, nextTick, onBeforeUnmount, watch } from 'vue'
	import { modal } from '@/composables/modal'
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
	} from '@components/ui/dialog'
	import { Button } from '@components/ui/button'

	const emit = defineEmits<{ 'update:modelValue': [value: boolean]; 'close': [] }>()
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

	const serviceMode = computed(() => props.modelValue === undefined)
	const visible = computed(() => (serviceMode.value ? modal.state.item !== null : props.modelValue === true))
	const title = computed(() => (serviceMode.value ? modal.state.item?.title : props.title) ?? '')
	const content = computed(() => (serviceMode.value ? modal.state.item?.content : ''))
	const closable = computed(() => (serviceMode.value ? (modal.state.item?.closable ?? true) : props.closable))

	function close() {
		if (serviceMode.value) modal.close()
		else {
			emit('update:modelValue', false)
			emit('close')
		}
	}

	function confirm() {
		if (serviceMode.value) modal.close(true)
	}

	function handleOpenChange(open: boolean) {
		if (!open && visible.value) close()
	}

	watch(
		visible,
		async (isVisible) => {
			if (isVisible) {
				await nextTick()
				document.body.style.overflow = 'hidden'
			} else document.body.style.removeProperty('overflow')
		},
		{ immediate: true },
	)

	onBeforeUnmount(() => document.body.style.removeProperty('overflow'))
</script>

<template>
	<Dialog :open="visible" @update:open="handleOpenChange">
		<DialogContent :show-close-button="closable" :style="{ maxWidth: props.width }">
			<DialogHeader v-if="title">
				<DialogTitle>{{ title }}</DialogTitle>
				<DialogDescription v-if="serviceMode">{{ content }}</DialogDescription>
			</DialogHeader>
			<div v-if="!serviceMode"><slot /></div>
			<DialogFooter v-if="serviceMode || $slots.footer">
				<template v-if="serviceMode">
					<Button v-if="modal.state.item?.showCancel" variant="outline" @click="close">{{
						modal.state.item.cancelText
					}}</Button>
					<Button @click="confirm">{{ modal.state.item?.confirmText }}</Button>
				</template>
				<slot v-else name="footer" />
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
