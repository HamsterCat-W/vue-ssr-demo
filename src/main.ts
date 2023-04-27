import App from './App.vue'
import { createSSRApp } from 'vue'
import { createRouter } from './router'
import './style.css'

export const createApp = () => {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)

  //   暴露 app 实例
  return { app, router }
}
