<template>
  <v-container id="login-form" class="rounded-xl bg-grey-lighten-4">
    <v-row class="text-center" justify="center" align="center">
      <v-col cols="12">
        <HubberLogo></HubberLogo>
        <h4 class="accenti-title">{{ $t('LOGIN_PANEL_LOGIN_CAPTION') }}</h4>
      </v-col>
      <v-col cols="12">
        <CustomTextField label="Il tuo indirizzo email" v-model="email" />
        <CustomTextField
          :isPasswordInput="true"
          v-if="showPasswordInput"
          label="Password"
          v-model="password"
        />
      </v-col>
      <v-col cols="12" align="center">
        <button
          class="btn btn-primary"
          @click="login"
          :disabled="!this.emailIsValid()"
        >
          Accedi
        </button>
      </v-col>
      <v-col cols="12">
        <span class="continua-senza-regis" @click="anonymousLogin">
          {{ $t('LOGIN_PANEL_ANONYMOUS_LOGIN_CAPTION') }}
        </span>
      </v-col>
      <v-col cols="12"> {{ $t('LOGIN_PANEL_OR_CAPTION') }} </v-col>
      <v-col cols="12" align="center">
        <SocialButton
          type="facebook"
          :title="$t('LOGIN_PANEL_FACEBOK_LOGIN_CAPTION')"
          textColor="var(--social-fb)"
          @click="socialLogin('facebook')"
        />
        <SocialButton
          type="google"
          :title="$t('LOGIN_PANEL_GOOGLE_LOGIN_CAPTION')"
          textColor="var(--black)"
          @click="socialLogin('google')"
        />
        <SocialButton
          type="linkedin"
          :title="$t('LOGIN_PANEL_LINKEDIN_LOGIN_CAPTION')"
          textColor="var(--social-lin)"
          @click="socialLogin('linkedin')"
        />
      </v-col>
    </v-row>
    <Popup ref="popup" />
    <v-row>
      <v-col cols="12" align="center">
        {{ config.APP_VERSION }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import HubberLogo from '@/components/base/Logo/HubberLogo.vue'
import CustomTextField from '@/components/base/inputs/CustomTextField.vue'
// import CustomButton from '@/components/base/buttons/CustomButton.vue'
import SocialButton from '@/components/base/buttons/SocialButton.vue'
import Popup from '@/components/Popup/Popup.vue'
import { mapMutations } from 'vuex'
import config from '@/config/config'
import { AuthService, LOGIN_TYPES } from '@/services/AuthService'
import { I18nUtil } from '@/I18nUtil'

export default {
  name: 'LoginForm',
  components: {
    HubberLogo,
    CustomTextField,
    // CustomButton,
    SocialButton,
    Popup,
  },
  props: {},
  data() {
    return {
      email: '',
      password: '',
      realm: 'valagro',
      loginType: null,
      isPasswordless: false,
      username: this.$route.query.username ?? null,
      uuid: this.$route.query.p ?? null,
      rules: {
        required: function (value) {
          return !!value || 'Required.'
        },
        email: function (value) {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        // password: function (value) {
        //   //
        // },
      },
    }
  },
  computed: {
    showPasswordInput() {
      return (
        this.emailIsValid() &&
        (this.loginType == LOGIN_TYPES.INTERNAL ||
          this.loginType == LOGIN_TYPES.LDAP)
      )
    },
  },
  async mounted() {
    I18nUtil.setI18nLanguage(this.$i18n, this.getBrowserLanguage())
    /***********************
     * Passwordless auth.
     * This happens when a passwordless login is already initialised
     * and the user clicks on the link via the email message
     * ********************/
    if (this.username && this.uuid) {
      //('passwordless login found')
      const res = await AuthService.passwordlessLogin({
        email: this.username,
        password: this.uuid,
      })

      if (res.success == true) {
        this.loginUser(res.data)
      } else {
        this.$refs.popup.open('Error', 'Something went wrong')
      }
    }
  },
  methods: {
    ...mapMutations(['loginUser', 'setLoading']),

    getBrowserLanguage() {
      if ('language' in navigator) {
        console.log('Browser languange detected ', navigator.language)
        return navigator.language
      } else {
        console.log(
          'Undefined browser languange use default ',
          navigator.language
        )
        return 'en'
      }
    },

    test() {
      const axiosConfig = {
        method: 'get',
        url: config.API_BASE_PATH + '/authenticator/v1/auth/loginType',
        params: {
          email: this.email,
          realm: this.realm,
        },
      }

      this.axios(axiosConfig)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    async login() {
      // if there is no login type set yet, get the login type
      if (this.loginType == null) {
        this.loginType = await AuthService.getLoginType({
          email: this.email,
        })
      }

      /***********************
       * Unregistered
       * ********************/
      if (this.loginType == LOGIN_TYPES.UNREGISTERED) {
        this.$router.push({
          name: 'Register',
          query: { email: this.email, passwordless: this.isPasswordless },
        })
      }

      /***********************
       * Auth with password (Internal or LDAP)
       * ********************/
      // if we already have the login type and is internal or ldap
      if (
        this.password != null &&
        (this.loginType == LOGIN_TYPES.INTERNAL ||
          this.loginType == LOGIN_TYPES.LDAP)
      ) {
        //this.$refs.popup.open(
        //  'login..',
        //  ''
        //)
        // alert('log in..')

        this.setLoading(true)
        const res = await AuthService.loginByPassword({
          email: this.email,
          password: this.password,
          realm: this.realm,
        })
        this.setLoading(false)

        if (res.success == true) {
          this.loginUser(res.data)
          this.$router.push({ name: 'Dashboard' })
        } else {
          console.error(res.error)
        }
      }

      /***********************
       * Passwordless Auth
       * ********************/
      if (this.loginType == LOGIN_TYPES.PASSWORDLESS) {
        const res = await AuthService.passwordlessLogin({
          email: this.email,
          systemLanguage: 'en',
        })

        if (res.success == true) {
          this.$refs.popup.open(
            'Controlla la tua casella email e clicca sul link che trovi al suo interno per accedere a Hubber',
            'Ti abbiamo inviato una email di conferma per accedere al tuo account. Controlla la tua email e clicca sul link per confermare la tua registrazione.'
          )
        } else {
          this.$refs.popup.open('Error', 'Something went wrong')
        }
      }

      /***********************
       * Social
       * ********************/
      if (this.loginType == LOGIN_TYPES.SOCIAL) {
        this.$refs.popup.open('Error', 'The auth mode is SOCIAL')
      }
    },

    async anonymousLogin() {
      const res = await AuthService.loginAnonymous({
        systemLanguage: 'en',
      })

      if (res.success == true) {
        this.loginUser(res.data)
        this.$router.push({ name: 'Dashboard' })
      } else {
        console.error(res.error)
      }

      //('Anonymous login')
    },

    // async socialLogin(provider) {
    //   //alert(provider + ' social login')
    // },

    emailIsValid() {
      return this.rules.email(this.email) == true
    },
  },
  watch: {
    // email: function (value) {
    //   this.loginType = null
    //   //
    // },
  },
}
</script>

<style type="text/css"></style>
