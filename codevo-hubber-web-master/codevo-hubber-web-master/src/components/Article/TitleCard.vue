<template>
  <v-card
    class="pa-4 mt-8 rounded-xl elevation-4 d-flex flex-row justify-space-between align-center"
  >
    <template #title> </template>

    <div class="w-100">
      <input
        class="article-title-input"
        type="text"
        placeholder="Inserisci titolo"
        v-model="title"
      />

      <div class="input-section">
        <div class="d-flex input-section-left">
          <base-select
            single-line
            label="Seleziona canale"
            :options="channels"
            v-model="channel"
            placeholder="Seleziona canale"
            label-property="name"
            value-property="id"
          />
        </div>

        <div class="d-flex input-section-right">
          <base-input label="Sovrascrivi autore" v-model="shownName" />

          <base-date-picker
            v-model="date"
            date-format="DD MMM YYYY"
            label="Seleziona Data"
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import BaseInput from '@/components/base/inputs/BaseInput'
import BaseDatePicker from '@/components/base/inputs/BaseDatePicker'
import BaseSelect from '@/components/base/inputs/BaseSelect'
import { useStore } from 'vuex'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    required: true,
  },
  author: {
    required: true,
  },
})

const emit = defineEmits(['set-channel', 'set-date', 'set-title', 'set-author'])

const store = useStore()

const channel = computed({
  get() {
    return store.state.articles.channelId
  },
  set(value) {
    store.commit('articles/setChannelId', value)
  },
})

const title = computed({
  get() {
    return props.title || ''
  },
  set(value) {
    emit('set-title', value)
  },
})

const date = computed({
  get() {
    return props.date || new Date()
  },
  set(value) {
    emit('set-date', value)
  },
})

const shownName = computed({
  get() {
    return props.author || ''
  },
  set(value) {
    emit('set-author', value)
  },
})

const channels = computed(() => store.state.articles.channels)
onMounted(() => {
  store.dispatch('articles/getChannels', 'ARTICLE')
})
</script>

<style lang="scss">
.article-title-input {
  outline: none;
  font-size: 50px;
  font-weight: bold;
  text-decoration: underline;
  color: $color-grey-dark;
  margin-bottom: 110px;

  &::placeholder {
    opacity: 0.3;
  }
}

.input-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.input-section-right {
  gap: 32px;
}

.input-section-left {
  width: 50%;
}
</style>
