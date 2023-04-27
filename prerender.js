// 预渲染
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getAbsoluteFilePath = (filePath) => path.resolve(__dirname, filePath)

const manifest = JSON.parse(
  fs.readFileSync(getAbsoluteFilePath('dist/client/ssr-manifest.json'), 'utf-8')
)

const template = fs.readFileSync(
  getAbsoluteFilePath('dist/client/index.html'),
  'utf-8'
)

const { render } = await import('./dist/server/entry-server.js')

const routersToPreRender = fs
  .readdirSync(getAbsoluteFilePath('src/pages'))
  .map((file) => {
    const name = file.replace(/\.vue$/, '').toLowerCase()
    return name === 'home' ? '/' : `/${name}`
  })

console.log(
  '🚀 ~ file: prerender.js:20 ~ routersToPreRender ~ routersToPreRender:',
  routersToPreRender
)
;(async () => {
  // pre-render each route...
  for (const url of routersToPreRender) {
    const [appHtml, preloadLinks] = await render(url, manifest)

    const html = template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, appHtml)

    const filePath = `dist/static${url === '/' ? '/index' : url}.html`
    fs.writeFileSync(getAbsoluteFilePath(filePath), html)
    console.log('pre-rendered:', filePath)
  }

  // done, delete ssr manifest
  //   fs.unlinkSync(getAbsoluteFilePath('dist/static/ssr-manifest.json'))
})()
