import { MotionPlugin } from '@vueuse/motion'
import { createApp } from 'vue'
import App from './Index.vue'
import '@assets/styles/base.scss'

const app = createApp(App)
app.use(MotionPlugin)
app.mount('#app')
