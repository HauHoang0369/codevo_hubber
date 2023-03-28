import config from '@/config/config'
import { AuthSettings } from '@/services/AuthService'
import axios from 'axios'
import AuthInterceptor from '@/services/common/interceptors/AuthInterceptor'
import LoadingInterceptor from '@/services/common/interceptors/LoadingInterceptor'
import ContentLanguageInterceptor from '@/services/common/interceptors/ContentLanguageInterceptor'

let instance = null

class MarketService {
  client

  constructor() {
    if (!instance) {
      instance = this
    }
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant': AuthSettings.XTenant,
      },
      timeout: 60000,
      baseURL: config.API_BASE_PATH + config.API_PATH + '/socialservice/',
    }
    this.client = axios.create(axiosConfig)
    this.client.interceptors.request.use(
      AuthInterceptor.request,
      AuthInterceptor.requestError
    )
    this.client.interceptors.response.use(
      AuthInterceptor.response,
      AuthInterceptor.responseError
    )

    this.client.interceptors.request.use(
      LoadingInterceptor.request,
      LoadingInterceptor.requestError
    )
    this.client.interceptors.response.use(
      LoadingInterceptor.response,
      LoadingInterceptor.responseError
    )

    this.client.interceptors.request.use(
      ContentLanguageInterceptor.request,
      ContentLanguageInterceptor.requestError
    )
    this.client.interceptors.response.use(
      ContentLanguageInterceptor.response,
      ContentLanguageInterceptor.responseError
    )

    return instance
  }

  async getMarkets(legacyToken) {
    let config = { ...this.client.defaults }
    config.headers['X-LegacyToken'] = legacyToken

    let response = await this.client.get('v1/users/market')
    return response.data
  }
}

export default MarketService
