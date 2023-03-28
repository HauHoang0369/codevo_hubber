import store from '@/store'

class LoadingInterceptor {
  static request(config) {
    // Do something before request is sent
    if (config.headers.hasOwnProperty('Hubber-Hide-Loading') === false) {
      store.commit('setLoading', true)
    }
    return config
  }

  static requestError(error) {
    // Do something with request error
    if (error.config.headers.hasOwnProperty('Hubber-Hide-Loading') === false) {
      store.commit('setLoading', false)
    }
    return Promise.reject(error)
  }

  static response(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (
      response.config.headers.hasOwnProperty('Hubber-Hide-Loading') === false
    ) {
      store.commit('setLoading', false)
    }
    return response
  }

  static responseError(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.config.headers.hasOwnProperty('Hubber-Hide-Loading') === false) {
      store.commit('setLoading', false)
    }
    return Promise.reject(error)
  }
}

export default LoadingInterceptor
