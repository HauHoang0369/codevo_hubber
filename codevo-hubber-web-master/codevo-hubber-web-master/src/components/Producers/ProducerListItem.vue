<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import IconPending from '@/assets/icons/icon-system-pending.svg'
import IconReject from '@/assets/icons/icon-system-rejected.svg'

const router = useRouter();

const props = defineProps({
  producer: Object,
});

const producerImg = computed(() => {
  return props.producer.markets &&  props.producer.markets.length > 0 ? props.producer.markets[0].imageUrl : null;
});

const navigateToDetail = (producerId) => {
  router.push(`/producers/${producerId}`);
}

</script>

<template>
  <div class="producer-list-item" @click="navigateToDetail(producer.id)">
    <p class="producer-title">
      {{ producer.name }}
    </p>

    <div class="image-box">
      <v-tooltip :text="$t('PARTY_VIEW_PENDING_MESSAGE_TOOLTIP')" v-if="producer.approvalStatus === 'PENDING'">
        <template v-slot:activator="{ props }">
          <img v-bind="props" :src="IconPending" class="action-img" alt="" />
        </template>
      </v-tooltip>

      <v-tooltip :text="$t('PARTY_APPROVAL_STATUS_REJECTED')" v-if="producer.approvalStatus === 'REJECTED'">
        <template v-slot:activator="{ props }">
          <img v-bind="props" :src="IconReject" class="action-img" alt="" />
        </template>
      </v-tooltip>

      <img v-if="producerImg" :src="producerImg" class="producer-img" alt=""/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.producer-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 84px;
  padding: 8px 12px 8px 15px;
  margin-bottom: 10px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .producer-title {
    font-size: 18px;
    font-weight: bold;
    color: $color-text;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
    overflow: hidden;
  }

  .image-box {
    flex-shrink: 0;
    width: 69px;
    height: 69px;
    border-radius: 17px;
    position: relative;

    .action-img {
      position: absolute;
      width: 24px;
      height: 24px;
      right: -5px;
      top: 50%;
      transform: translateY(-50%);

      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
    }

    .producer-img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
    }
  }
}
</style>
