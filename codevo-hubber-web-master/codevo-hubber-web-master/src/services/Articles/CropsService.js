import config from '@/config/config'
import { AuthSettings } from '@/services/AuthService'
import axios from 'axios'
import AuthInterceptor from '@/services/common/interceptors/AuthInterceptor'
import LoadingInterceptor from '@/services/common/interceptors/LoadingInterceptor'

let instance = null

class CropsService {
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
      baseURL: config.API_BASE_PATH + config.API_PATH + '/productservice/',
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
    return instance
  }

  async callCrops({
    legacyToken,
    marketId,
    contentLanguage,
    name,
    page,
    hideLoader,
  }) {
    let config = { ...this.client.defaults }
    config.headers['X-LegacyToken'] = legacyToken
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    config.params = {
      contentLanguage,
      marketId,
      page,
    }

    if (name) {
      config.params.name = name
    }
    let response = await this.client.get('v1/search/crop', config)
    return response.data
  }
}

export default CropsService
