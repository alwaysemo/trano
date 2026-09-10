import { MotionPlugin } from '@vueuse/motion'
import { createApp } from 'vue'
import App from './Index.vue'
import '@assets/styles/base.scss'
import '@assets/styles/tailwind.css'
import { i18n, initializeLanguage } from '@i18n'

const app = createApp(App)
app.use(MotionPlugin)
app.use(i18n)

initializeLanguage().finally(() => app.mount('#app'))
