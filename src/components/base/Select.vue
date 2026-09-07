<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

	defineOptions({ inheritAttrs: false })

	const props = defineProps<{
		options: { label: string; value: string }[]
	}>()

	const model = defineModel({
		type: String,
		default: '',
	})

	const root = ref<HTMLElement | null>(null)
	const isOpen = ref(false)
	const activeIndex = ref(-1)
	const selectedOption = computed(() => props.options.find((option) => option.value === model.value))

	function toggle() {
		isOpen.value = !isOpen.value
		if (isOpen.value) {
			activeIndex.value = Math.max(
				0,
				props.options.findIndex((option) => option.value === model.value),
			)
		}
	}

	function selectOption(value: string) {
		model.value = value
		isOpen.value = false
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen.value = false
			return
		}

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			if (!isOpen.value) {
				toggle()
			} else if (activeIndex.value >= 0) {
				selectOption(props.options[activeIndex.value].value)
			}
			return
		}

		if (!isOpen.value || !props.options.length) return

		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault()
			const direction = event.key === 'ArrowDown' ? 1 : -1
			activeIndex.value = (activeIndex.value + direction + props.options.length) % props.options.length
		}
	}

	function handleOutsidePointerdown(event: PointerEvent) {
		if (root.value && !root.value.contains(event.target as Node)) {
			isOpen.value = false
		}
	}

	onMounted(() => document.addEventListener('pointerdown', handleOutsidePointerdown))
	onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutsidePointerdown))
</script>

<template>
	<div ref="root" class="select">
		<button
			class="select-trigger"
			type="button"
			aria-haspopup="listbox"
			:aria-expanded="isOpen"
			v-bind="$attrs"
			@blur="activeIndex = -1"
			@click="toggle"
			@keydown="handleKeydown"
		>
			<span>{{ selectedOption?.label ?? props.options[0]?.label }}</span>
			<i aria-hidden="true" :class="{ open: isOpen }"></i>
		</button>

		<Transition name="dropdown">
			<ul v-if="isOpen" class="select-menu" role="listbox">
				<li
					v-for="(option, index) in props.options"
					:key="option.value"
					:class="{ selected: option.value === model, active: index === activeIndex }"
					role="option"
					:aria-selected="option.value === model"
					@click="selectOption(option.value)"
				>
					{{ option.label }}
				</li>
			</ul>
		</Transition>
	</div>
</template>

<style scoped lang="scss">
	.select {
		position: relative;
		display: inline-flex;
		align-items: center;
		min-width: 112px;
	}

	.select-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		min-width: 120px;
		padding: 8px 10px;
		color: inherit;
		font: inherit;
		font-size: 12px;
		text-align: left;
		border-radius: 7px;
		outline: none;
		background-color: #ffffff1d;
		border: 1px solid #ffffff89;
		box-shadow: inset 4px 2px 8px #ffffff7e;
		backdrop-filter: blur(10px);
		cursor: pointer;
	}

	.select-trigger:focus-visible {
		outline: 1px solid #1479ff;
		outline-offset: 1px;
	}

	.select-trigger i {
		width: 7px;
		height: 7px;
		margin-left: 12px;
		border-right: 1.5px solid currentColor;
		border-bottom: 1.5px solid currentColor;
		transform: translateY(-2px) rotate(45deg);
		transition: transform 0.2s ease;
	}

	.select-trigger i.open {
		transform: translateY(2px) rotate(225deg);
	}

	.select-menu {
		position: absolute;
		z-index: 10;
		left: 0;
		top: calc(100% + 6px);
		display: grid;
		gap: 4px;
		width: 100%;
		padding: 4px;
		margin: 0;
		list-style: none;
		background-color: #ffffff1d;
		border: 1px solid #ffffff89;
		box-shadow: inset 4px 2px 8px #ffffff7e;
		backdrop-filter: blur(100px);
		border-radius: 8px;
	}

	.select-menu li {
		padding: 8px;
		border-radius: 5px;
		font-size: 12px;
		cursor: pointer;
	}

	.select-menu li:hover,
	.select-menu li.active,
	.select-menu li.selected {
		background: #ffffff91;
		backdrop-filter: blur(10px);
	}

	.select-menu li.selected {
		color: #47c464;
		font-weight: 600;
	}

	.dropdown-enter-active,
	.dropdown-leave-active {
		transition:
			opacity 0.16s ease,
			transform 0.16s ease;
	}

	.dropdown-enter-from,
	.dropdown-leave-to {
		opacity: 0;
		transform: translateY(-10px);
	}
</style>
