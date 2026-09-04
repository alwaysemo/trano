<script setup lang="ts">
	// 设置页
	import { shallowRef } from 'vue'
	import { getCurrentWindow } from '@tauri-apps/api/window'
	import IconifyPower from '@iconify-vue/lucide/power'
	import IconifyMinus from '@iconify-vue/lucide/minus'
	import IconifyMinimize from '@iconify-vue/lucide/minimize'
	import IconifyUserRound from '@iconify-vue/lucide/user-round'
	import IconifyAstroid from '@iconify-vue/lucide/astroid'
	import IconifyClipboardList from '@iconify-vue/lucide/clipboard-list'
	import IconifyCloudCog from '@iconify-vue/lucide/cloud-cog'
	import IconifyKeyboard from '@iconify-vue/lucide/keyboard'
	import IconifyGlobe from '@iconify-vue/lucide/globe'
	import IconifyUsersRound from '@iconify-vue/lucide/users-round'
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

	const comped = shallowRef(Mine)
	const navbar = [
		{ name: '我的', comp: Mine, icon: IconifyUserRound },
		{ name: '偏好设置', comp: Preference, icon: IconifyAstroid },
		{ name: '翻译记录', comp: Record, icon: IconifyClipboardList },
		{ name: '翻译源设置', comp: Source, icon: IconifyCloudCog },
		{ name: '快捷键设置', comp: ShortcutKey, icon: IconifyKeyboard },
		{ name: '网络设置', comp: Network, icon: IconifyGlobe },
		{ name: '关于我们', comp: About, icon: IconifyUsersRound },
	]
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
						<component class="iconify" :is="item.icon" />
						<span>{{ item.name }}</span>
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
		.sidebar-container {
			position: relative;
			padding: 10px;
			z-index: 0;
			&::after {
				content: ' ';
				position: absolute;
				height: 200px;
				width: 200px;
				left: 50%;
				top: 10%;
				z-index: -1;
				transform: translateX(-100%);
				border-radius: 50%;
				border: 2px solid #ffffffa6;
				box-shadow: inset 10px 0px 20px #fff;
				background-image: linear-gradient(#f159ff, #4982ff);
				animation: ani 30s ease-in-out infinite;
				filter: blur(30px);
			}
			&::before {
				content: ' ';
				position: absolute;
				height: 130px;
				width: 130px;
				left: 50%;
				bottom: 0%;
				transform: translateX(-100%);
				background-image: linear-gradient(90deg, #ee2eff, #0756ff);
				border-radius: 50%;
				z-index: -1;
				border: 2px solid #ffffffa6;
				animation: ani 20s ease-in-out infinite;
				filter: blur(40px);
			}
			nav {
				overflow-y: auto;
				height: calc(100vh - 56px);
				div {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					gap: 4px;
					padding: 16px 24px;
					border-radius: 12px;
					font-weight: bold;
					border: 1px solid transparent;
					cursor: pointer;
					transition: all 0.3s;
					&:not(:last-child) {
						margin-bottom: 4px;
					}
					&:hover,
					&[data-selected='true'] {
						background-color: #ffffff1d;
						border: 1px solid #ffffff89;
						box-shadow: inset 4px 2px 8px #ffffff7e;
						backdrop-filter: blur(20px);
					}
					.iconify {
						width: 16px;
						height: 16px;
					}
				}
			}
		}
	}
	@keyframes ani {
		0% {
			transform: translate3d(0%, 0%, 0) scale(1);
		}
		20% {
			transform: translate3d(-65%, -45%, 0) scale(0.86);
		}
		42% {
			transform: translate3d(-105%, -10%, 0) scale(0.82);
		}
		63% {
			transform: translate3d(-75%, 60%, 0) scale(0.88);
		}
		82% {
			transform: translate3d(-35%, 40%, 0) scale(0.96);
		}
		100% {
			transform: translate3d(0%, 0%, 0) scale(1);
		}
	}
	.main-container {
		padding: 0 10px;
	}
</style>
