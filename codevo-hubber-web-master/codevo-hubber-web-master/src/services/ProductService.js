import axios from 'axios'
import config from '../config/config'
import { AuthSettings } from './AuthService'

export const ProductService = {
  async getAvailableMarkets(XTenant, marketScopeList) {
    const axiosConfig = {
      method: 'get',
      url: config.API_BASE_PATH + '/productservice/v1/markets/generic/light',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant': XTenant || AuthSettings.XTenant,
      },
      params: {
        marketScopeList: marketScopeList || [],
      },
    }

    try {
      const res = await axios(axiosConfig)
      console.log(res)
      return res.data
    } catch (err) {
      return []
    }
  },

  async getSolutions(
    accessToken,
    XLegacyToken,
    XTenant,
    marketId,
    contentLanguage,
    pageable
  ) {
    const axiosConfig = {
      method: 'get',
      url: config.API_BASE_PATH + '/productservice/v1/solutions',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant': XTenant || AuthSettings.XTenant,
        Authorization: accessToken,
        'X-LegacyToken': XLegacyToken,
      },
      params: {
        market: marketId,
        contentLanguage: contentLanguage,
        // pageable: pageable || PageableSettings,
      },
    }
    return await axios(axiosConfig)
      .then((response) => {
        return {
          success: true,
          data: response.data,
        }
      })
      .catch(function (error) {
        return {
          success: false,
          error: error,
        }
      })
  },
}
