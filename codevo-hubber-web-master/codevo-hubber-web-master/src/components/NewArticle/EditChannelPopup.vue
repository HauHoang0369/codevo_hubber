<template>
  <DynamicPopup v-if="show" @closePopup="closeModal">
    <template #header>
      <span class="modal-title">
        Cambia il canale del post e la categoria
      </span>
    </template>

    <template #body>
      <div class="mt-10">
        <CategoryDropdown :categoryCode="categoryCode" class="my-6" />
      </div>
    </template>

    <template #footer>
      <button class="modal-confirm" @click.prevent="onSubmit">
        <span>{{ $t('PORTAL_CONFIRM_TITLE') }}</span>
      </button>
    </template>
  </DynamicPopup>
</template>

<script setup>
import DynamicPopup from '@/components/Popup/DynamicPopup'
import CategoryDropdown from '@/components/NewArticle/CategoryDropdown'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'

// eslint-disable-next-line
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const store = useStore()

const categoryCode = route.params.code.toString()

// const show = ref(props.show)
const emit = defineEmits(['modal-close'])

const closeModal = () => {
  emit('modal-close')
}

const onSubmit = async () => {
  if (
    store.state.articles.channelId ===
    store.state.articles.selectedChannelEdit?.id
  ) {
    // Not change channel id
    closeModal()
    return
  }

  if (store.state.articles.selectedChannelEdit) {
    const fd = new FormData()
    fd.append('id', route.params.id) // store.state.articles.currentArticle.id
    fd.append('channels', store.state.articles.selectedChannelEdit.id)

    await store
      .dispatch('articles/updateArticle', fd)
      .then(() => {
        store.commit(
          'articles/setChannelId',
          store.state.articles.selectedChannelEdit.id
        )
        closeModal()
      })
      .catch((response) => {
        Swal.fire({
          icon: 'error',
          titleText: response.message,
          customClass: {
            popup: 'hubber-swal-popup',
          },
        })
      })
  }
}
</script>

<style lang="scss" scoped>
.modal-confirm {
  margin-top: 32px;
}
</style>
