import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { loadFonts } from './plugins/webfontloader'
import './resources/css/style.css'
import './resources/css/fonts.css'
import CKEditor from '@ckeditor/ckeditor5-vue'
import { I18nUtil } from './I18nUtil'
import config from './config/config'

loadFonts()

export const i18n = I18nUtil.setupI18n()

const router = setupRouter(i18n)

const app = createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(VueAxios, axios)
  .use(CKEditor)
  .use(i18n)


app.config.globalProperties.config = config

app.mount('#app')
