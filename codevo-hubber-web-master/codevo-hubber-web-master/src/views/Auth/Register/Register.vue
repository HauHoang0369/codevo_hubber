<template>
  <v-container id="register-form" class="rounded-xl bg-grey-lighten-4">
    <v-row class="text-center">
      <v-col class="text-center mb-10" cols="12">
        <h4 class="accenti-title">Completa la registrazione</h4>
      </v-col>
      <v-col cols="12">
        <div class="mx-auto">
          <CustomTextField label="Nome" v-model="name" />
        </div>
        <div class="mx-auto">
          <CustomTextField label="Congome" v-model="lastname" />
        </div>
        <div class="mx-auto">
          <CustomTextField label="Il tuo indirizzo email" v-model="email" />
        </div>
        <div class="mx-auto">
          <CustomTextField
            :isPasswordInput="true"
            label="Password"
            v-model="password"
          />
        </div>
        <div class="mx-auto">
          <CustomTextField
            :isPasswordInput="true"
            label="Conferma Password"
            v-model="confirm_password"
          />
        </div>
        <div class="mx-auto">
          <CustomSelect
            v-model="market"
            :items="availableMarkets"
            item-title="description"
            item-value="id"
            label="Market"
          />
        </div>
        <div class="mx-auto">
          <div v-for="(clause, index) in disclaimerClauses">
            <v-row>
              <v-col cols="3">
                <label class="switch">
                  <input
                    type="checkbox"
                    v-model="acceptedClausesIds"
                    :value="clause.id"
                  />
                  <span class="slider round"></span>
                </label>
              </v-col>
              <v-col cols="9" class="text-left">
                <p style="font-size: 9px">
                  {{ clause.content }}
                </p>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
      <v-col>
        <router-link to="/privacy">Privacy</router-link>
      </v-col>
      <v-col cols="12" align="center">
        <button class="btn btn-primary" @click="register()">Accedi</button>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomTextField from '@/components/base/inputs/CustomTextField.vue'
import CustomSelect from '@/components/base/inputs/CustomSelect.vue'
import CustomSwitch from '@/components/base/inputs/CustomSwitch.vue'
import CustomButton from '@/components/base/buttons/CustomButton.vue'

import config from '@/config/config'

import { AuthService } from '@/services/AuthService'
import { ProductService } from '@/services/ProductService'

export default {
  name: 'RegisterForm',
  components: {
    CustomTextField,
    CustomSelect,
    CustomSwitch,
    CustomButton,
  },
  props: {},
  data() {
    return {
      name: 'john',
      lastname: 'stavropoulos',
      email: this.$route.query.email,
      password: '123123123',
      confirm_password: '123123123',
      market: null, // 223
      systemLanguage: 'en',
      disclaimer: null,
      disclaimerClauses: [],
      availableMarkets: [],
      acceptedClausesIds: [],
      refusedClausesIds: [],
      isPasswordless: this.$route.query.passwordless ?? false,
      rules: {
        required: function (value) {
          return !!value || 'Required.'
        },
        email: function (value) {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        password: function (value) {
          //
        },
        market: function (value) {
          return value !== null
        },
      },
    }
  },
  async created() {
    this.disclaimerClauses = await AuthService.getDisclaimerClauses(
      this.systemLanguage
    )
    this.availableMarkets = await ProductService.getAvailableMarkets()

    console.log(this.disclaimerClauses)
  },
  methods: {
    async register() {
      var data = {
        firstName: this.name,
        lastName: this.lastname,
        email: this.email,
        // password: this.password,
        market: this.market,
        acceptedClausesIds: this.acceptedClausesIds,
        refusedClausesIds: this.refusedClausesIds,
        systemLanguage: 'en',
      }

      console.log(data)

      // return;

      const res = await AuthService.register(data)

      if (res.success === true) {
        //alert('registration completed successfully')
        this.$router.push({ name: 'Login' })
      } else {
        //alert('someting went wrong')
      }
    },
  },
}
</script>

<style type="text/css">
.font-small {
  font-size: 10px !important;
}
</style>
