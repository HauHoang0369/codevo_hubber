import axios from 'axios'
import config from '../../config/config'

export const TranslationService = {
    async getTraslations( systemLanguage, module, application, xTenant ) {
      const axiosConfig = {
        method: 'get',
        url: config.API_BASE_PATH + '/translationservice/v1/translations',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Tenant': xTenant ,
        },
        params: {
            systemLanguage: systemLanguage,
            module : module,
            application: application
        },
      }
  
      try {
            const res = await axios(axiosConfig)
            console.debug("getTraslations response", res)
            return res.data
      } catch (err) {
            console.error(err)
            return []
      }
    }

}