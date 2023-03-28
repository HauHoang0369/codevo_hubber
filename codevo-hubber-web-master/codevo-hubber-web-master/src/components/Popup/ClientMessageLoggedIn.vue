<script setup>
// TODO ask returns 500
import {inject, ref} from "vue";
import CustomPopup from "@/components/Popup/CustomPopup.vue";
import CustomTextArea from "@/components/base/inputs/CustomTextArea.vue";
import ButtonPrimaryDesktop from "@/components/base/inputs/ButtonPrimaryDesktop.vue";
import Validators from "@/components/base/inputs/validators";
import AppService from "@/services/App/AppService";

const showDialog = inject('clientMessageLoggedInDialog')
const emit = defineEmits(['callback'])


const form = ref(null)
const valid = ref(true)

const formData = ref({
  message: null,
})
const onPopupCallback = async (value) => {
  console.log('onPopupCallback: ' + value)
  emit('callback', value)
}

const onPopupClose = async () => {
  emit('callback', -1)
}

const onSendMessage = async () => {
  console.log("SEND MESSAGE")
  try {
    let isValid = await form.value.validate()
    if (isValid.valid === true) {
      console.log("VALIDATED")
      let formSendData = {...(formData.value)}
      console.log(formSendData)
      let ask = await new AppService().service.ask({
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
  <CustomPopup v-on:callback="onPopupCallback" v-on:close="onPopupClose()" :show="showDialog">
    <template v-slot:title>
      {{$t('ASK_TO')}} {{ config.CUSTOMER_NAME }} {{$t('ASK_TO_MORE_PRODUCT_INFORMATION')}}.
    </template>
    <template v-slot:content>
      <div class="d-flex flex-column align-center w-100 content-area">
        <v-form v-model="valid" ref="form" lazy-validation class="w-100">
          <CustomTextArea
            label="Lascia un messaggio"
            v-model="formData.message"
            class="w-100"
            style="grid-column: span 2;margin-top: 10px"
            :rules="[Validators.required]"
          />
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
  margin-top: 48px;
}

.content-area {
  margin-top: 28px;
}

</style>
