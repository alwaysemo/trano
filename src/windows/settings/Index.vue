<script setup lang="ts">
	// 设置页
	import { getCurrentWindow } from '@tauri-apps/api/window'
	import IconifyPower from '@iconify-vue/lucide/power'
	import IconifyMinus from '@iconify-vue/lucide/minus'
	import IconifyMinimize from '@iconify-vue/lucide/minimize'

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
				<ul v-motion-fade>
					<li>我的</li>
					<li>偏好设置</li>
					<li>快捷键设置</li>
					<li>翻译记录</li>
					<li>翻译源设置</li>
					<li>网络设置</li>
					<li>关于我们</li>
				</ul>
			</aside>
			<main class="main-container"></main>
		</section>
	</div>
</template>

<style lang="scss" scoped>
	.header-container {
		display: grid;
		grid-template-columns: 100px 1fr 100px;
		padding: 10px;
		border-bottom: 1px solid #eee;
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
			color: #b3b3b3;
			font-weight: 100;
		}
	}
	.section-container {
		display: grid;
		grid-template-columns: 180px 1fr;
		height: calc(100vh - 37px);
		.sidebar-container {
			ul {
				padding: 10px;
				li {
					padding: 16px 24px;
					border-radius: 12px;
					text-align: right;
					cursor: pointer;
					transition: background-color 0.3s;
					&:hover {
						background-color: #e3e6e8;
					}
				}
			}
		}
	}
</style>
