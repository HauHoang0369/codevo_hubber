import axios from 'axios'
import config from '../config/config'

export const LOGIN_TYPES = {
  INTERNAL: 'INTERNAL',
  PASSWORDLESS: 'PASSWORDLESS',
  LDAP: 'LDAP',
  SOCIAL: 'SOCIAL',
  UNREGISTERED: 'UNREGISTERED',
}

// todo: remove AuthSettings here, use XTenant in Service
export const AuthSettings = {
  XTenant: 'alagro-hubber-development',
}

export const AuthService = {
  /**
   * Get login type for the email
   * data = {email, XTenant}
   */
  async getLoginType(data) {
    const axiosConfig = {
      method: 'get',
      url: config.API_BASE_PATH + '/authenticator/v1/auth/loginType',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant': data.XTenant || AuthSettings.XTenant,
      },
      params: {
        email: data.email,
      },
    }

    try {
      const res = await axios(axiosConfig)
      return res.data.type
    } catch (err) {
      return null
    }
  },

  /**
   * get the content of the disclaimer
   */
  async getDisclaimerContent(systemLanguage, XTenant) {
    const axiosConfig = {
      method: 'get',
      url: config.API_BASE_PATH + '/authenticator/v1/auth/disclaimer',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant': XTenant || AuthSettings.XTenant,
      },
      params: {
        systemLanguage: systemLanguage || 'en',
      },
    }

    try {
      const res = await axios(axiosConfig)
      // console.log(res)
      return res.data.content
    } catch (err) {
      return null
    }
  },

  /**
   * get disclaimer clauses
   */
  async getDisclaimerClauses(systemLanguage, XTenant) {
    const axiosConfig = {
      method: 'get',
      url: config.API_BASE_PATH + '/authenticator/v1/auth/disclaimer/clauses',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant': XTenant || AuthSettings.XTenant,
      },
      params: {
        systemLanguage: systemLanguage || 'en',
      },
    }

    try {
      const res = await axios(axiosConfig)
      // console.log(res.data.clauses)
      return res.data.clauses
    } catch (err) {
      return null
    }
  },

  /**
   * register a new user
   * data = {firstName, lastName, email, password, market, acceptedClausesIds, refusedClausesIds, XTenant, systemLanguage}
   */
  async register(data) {
    return await axios({
      method: 'POST',
      url:
        config.API_BASE_PATH +
        '/authenticator/v1/auth/registration?systemLanguage=' +
        data.systemLanguage,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant': data.XTenant || AuthSettings.XTenant,
      },
      data: data,
    })
      .then((response) => {
        return {
          success: true,
          data: response.data,
        }
      })
      .catch(function (error) {
        return {
          success: false,
          data: null,
          error: error,
        }
      })
  },

  /**
   * login the user by email and password
   * data = {email, password, realm, XTenant}
   */
  async loginByPassword(data) {
    const params = new URLSearchParams()
    params.append('email', data.email)
    params.append('password', data.password)
    params.append('realm', data.realm)

    return await axios({
      method: 'POST',
      url: config.API_BASE_PATH + '/authenticator/v1/auth/login',
      headers: {
        'X-Tenant': data.XTenant || AuthSettings.XTenant,
      },
      data: params,
    })
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

  /**
   * init a passwordless login
   * data = {email, X-Tenant, systemLanguage}
   */
  async initPasswordlessLogin(data) {
    return await axios({
      method: 'POST',
      url:
        config.API_BASE_PATH +
        '/authenticator/v1/auth/login/passwordless/generate',
      headers: {
        'X-Tenant': data.XTenant || AuthSettings.XTenant,
      },
      params: {
        email: data.email,
        systemLanguage: data.systemLanguage || 'en',
      },
    })
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

  /**
   * passwordless login
   * data = {email, X-Tenant, systemLanguage}
   */
  async passwordlessLogin(data) {
    return await axios({
      method: 'POST',
      url: config.API_BASE_PATH + '/authenticator/v1/auth/login/passwordless',
      headers: {
        'X-Tenant': data.XTenant || AuthSettings.XTenant,
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    })
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
        console.error(error)
      })
  },

  /**
   * login the user as an anonymous user
   * data = {XTenant, marketLanguage}
   */
  async loginAnonymous(data) {
    return await axios({
      method: 'POST',
      data: data,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant': data.XTenant || AuthSettings.XTenant,
      },
      params: {
        systemLanguage: data.systemLanguage || 'en',
      },
      url:
        config.API_BASE_PATH +
        '/authenticator/v1/auth/login/anonymous?marketLanguage' +
        data.marketLanguage,
    })
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

  async refreshUser({ username, refreshToken }) {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('refresh_token', refreshToken)

    const axiosConfig = {
      method: 'post',
      url: config.API_BASE_PATH + '/authenticator/v1/auth/refresh',
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Tenant': AuthSettings.XTenant,
      },
      data: params,
    }

    try {
      const res = await axios(axiosConfig)
      return res.data;
    } catch (err) {
      return null
    }
  },
}
