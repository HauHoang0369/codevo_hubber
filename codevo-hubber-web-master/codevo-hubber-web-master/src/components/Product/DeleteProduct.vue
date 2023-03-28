<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
// icons
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
// components
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  product: Object,
})

const router = useRouter()
const store = useStore()
const emit = defineEmits(['close'])

const isLoading = ref(false)

const onClose = () => {
  emit('close')
}

const { t } = useI18n()
const deleteItem = async () => {
  isLoading.value = true
  const deleted = await store
    .dispatch('products/deleteProduct', props.product.id)
    .catch((error) => {
      console.log('error', error)
      Swal.fire({
        icon: 'error',
        titleText: t('PRODUCT_ERROR_DELETION_P001'),
        customClass: {
          popup: 'hubber-swal-popup',
        },
      })
    })
  if (deleted) {
    Swal.fire({
      icon: 'success',
      iconColor: '#00604b',
      titleText: 'Product deleted successfully',
      customClass: {
        popup: 'hubber-swal-popup',
      },
      didClose: () => {
        if (props.product?.globalProductId != null) {
          router.push('/products')
        } else {
          router.push('/globalproducts')
        }
      },
    })
  } else {
    Swal.fire({
      icon: 'error',
      titleText: t('PRODUCT_ERROR_DELETION_P001'),
      customClass: {
        popup: 'hubber-swal-popup',
      },
    })
  }
  onClose()
}
</script>

<template>
  <div class="hubber-dialog-box">
    <div class="dialog-close" v-on:click="onClose">
      <img :src="IconClose" class="close-icon" />
    </div>
    <div class="title-container d-flex flex-row justify-center">
      <div class="title">Elimina prodotto</div>
    </div>
    <div class="dialog-content">Vuoi davvero eliminare questo prodotto?</div>
    <div class="mt-13 mb-5 publish d-flex justify-center">
      <ButtonPrimaryDesktop
        :disabled="isLoading"
        class="hubber-btn-primary"
        @click="deleteItem"
      >
        {{ $t('PORTAL_CONFIRM_TITLE') }}
      </ButtonPrimaryDesktop>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
