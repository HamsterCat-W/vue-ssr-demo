import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'node:path'

import VueI18n from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, 'src/locale/yaml/**')],
    }),
  ],
  ssr: {
    noExternal: [
      // this package has uncompiled .vue files
      // 'example-external-component'
      /vue-i18n/,
    ],
  },
})
