<script setup lang="ts">
	import { reactive } from 'vue'
	import IconifyGlobe from '@iconify-vue/lucide/globe-2'
	import IconifyMonitor from '@iconify-vue/lucide/monitor'
	import IconifySparkles from '@iconify-vue/lucide/sparkles'
	import IconifySave from '@iconify-vue/lucide/save'

	const state = reactive({
		language: '跟随系统',
		launchAtLogin: true,
		autoUpdate: true,
		position: '屏幕右下角',
		fontSize: 16,
		smartTranslate: true,
	})

	const menus = [
		{
			title: '通用',
			description: '让 Trano 更贴合你的工作习惯',
			icon: IconifyGlobe,
			items: [
				{
					label: '界面语言',
					hint: '选择应用显示语言',
					type: 'select',
					key: 'language',
					options: ['跟随系统', '简体中文', 'English'],
				},
				{ label: '开机自启', hint: '登录后自动启动 Trano', type: 'switch', key: 'launchAtLogin' },
				{ label: '自动检查更新', hint: '及时获取新功能与稳定性修复', type: 'switch', key: 'autoUpdate' },
			],
		},
		{
			title: '翻译窗口',
			description: '调整结果出现时的节奏与位置',
			icon: IconifyMonitor,
			items: [
				{
					label: '显示位置',
					hint: '新窗口默认出现的位置',
					type: 'select',
					key: 'position',
					options: ['居中屏幕', '上一次位置', '跟隨鼠标'],
				},
				{ label: '字体大小', hint: '让译文更易读', type: 'range', key: 'fontSize' },
			],
		},
		{
			title: '智能体验',
			description: '让翻译变得更自然',
			icon: IconifySparkles,
			items: [{ label: '智能识别语言', hint: '自动判断翻译原文的语言', type: 'switch', key: 'smartTranslate' }],
		},
	]
</script>

<template>
	<div>
		<div class="module-header-container">
			<div>
				<p>TRANO / PREFERENCE</p>
				<h1>偏好设置</h1>
			</div>
			<span class="status-mark" :data-status="'danger'">已同步</span>
		</div>

		<div class="module-main-container">
			<section v-for="group in menus" :key="group.title">
				<div class="primary-container">
					<component :is="group.icon" class="iconify" />
					<div>
						<h3>{{ group.title }}</h3>
						<p>{{ group.description }}</p>
					</div>
				</div>
				<ul class="module-menus-container">
					<li v-for="item in group.items" :key="item.label">
						<div class="name-container">
							<strong>{{ item.label }}</strong>
							<span>{{ item.hint }}</span>
						</div>
						<div>1</div>
					</li>
				</ul>
			</section>
			<div class="module-footer-container">
				<IconifySave class="iconify" />
				<span>设置会自动保存</span>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use './style.scss';
</style>
