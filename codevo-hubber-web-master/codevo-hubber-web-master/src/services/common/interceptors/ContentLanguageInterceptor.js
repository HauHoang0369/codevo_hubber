import store from '@/store'

class ContentLanguageInterceptor {
  static request(config) {
    const user = store.getters.getUser
    const language = user.contentLanguage.isoCode
    config.params = config.params ?? {}
    if (!('contentLanguage' in config.params)) {
      config.params['contentLanguage'] = language
    }
    return config
  }

  static requestError(error) {
    return Promise.reject(error)
  }

  static response(response) {
    return response
  }

  static responseError(error) {
    return Promise.reject(error)
  }
}

export default ContentLanguageInterceptor
