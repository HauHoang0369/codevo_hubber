<template>
  <dynamic-popup @closePopup="closeModal">
    <template #header>
      <span class="modal-title">
        Cambia il canale del post e la categoria
      </span>
    </template>

    <template #body>
      <base-select
        single-line
        label="Seleziona una categoria"
        :options="categories"
        v-model="category"
        placeholder="Seleziona una categoria"
        label-property="name"
        value-property="code"
      />

      <base-select
        single-line
        label="Seleziona un canale"
        :options="channels"
        v-model="channel"
        placeholder="Seleziona un canale"
        label-property="name"
        value-property="id"
      />
    </template>

    <template #footer>
      <button class="modal-confirm" @click="onConfirm">
        {{ $t('PORTAL_CONFIRM_TITLE') }}
      </button>
    </template>
  </dynamic-popup>
</template>
<script setup>
import DynamicPopup from '@/components/Popup/DynamicPopup.vue'
import BaseSelect from '@/components/base/inputs/BaseSelect.vue'
import { useStore } from 'vuex'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['modal-close', 'confirm'])

const store = useStore()
const route = useRoute()

onMounted(() => {
  store.dispatch('articles/getChannels', route.params.code)
  store.dispatch('categories/callCategories')
})

// CHANNELS
const channels = computed(() => store.state.articles.channels)
const channel = ref(null)

// CATEGORIES
const categories = computed(() => store.getters['categories/getCategories'])
const category = ref(null)
watch(category, () => {
  channel.value = null
  store.dispatch('articles/getChannels', category.value)
})
const onConfirm = () => emit('modal-close')
const closeModal = () => {
  emit('modal-close')
}
</script>
