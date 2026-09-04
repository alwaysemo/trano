<script setup lang="ts">
	// 设置页
	import { ref } from 'vue'
	import { getCurrentWindow } from '@tauri-apps/api/window'
	import IconifyPower from '@iconify-vue/lucide/power'
	import IconifyMinus from '@iconify-vue/lucide/minus'
	import IconifyMinimize from '@iconify-vue/lucide/minimize'
	import Mine from './components/Mine.vue'
	import Preference from './components/Preference.vue'
	import ShortcutKey from './components/ShortcutKey.vue'
	import Record from './components/Record.vue'
	import Source from './components/Source.vue'
	import Network from './components/Network.vue'
	import About from './components/About.vue'

	const appWindow = getCurrentWindow()

	const drag = async (event = new MouseEvent('mousedown')) => {
		if (event.button !== 0) return
		await appWindow.startDragging()
	}

	const minimize = async () => {
		await appWindow.minimize()
	}

	const close = async () => {
		await appWindow.close()
	}

	const comped = ref(Mine)
	const navbar = ref([
		{ name: '我的', comp: Mine },
		{ name: '偏好设置', comp: Preference },
		{ name: '快捷键设置', comp: ShortcutKey },
		{ name: '翻译记录', comp: Record },
		{ name: '翻译源设置', comp: Source },
		{ name: '网络设置', comp: Network },
		{ name: '关于我们', comp: About },
	])
</script>

<template>
	<div>
		<header class="header-container" @mousedown.stop="drag">
			<div class="control-container">
				<button v-motion-pop-visible-once data-color="close" type="button" title="关闭" @mousedown.stop @click="close">
					<IconifyPower class="iconify" />
				</button>
				<button
					v-motion-pop-visible-once
					data-color="minimize"
					type="button"
					title="最小化"
					@mousedown.stop
					@click="minimize"
				>
					<IconifyMinus class="iconify" />
				</button>
				<button v-motion-pop-visible-once data-color="maximize" type="button" title="最大化">
					<IconifyMinimize class="iconify" />
				</button>
			</div>
			<h1 class="title-container">Trano</h1>
			<div></div>
		</header>
		<section class="section-container">
			<aside class="sidebar-container">
				<nav>
					<div
						v-for="(item, index) in navbar"
						:key="item.name"
						:data-selected="comped === item.comp"
						v-motion
						:initial="{ opacity: 0, y: 20 }"
						:enter="{ opacity: 1, y: 0, transition: { delay: (index + 2) * 100 } }"
						@click="comped = item.comp"
					>
						{{ item.name }}
					</div>
				</nav>
			</aside>
			<main class="main-container">
				<component v-motion-slide-bottom :is="comped" />
			</main>
		</section>
	</div>
</template>

<style lang="scss" scoped>
	.header-container {
		display: grid;
		grid-template-columns: 100px 1fr 100px;
		padding: 10px;
		cursor: default;
		.control-container {
			display: flex;
			gap: 4px;
			&:hover .iconify {
				opacity: 100%;
			}
			button {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 16px;
				width: 16px;
				cursor: pointer;
				border-radius: 50%;
				.iconify {
					height: 10px;
					width: 10px;
					opacity: 0;
					transition: opacity 0.3s;
				}
				&[data-color='close'] {
					background-color: #ff6060;
					.iconify {
						color: #d92109;
					}
				}
				&[data-color='minimize'] {
					background-color: #ffcd58;
					.iconify {
						color: #c48900;
					}
				}
				&[data-color='maximize'] {
					background-color: #dedede;
					.iconify {
						color: #b3b3b3;
					}
				}
			}
		}
		.title-container {
			font-size: 14px;
			line-height: 1;
			text-align: center;
			font-weight: 100;
		}
	}
	.section-container {
		display: grid;
		grid-template-columns: 180px 1fr;
		height: calc(100vh - 36px);
		.sidebar-container {
			nav {
				padding: 10px;
				div {
					padding: 16px 24px;
					border-radius: 12px;
					text-align: right;
					cursor: pointer;
					transition: background-color 0.3s;
					&:hover,
					&[data-selected='true'] {
						background-color: #ffffff65;
						backdrop-filter: blur(10px);
					}
				}
			}
		}
	}
</style>
