<script setup lang="ts">
	// 设置页
	import { computed, shallowRef } from 'vue'
	import { useI18n } from 'vue-i18n'
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
	import Mine from './components/Mine/Index.vue'
	import Preference from './components/Preference/Index.vue'
	import ShortcutKey from './components/ShortcutKey/Index.vue'
	import Record from './components/Record/Index.vue'
	import Source from './components/Source/Index.vue'
	import Network from './components/Network/Index.vue'
	import About from './components/About/Index.vue'

	const { t } = useI18n()

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
	const navbar = computed(() => [
		{ name: t('settings.my'), comp: Mine, icon: IconifyUserRound },
		{ name: t('settings.preference'), comp: Preference, icon: IconifyAstroid },
		{ name: t('settings.record'), comp: Record, icon: IconifyClipboardList },
		{ name: t('settings.source'), comp: Source, icon: IconifyCloudCog },
		{ name: t('settings.shortcut'), comp: ShortcutKey, icon: IconifyKeyboard },
		{ name: t('settings.network'), comp: Network, icon: IconifyGlobe },
		{ name: t('settings.about'), comp: About, icon: IconifyUsersRound },
	])

	const selectedNavIndex = computed(() => navbar.value.findIndex((item) => item.comp === comped.value))
</script>

<template>
	<div>
		<header class="grid cursor-default grid-cols-[100px_1fr_100px] p-2.5" @mousedown.stop="drag">
			<div class="group flex gap-1">
				<button
					v-motion-pop-visible-once
					class="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-400"
					data-color="close"
					type="button"
					:title="t('settings.close')"
					@mousedown.stop
					@click="close"
				>
					<IconifyPower class="h-2.5 w-2.5 text-red-600 opacity-0 transition-opacity group-hover:opacity-100" />
				</button>
				<button
					v-motion-pop-visible-once
					class="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-amber-400"
					data-color="minimize"
					type="button"
					:title="t('settings.minimize')"
					@mousedown.stop
					@click="minimize"
				>
					<IconifyMinus class="h-2.5 w-2.5 text-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />
				</button>
				<button
					v-motion-pop-visible-once
					class="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-gray-300"
					type="button"
					:title="t('settings.maximize')"
				>
					<IconifyMinimize class="h-2.5 w-2.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
				</button>
			</div>
			<h1 class="text-center text-sm leading-none font-thin">Trano</h1>
			<div></div>
		</header>
		<section class="section-container grid grid-cols-[minmax(180px,max-content)_minmax(0,1fr)]">
			<aside class="sidebar-container p-2">
				<nav class="relative h-[calc(100vh-56px)] overflow-y-auto">
					<div
						class="trano-effect-glass pointer-events-none absolute inset-x-0 top-0 z-0 h-15 rounded-xl transition-transform duration-300 ease-in-out"
						:style="{ transform: `translateY(${selectedNavIndex * 60}px)` }"
					></div>
					<div
						v-for="(item, index) in navbar"
						:key="item.name"
						v-motion
						:initial="{ opacity: 0, y: 20 }"
						:enter="{ opacity: 1, y: 0, transition: { delay: (index + 2) * 100 } }"
						class="flex h-15 cursor-pointer items-center gap-2 px-3 font-bold"
						@click="comped = item.comp"
					>
						<component class="h-4 w-4" :is="item.icon" />
						<span class="text-md">{{ item.name }}</span>
					</div>
				</nav>
			</aside>
			<main class="px-2.5">
				<div>
					<component v-motion-slide-bottom :is="comped" />
				</div>
			</main>
		</section>
	</div>
	<ShadcnToaster />
</template>

<style scoped lang="scss">
	.section-container {
		display: grid;
		grid-template-columns: minmax(180px, max-content) minmax(0, 1fr);
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
</style>
