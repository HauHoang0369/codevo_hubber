<script setup>

import LoadMore from "@/components/base/LoadMore/LoadMore";
import {useSlots} from "vue";

const props = defineProps({
  title: String,
  more: Number,
  error: String,
  loading: Boolean,
  showMore: Boolean,
  loadMoreLabel: String,
  loadMoreAlign: String,
})
const emit = defineEmits(['loadMore'])
const slots = useSlots()

const onLoadMore = () => {
  emit('loadMore');
}

</script>

<template>
  <div>
    <div class="top-icon text-center" v-if="slots.topIcon">
      <slot name="topIcon"></slot>
    </div>
    <div class="d-flex
        flex-column
        flex-xxl-row
        flex-xl-row
        flex-lg-row
        flex-md-column
        flex-sm-column
        justify-space-between
        justify-xxl-space-between
        justify-xl-space-between
        justify-lg-space-between
        justify-md-start
        justify-sm-start
        align-start
        align-xxl-center
        align-xl-center
        align-lg-center
        align-md-start
        align-sm-start
    ">
      <div class="title" v-if="slots.title">
        <slot name="title"></slot>
      </div>
      <slot name="actions"></slot>
    </div>
    <div class="mt-14 description" v-if="slots.description">
      <slot name="description"></slot>
    </div>
    <div class="content-area">
      <slot></slot>
    </div>
    <LoadMore :more="more"
              :loading="loading"
              :error="error"
              :label="loadMoreLabel"
              :align="loadMoreAlign"
              :show-more="showMore" v-on:show-more="onLoadMore"
              v-if="!error"
    >
    </LoadMore>
    <div v-if="error">
      <div class="mt-10 d-flex justify-center align-center error-text">
        {{ error }}
      </div>
    </div>
  </div>
</template>


<style scoped>
.title {
  font-family: Ubuntu;
  font-size: 30px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: var(--primary);
}

.error-text {
  margin: 10px 0 0;
  font-family: Ubuntu;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.top-icon {
  margin-bottom: -27px;
}

.content-area {
  margin-top: 30px;
}

.description {
  font-family: Ubuntu;
  font-size: 20px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: var(--text);
}

</style>
