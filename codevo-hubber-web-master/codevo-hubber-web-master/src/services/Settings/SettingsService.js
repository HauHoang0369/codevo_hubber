import { Service } from '@/services/Service'
import AuthInterceptor from '@/services/common/interceptors/AuthInterceptor'
import ContentLanguageInterceptor from '@/services/common/interceptors/ContentLanguageInterceptor'

function SettingsService() {
  const { client, useInterceptor } = new Service()

  client.defaults.baseURL += '/socialservice/v1/users'

  useInterceptor(AuthInterceptor)
  useInterceptor(ContentLanguageInterceptor)

  const getUser = async (userId) => {
    try {
      let config = { ...client.defaults }
      let response = await client.get(userId, config)
      return response.data
    } catch (error) {
      console.error('Error fetching available user', error)
    }
  }
  const getAvailableLanguage = async () => {
    try {
      let config = { ...client.defaults }
      let response = await client.get('/language', config)
      console.debug("getAvailableLanguage response", response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching available user language', error)
    }
  }

  const getAvailableMarket = async () => {
    try {
      let config = { ...client.defaults }
      let response = await client.get('/market', config)
      console.debug("getAvailableMarket response", response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching available user market', error)
    }
  }

  const updateMarket = async (market) => {
    try {
      let config = { ...client.defaults }
      let response = await client.put('/market', market, config)
      console.debug("updateMarket response", response.data)
      return response.data
    } catch (error) {
      console.error('Error updating user market ', error)
    }
  }

  const updateContentLanguage = async (contentLanguage) => {
    try {
      let config = { ...client.defaults }
      let response = await client.put('/contentlanguage', contentLanguage, config)
      console.debug("updateContentLanguage response", response.data)
      return response.data
    } catch (error) {
      console.error('Error updating user content language ', error)
    }
  }

  const updateSystemLanguage = async (systemLanguage) => {
    try {
      let config = { ...client.defaults }
      let response = await client.put('/systemlanguage', systemLanguage, config)
      console.debug("updateSystemLanguage response", response.data)
      return response.data
    } catch (error) {
      console.error('Error updating user system language', error)
    }
  }

  return {
    getUser,
    getAvailableLanguage,
    getAvailableMarket,
    updateMarket,
    updateContentLanguage,
    updateSystemLanguage
  }
}

export default SettingsService
