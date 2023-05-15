import App from './App.vue'
import { createSSRApp } from 'vue'
import { createRouter } from './router'
import './style.css'
import { createI18n } from './locale'

export const createApp = () => {
  const app = createSSRApp(App)
  const router = createRouter()
  const i18n = createI18n()
  app.use(router)
  app.use(i18n)

  //   暴露 app 实例
  return { app, router }
}
