import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import { TranslationService } from './services/Translation/TranslationService'
import store from './store';

const loaded_languages = []

export const I18nUtil = {
  setupI18n() {
    console.debug('Setup I18n Module')
    const options = {
      legacy: false,
      globalInjection: true,
      locale: store.state?.user?.systemLanguage?.isoCode || 'en',
      fallbackLocale: 'en',
      messages: {},
    }
    const i18n = createI18n(options)
    this.setI18nLanguage(i18n.global, options.locale)
    console.debug('Setup I18n completed')
    return i18n
  },

  setI18nLanguage(i18n, locale) {
    //load languages if needed'
    this.loadLocaleMessages(i18n, locale)
      .then(() => {
        console.debug('set locale ', locale)
        i18n.locale.value = locale

        console.debug('set html locale ', locale)
        document.querySelector('html').setAttribute('lang', locale)
      })
  },

  async loadLocaleMessages(i18n, locale) {
    //load languages if needed
    if (!loaded_languages.includes(locale)) {
      console.debug('load translations from ws ', locale)
      const language = locale.split('-')[0]
      const messages = await TranslationService.getTraslations(language)

      for (const prop in messages) {
        console.debug('set locale and locale message for language ', prop)
        i18n.setLocaleMessage(prop, messages[prop])
        loaded_languages.push(prop)
      }
    }
    return nextTick()
  },
}
