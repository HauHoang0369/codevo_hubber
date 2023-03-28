<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import CloudService from '@/services/Cloud/CloudService'
// icons
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
// components
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'

const props = defineProps({
  cloudElement: Object
})

const isFolder = computed(() => props.cloudElement.documents)
const isDocument = computed(() => !props.cloudElement.documents)

const store = useStore()
const emit = defineEmits(['close', 'refreshCloudList'])

const isLoading = ref(false)

const onClose = () => {
  emit('close')
}

const deleteElement = async () => {
        store.commit('setLoading', true)
        try {
            if (isDocument.value) {
                await new CloudService().service.deleteDocument(props.cloudElement.id)
            } else {
                await new CloudService().service.deleteFolder(props.cloudElement.id)
            }
            emit('refreshCloudList')
            onClose()
        } catch (e) {
            console.log(e)
            await Swal.fire({
                icon: 'error',
                titleText: 'Something went wrong!',
                customClass: {
                    popup: 'hubber-swal-popup'
                }
            })
            onClose()
        }
}
</script>

<template>
  <div class='hubber-dialog-box'>
    <div class='dialog-close' v-on:click='onClose'>
      <img :src='IconClose' class='close-icon' />
    </div>
    <div class='title-container d-flex flex-row justify-center'>
      <div v-if="isFolder" class='title'>Elimina cartella</div>
      <div v-if="isDocument" class='title'>Elimina file</div>
    </div>
    <div v-if="isFolder" class='dialog-content'>
      Vuoi eliminare questa cartella?
    </div>
    <div v-if="isDocument" class='dialog-content'>
      Vuoi eliminare questo file?
    </div>
    <div class='mt-13 mb-5 publish d-flex justify-center'>
      <ButtonPrimaryDesktop :disabled='isLoading' class='hubber-btn-primary' @click='deleteElement'>
        Elimina
      </ButtonPrimaryDesktop>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.hubber-dialog-box {
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);

  .dialog-close {
    position: absolute;
    right: 20px;

    .close-icon {
      width: 30px;
      height: 30px;
      object-fit: contain;
      cursor: pointer;
    }
  }

  .title-container {
    .title {
      margin-top: 30px;
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-align: center;
      color: var(--primary);
    }
  }

  .dialog-content {
    font-size: 20px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: var(--text);
  }
}
</style>
