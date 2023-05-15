// 预渲染
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { mkdirp } from 'mkdirp'

const languageList = ['zh', 'en']

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
  for (const lang of languageList) {
    for (let url of routersToPreRender) {
      if (lang === 'en') {
        if (url === '/') {
          url = `${url}en`
        } else {
          url = `/en${url}`
        }
      }
      const [appHtml, preloadLinks] = await render(url, manifest, lang, true)

      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)
      const filePath = `dist/static${
        url === '/'
          ? '/index'
          : url === '/en'
          ? '/en/index'
          : url.replace('/products', '')
      }.html`

      mkdirp('dist/static/en').then(() => {
        fs.writeFileSync(getAbsoluteFilePath(filePath), html)
        console.log('pre-rendered:', filePath)
      })
    }
  }
})()
