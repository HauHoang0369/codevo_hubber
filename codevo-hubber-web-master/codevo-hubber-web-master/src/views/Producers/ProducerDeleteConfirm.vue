<script setup>
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop.vue'
const emit = defineEmits(['close', 'confirm']);

const onClose = () => {
  emit('close');
}

const onConfirm = () => {
  emit('confirm')
}

</script>

<template>
  <div class="producer-delete-confirm">
    <v-card-title>
      <div class="dialog-close" v-on:click="onClose">
        <img :src="IconClose" alt="Close" class="close-icon" />
      </div>
      <div class="title-container d-flex flex-row justify-center">
        <div class="title">{{$t('COMPETITOR_DELETE_COMPETITOR_TITLE')}}</div>
      </div>
    </v-card-title>
    <v-card-text>
      <p class="dialog-content">
        {{$t('COMPETITOR_DELETE_CONFIRMATION_CAPTION')}}
      </p>
    </v-card-text>
    <v-card-actions class="mb-5 d-flex justify-center flex-column">
      <ButtonPrimaryDesktop
        class="hubber-btn"
        @click="onConfirm"
      >
        {{$t('PORTAL_CONFIRM_TITLE')}}
      </ButtonPrimaryDesktop>
    </v-card-actions>
  </div>
</template>

<style lang="scss" scoped>
.producer-delete-confirm {
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
      white-space: normal;
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

  .hubber-btn {
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
}
</style>
