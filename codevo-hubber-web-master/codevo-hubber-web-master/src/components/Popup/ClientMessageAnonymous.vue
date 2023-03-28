<script setup>
// TODO askAnonymous returns 500
import {inject, onMounted, ref, watch} from "vue";
import CustomPopup from "@/components/Popup/CustomPopup.vue";
import ButtonPrimaryDesktop from "@/components/base/inputs/ButtonPrimaryDesktop.vue";
import CustomTextArea from '@/components/base/inputs/CustomTextArea.vue'
import CustomTextField from '@/components/base/inputs/CustomTextField.vue'
import Grid from '@/components/base/Grid/Grid'
import CustomSwitch from '@/components/base/inputs/CustomSwitch'
import CustomSelect from '@/components/base/inputs/CustomSelect'
import ProductService from "@/services/Product/ProductService";
import Validators from "@/components/base/inputs/validators";
import AppService from "@/services/App/AppService";
import AppRestV1Service from "@/services/App/AppRestV1Service";

const showDialog = inject('clientMessageAnonymousDialog')
const emit = defineEmits(['callback'])

const formData = ref({
  firstName: null,
  lastName: null,
  message: null,
  email: null,
  market: null,
  privacy: false,
})
const privacy = ref(false)

const countries = ref([])

const form = ref(null)
const valid = ref(true)

onMounted(async () => {
  console.log("onMounted")
  loadCountries()
})

const loadCountries = async (hideLoader) => {
  console.log("loadCountries")
  try {
    console.log("loadingmarkets")
    let markets = await new ProductService().service.getAvailableMarkets({
      hideLoader: hideLoader,
    });
    countries.value = markets
  } catch (e) {
    console.log("error loading markets")
    console.log(e)
  }
}

// watch(formData.value, (newValue, oldValue) => {
//   console.log(newValue, oldValue);
// });

const onPopupCallback = async (value) => {
  console.log('onPopupCallback: ' + value)
  emit('callback', value)
}

const onPopupClose = async () => {
  await onPopupCallback(-1)
}

const onSendMessage = async () => {
  console.log("SEND MESSAGE")
  try {
    let isValid = await form.value.validate()
    if (isValid.valid === true) {
      console.log("VALIDATED")
      let formSendData = {...formData.value}
      formSendData.market = formData.value?.market?.id ?? null;
      let ask = await new AppService().service.askAnonymous({
        form: formSendData,
        hideLoader: false,
      });
      console.log("ASK VALUE")
      console.log(ask)
      // TODO: Return value must be checked if success close popup
      await onPopupCallback(1)
    } else {
      // TODO: Show error?
    }
  } catch (e) {
    console.log("SEND MESSAGE ERROR")
    console.log(e)
  }
}
</script>

<template>
  <CustomPopup v-on:callback="onPopupCallback" v-on:close="onPopupClose(-1)" :show="showDialog">
    <template v-slot:title>
      {{$t('ASK_TO')}} {{ config.CUSTOMER_NAME }} {{$t('ASK_TO_MORE_PRODUCT_INFORMATION')}}.
    </template>
    <template v-slot:content>
      <div class="d-flex flex-column align-center w-100 content-area">

        <v-form v-model="valid" ref="form" lazy-validation>
          <Grid xl="2" lg="2" md="1" sm="1" :column-gap="20" :row-gap="0"
                class="">
            <CustomTextField label="Nome*" v-model="formData.firstName" :rules="[Validators.required]"/>
            <CustomTextField label="Cognome*" v-model="formData.lastName" :rules="[Validators.required]"/>
            <CustomTextField label="Il tuo indirizzo email" v-model="formData.email" :rules="[Validators.email]"/>
            <CustomSelect
              v-model="formData.market"
              return-object
              :items="countries"
              item-title="description"
              item-value="id"
              label="Paese*"
              :rules="[Validators.required]"
            />
            <CustomTextArea
              label="Lascia un messaggio"
              v-model="formData.message"
              class="w-100"
              style="grid-column: span 2;margin-top: 10px"
              :rules="[Validators.required]"
            />
            <div class="d-flex flex-row align-center" style="grid-column: span 2; margin-top: 20px">
              <CustomSwitch
                v-model="privacy"
                :rules="[Validators.selected]"
              >
              </CustomSwitch>
              <div class="flex-grow-1">
                {{$t('READ_AND_ACCEPT_TERMS_AND_CONDITIONS')}}.
              </div>
            </div>
          </Grid>
        </v-form>
        <div class="buttons">
          <ButtonPrimaryDesktop @click="onSendMessage">
            {{$t('SEND_MESSAGE')}}
          </ButtonPrimaryDesktop>
        </div>
      </div>
    </template>
  </CustomPopup>
</template>
<style scoped>
.buttons {
  margin-top: 61px;
}
</style>
