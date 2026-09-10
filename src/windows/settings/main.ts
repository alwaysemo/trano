import { MotionPlugin } from '@vueuse/motion'
import { createApp } from 'vue'
import App from './Index.vue'
import '@assets/styles/base.scss'
import '@assets/styles/tailwind.css'
import { i18n } from '@/i18n'
import { setLanguage } from './components/Preference/services/language'
import { loadPreferences } from './components/Preference/services/preferences'

const mountApp = () => {
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
	app.mount('#app')
}

void loadPreferences()
	.then((preferences) => setLanguage(preferences.language))
	.catch((error) => console.error('读取语言设置失败:', error))
	.finally(mountApp)
