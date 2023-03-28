// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

const MainTheme = {
  dark: false,

  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    primary: '#00604b',
    'grey-dark': '#a6acb5',
    grey: '#e2e4e7',
    orange: '#f0973a',
    rosso: '#ff516e',
    'background-blue': '#f7f9fd',
    'primary-dark': '#0a3d31',
    text: '#555454',
    'background-green': '#eaf5ef',
    ambra: '#ffdb72',
    celeste: '#699eff',
    'verde-acqua': '#00b899',
    lilla: '#a6a9ff',
    malva: '#bf81b4',
    'primary-70': '#4c9081',
    white: '#fff',
    'p-mic': '#b4458d',
    'p-bs': '#d50032',
    'p-ot': '#f1be48',
    'p-ff': '#249e6b',
    'p-bif': '#1d428a',
    'p-wsn': '#006a8e',
    black: '#000',
    'social-fb': '#3b5998',
    'p-bic': '#1be0b3',
    'social-lin': '#4875b4',
  },
}

export default createVuetify({
  icons: {
    iconfont: 'fmd',
  },
  theme: {
    defaultTheme: 'MainTheme',
    themes: {
      MainTheme,
    },
  },
})
