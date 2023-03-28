<script setup>
import CloseIcon from '@/assets/icons/icon-system-close2@2x.png'

import {onMounted, ref, watch} from "vue";

const emit = defineEmits(['close','popupCallback'])
const props = defineProps({
    show: Boolean,
  }
)
const showDialog = ref(false)
const onClose = async () => {
  // showDialog.value = false
  emit('close',-1)
}

watch(
  () => props.show,
  // eslint-disable-next-line no-unused-vars
  (newValue, oldValue) => {
    showDialog.value = newValue
  }
)


</script>

<template>
  <v-dialog
    v-model="showDialog"
    max-width="956px"
    v-on:click:outside="onClose"
  >
    <div class="dialog d-flex flex-column">
      <img class="close-button align-self-end" :src="CloseIcon" v-on:click.prevent="onClose"/>
      <div class="dialog-content">
        <div class="title">
          <slot name="title">
          </slot>
        </div>
        <div class="content-area">
          <slot name="content">
          </slot>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<style scoped>
.dialog {
  padding: 20px;
  width: 80vw;
  max-width: 956px;
  border-radius: 30px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
  align-self: center;
}

.close-button {
  width: 30px;
  height: 30px;
}

.dialog-content {
  padding: 31px 44px 30px 74px;
}

.title {
  font-family: Ubuntu;
  font-size: 30px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: var(--primary);
}

.content-area {
  margin-top: 20px;
}

.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    ". ."
    ". ."
    ". .";
}


</style>
