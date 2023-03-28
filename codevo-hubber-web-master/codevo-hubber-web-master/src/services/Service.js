import config from '@/config/config'
import axios from 'axios'

export const XTenant = 'valagro-hubber-development'

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Tenant': XTenant,
  },
  timeout: 60000,
  baseURL: config.API_BASE_PATH + config.API_PATH,
  // baseURL should be updated at child service
}

export function Service() {
  const client = axios.create(axiosConfig)

  function useInterceptor(interceptor) {
    client.interceptors.request.use(
      interceptor.request,
      interceptor.requestError
    )
    client.interceptors.response.use(
      interceptor.response,
      interceptor.responseError
    )
  }

  return {
    client,
    useInterceptor,
  }
}
