<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FooterDesktop from '@/components/base/FooterDesktop/FooterDesktop';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import { ProducerForm } from '@/components/Producers';

const { t } = useI18n()

const producerName = ref('');

const links = computed(() => {
  return [
    { name: t('PARTY_VIEW_COMPETITORS_TITLE'), path: 'producers' },
    { name: t('PARTY_VIEW_COMPETITORS_TITLE') },
  ];
});

</script>

<template>
  <div class="producer-detail-page">
    <BreadCrumb
      :links="links"
      :title="producerName || $t('PARTY_CREATE_BUTTON_CAPTION')"
    />

    <h1 class="page-title text-clamp-2">{{producerName || $t('PARTY_CREATE_BUTTON_CAPTION')}}</h1>

    <div class="producer-card">
      <ProducerForm
        :mode="'CREATE'"
        @updateProducerName="(value) => producerName = value"
      />
    </div>
    <div class="page-footer">
      <FooterDesktop></FooterDesktop>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-title {
  font-size: 40px;
  font-weight: normal;
  line-height: 1.25;
  margin: 30px 0;
}

.producer-card {
  padding: 28px 30px 64px;
  border-radius: 30px;
  background: white;
  box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
  border: solid 1px rgba(221, 233, 255, 0.27);
}

.page-footer {
  margin-top: 166px;
}

.producer-detail-page {
  ::v-deep(.breadcrumb-primary-label) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    max-width: calc(100vw - 290px);
  }
}
</style>
