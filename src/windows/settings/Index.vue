<script setup lang="ts">
	import { getCurrentWindow } from '@tauri-apps/api/window'
	import { Icon } from '@iconify/vue'

	const appWindow = getCurrentWindow()

	const startDrag = async (event: MouseEvent) => {
		if (event.button !== 0) return
		await appWindow.startDragging()
	}

	const minimize = async () => {
		await appWindow.minimize()
	}

	const toggleMaximize = async () => {
		await appWindow.toggleMaximize()
	}

	const close = async () => {
		await appWindow.close()
	}
</script>

<template>
	<header class="titlebar-container" @mousedown="startDrag">
		<div>
			<Icon icon="icon-park-outline:window-minimize" />
			111
		</div>
		<div class="window-controls">
			<button type="button" title="最小化" @mousedown.stop @click="minimize">
				<Icon icon="icon-park-outline:minus" />
			</button>
			<button type="button" title="最大化" @mousedown.stop @click="toggleMaximize">
				<Icon icon="icon-park-outline:full-screen-one" />
			</button>
			<button type="button" title="关闭" @mousedown.stop @click="close">
				<Icon icon="icon-park-outline:close" />
			</button>
		</div>
	</header>
</template>

<style lang="scss" scoped>
	/**
 * 标题栏
 */
</style>
