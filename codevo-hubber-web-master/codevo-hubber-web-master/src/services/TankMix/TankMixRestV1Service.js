import config from '@/config/config'
import { AuthSettings } from '@/services/AuthService'
import { PageableSettings } from '@/services/common/config'
import AuthInterceptor from '@/services/common/interceptors/AuthInterceptor'
import ContentLanguageInterceptor from '@/services/common/interceptors/ContentLanguageInterceptor'
import LoadingInterceptor from '@/services/common/interceptors/LoadingInterceptor'
import QueryParamsInterceptor from '@/services/common/interceptors/QueryParamsInterceptor'
import axios from 'axios'

let instance = null

class TankMixRestV1Service {
    client

    static accessToken
    static xLegacyToken

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
            baseURL: config.API_BASE_PATH + config.API_PATH,
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
            QueryParamsInterceptor.request,
            QueryParamsInterceptor.requestError
          )
          this.client.interceptors.response.use(
            QueryParamsInterceptor.response,
            QueryParamsInterceptor.responseError
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

    async getTankmixes({pageable}) {
        let config = { ...this.client.defaults }
        config.headers['Hubber-Hide-Loading'] = true
        let response = await this.client.get('tankmixservice/v1/mixes', config)
        config.params = {
            ...(pageable || PageableSettings),
          }
        return response.data
    }
}

export default TankMixRestV1Service
