import { MotionPlugin } from '@vueuse/motion'
import { createApp } from 'vue'
import App from './Index.vue'
import '@assets/styles/base.scss'
import '@assets/styles/tailwind.css'
import { i18n } from '@/i18n'

const app = createApp(App)
app.use(MotionPlugin)
app.use(i18n)
app.mount('#app')
