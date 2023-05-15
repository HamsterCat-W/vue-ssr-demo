import { createI18n as _createI18n } from 'vue-i18n'
import { inBrowser } from '../utils'

import localeEn from './yaml/en.yaml'
import localeZh from './yaml/zh.yaml'

export const createI18n = (language = 'zh') => {
  return _createI18n({
    locale: inBrowser
      ? localStorage.getItem('locale') ||
        navigator.language.toLocaleLowerCase().split('-')[0] ||
        'zh'
      : language,
    legacy: false,
    messages: {
      en: localeEn,
      zh: localeZh,
    },
  })
}
