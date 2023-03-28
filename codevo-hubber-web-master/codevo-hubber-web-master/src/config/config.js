
import {version} from '../../package'

export default {
  // TODO: Rename to BASE_URL
  API_BASE_PATH: process.env.VUE_APP_API_BASE_PATH,
  API_PATH: process.env.VUE_APP_API_PATH ?? '', // path can be added such as /api/v1
  USE_BOGUS_DATA: process.env.VUE_APP_API_USE_BOGUS_DATA ?? false,
  CUSTOMER_NAME:process.env.VUE_APP_CUSTOMER_DISPLAY_NAME,
  APP_ALIAS: process.env.VUE_APP_PORTAL_ALIAS,
  APP_VERSION: version,
  CUSTOMER_FOOTER: process.env.VUE_APP_CUSTOMER_FOOTER_INFO
}
