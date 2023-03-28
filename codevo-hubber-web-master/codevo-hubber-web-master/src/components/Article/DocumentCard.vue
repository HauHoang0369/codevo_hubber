<template>
  <v-card class="document-card">
    <div class="document-card-file">
      <img :src="IconDocument" :alt="file.name" />
    </div>
    <div class="document-card-content">
      <div class="document-card-name">{{ file.name }}</div>
      <div class="document-card-description">{{ file.description }}</div>
    </div>

    <div class="document-card-actions">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item :link="true" @click="onRemove">
            <v-list-item-title> Delete </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-card>
</template>

<script setup>
import IconDocument from '@/assets/icons/icon-detailed-doc@2x.png'

const emit = defineEmits(['on-remove-file'])

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

const onRemove = () => {
  emit('on-remove-file', props.index)
}
</script>

<style lang="scss">
.document-card {
  display: flex;
  position: relative;
  align-items: flex-start;
  border-radius: 10px;
  padding: 12px 12px 11px 14px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);

  .document-card-file {
    display: flex;
    margin-right: 17px;
    img {
      height: 76px;
    }
  }

  .document-card-content {
    display: flex;
    margin-top: 10px;
    flex-direction: column;
    row-gap: 10px;

    .document-card-name {
      padding-right: 25px;
      font-family: Ubuntu, serif;
      max-height: 42px;
      overflow: hidden;
      font-size: 18px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--text);
      word-break: break-all;
    }

    .document-card-description {
      font-family: Ubuntu, serif;
      font-size: 16px;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: var(--text);
      word-break: break-word;
    }
  }

  .document-card-actions {
    position: absolute;
    right: 0;
    top: 0;
    > button {
      box-shadow: none;
      border: 0;
      background: transparent;
    }
  }
}
</style>
