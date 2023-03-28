<script setup>
import {inject} from "vue"
import CustomPopup from "@/components/Popup/CustomPopup.vue"
import ButtonPrimaryDesktop from "@/components/base/inputs/ButtonPrimaryDesktop.vue"
import TextButton from "@/components/base/buttons/TextButton.vue"

const showDialog = inject('clientMessageSentDialog')
const emit = defineEmits(['callback'])


const onPopupCallback = async (value) => {
  console.log('onPopupCallback: ' + value)
  emit('callback', value)
}

const onPopupClose = async () => {
  emit('callback', -1)
}

const onBackToDetails = async () => {
  emit('callback', 1)
}

const onBackToDashboard = async () => {
  emit('callback', 2)
}

</script>

<template>
  <CustomPopup v-on:callback="onPopupCallback" v-on:close="onPopupClose" :show="showDialog">
    <template v-slot:title>
      {{$t('THANKS_TO_ASK_VIEW_TILE')}} {{ config.CUSTOMER_NAME }}.
    </template>
    <template v-slot:content>
      <div class="d-flex flex-column align-center w-100">
        <div class="text">
          {{$t('THANKS_TO_ASK_VIEW_BODY')}}
        </div>

        <div class="buttons d-flex flex-column align-center w-100">
          <ButtonPrimaryDesktop @click="onBackToDetails">
            {{$t('BACK_TO_PRODUCT_DETAIL')}}
          </ButtonPrimaryDesktop>
          <TextButton class="back-to-dashboard-button w-auto" v-on:click="onBackToDashboard">
            {{$t('BACK_TO_DASHBOARD')}}
          </TextButton>
        </div>
      </div>
    </template>
  </CustomPopup>
</template>
<style scoped>
.buttons{
  margin-top: 48px;
}

.text {
  margin: 0px 14px 0;
  font-family: Ubuntu;
  font-size: 20px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: var(--text);
}

.back-to-dashboard-button {
  margin-top: 12px;
}

</style>
