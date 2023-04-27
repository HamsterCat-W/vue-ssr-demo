import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

// 该模块的路径
const isTest = process.env.VITEST
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hrmProt
) {
  console.log('🚀 ~ file: server.js:11 ~ isProd:', isProd)
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = (p) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf8')
    : ''

  const manifest = isProd
    ? JSON.parse(
        fs.readFileSync(path.resolve('dist/client/ssr-manifest.json'), 'utf-8')
      )
    : {}

  const app = express()

  let vite
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      base: '/',
      root,
      logLevel: 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
        hrm: {
          port: hrmProt,
        },
      },
      appType: 'custom',
    })

    // 使用 vite 的 Connect 实例作为中间件
    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())

    // 生产环境下把 dist/client 映射为根路径，防止静态资源路由不匹配的问题
    app.use(
      '/',
      (await import('serve-static')).default(path.resolve('dist/client'), {
        index: false,
      })
    )
    // 这种方法是express自带的 app.use(express.static('dist/client'))
  }

  //   拦截所有的请求
  app.use('*', async (req, res, next) => {
    // 服务 index.html
    const url = req.originalUrl

    try {
      let render, template

      // 读取模版 index.html
      if (!isProd) {
        template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        )
        //   应用vite html转换 注入vite hmr客户端
        template = await vite.transformIndexHtml(url, template)
        // 加载服务器入口。vite.ssrLoadModule 将自动转换
        //  你的 ESM 源码使之可以在 Node.js 中运行！无需打包
        // 并提供类似 HMR 的根据情况随时失效。
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = indexProd
        render = (await import('./dist/server/entry-server.js')).render
      }

      // 渲染应用的 HTML。这假设 entry-server.js 导出的 `render`
      const [appHtml, preloadLinks] = await render(url, manifest)
      console.log('🚀 ~ file: server.js:55 ~ app.use ~ appHtml:', appHtml)
      //   替换
      const html = template
        .replace('<!--preload-links-->', preloadLinks)
        .replace('<!--app-html-->', appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (error) {
      console.log('🚀 ~ file: server.js: ~ app.use ~ error:', error)
      vite && vite.ssrFixStacktrace(error)
      res.status(500).end(error)
    }
  })

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) => {
    app.listen(3354, () => {
      console.log('http://localhost:3354')
    })
  })
}
