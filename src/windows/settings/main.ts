import { MotionPlugin } from '@vueuse/motion'
import { createApp } from 'vue'
import App from './Index.vue'
import '@assets/styles/base.scss'
import '@assets/styles/tailwind.css'
import { i18n, initializeLanguage } from '@/i18n'

const app = createApp(App)
app.use(MotionPlugin, {
	directives: {
		'hover-scale': {
			initial: { scale: 1 },
			hovered: { scale: 1.05 },
			tapped: { scale: 0.9 },
		},
		'animation-elastic': {
			initial: { scale: 1 },
			enter: {
				scale: [1, 1.4, 0.8, 1.2, 0.8, 1],
				transition: {
					duration: 1000,
					repeat: Infinity,
					repeatDelay: 2000,
					ease: 'easeInOut',
				},
			},
		},
		'init-move-fade': {
			initial: { opacity: 0, y: 100 },
			visible: { opacity: 1, y: 0, transition: { delay: 300 } },
		},
	},
})
app.use(i18n)

initializeLanguage().finally(() => app.mount('#app'))
